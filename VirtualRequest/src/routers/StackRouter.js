import NavigationActions from '../NavigationActions';
import pathToRegexp from 'path-';

function behavesLikePushAction(action) {
    return (
        action.type === Navigation.PUSH ||
        action.type === Navigation.REPLACE_WITH_ANIMATION
    )
}

export default (routeConfigs, stackConfig = {}) => {
    // Fail fast on invalid route definitions
    validateRouteConfigMap(routeConfigs);
    const childRouters = {};
    const routeNames = Object.keys(routeConfigs);
    // Loop through routes and find child routers
    routeNames.forEach(routeName => {
      const screen = getScreenForRouteName(routeConfigs, routeName);
      if (screen && screen.router) {
        // If it has a router it's a navigator.
        childRouters[routeName] = screen.router;
      } else {
        // If it doesn't have router it's an ordinary React component.
        childRouters[routeName] = null;
      }
    });
    const { initialRouteParams } = stackConfig;
    const initialRouteName = stackConfig.initialRouteName || routeNames[0];
    const initialChildRouter = childRouters[initialRouteName];
    const pathsByRouteNames = { ...stackConfig.paths } || {};
    let paths = [];
    function getInitialState(action) {
      let route = {};
      const childRouter = childRouters[action.routeName];
      // This is a push-like action, and childRouter will be a router or null if we are responsible for this routeName
      if (behavesLikePushAction(action) && childRouter !== undefined) {
        let childState = {};
        // The router is null for normal leaf routes
        if (childRouter !== null) {
          const childAction =
            action.action || NavigationActions.init({ params: action.params });
          childState = childRouter.getStateForAction(childAction);
        }
        return {
          key: 'StackRouterRoot',
          isTransitioning: false,
          index: 0,
          routes: [
            {
              params: action.params,
              ...childState,
              key: action.key || generateKey(),
              routeName: action.routeName,
            },
          ],
        };
      }
      if (initialChildRouter) {
        route = initialChildRouter.getStateForAction(
          NavigationActions.navigate({
            routeName: initialRouteName,
            params: initialRouteParams,
          })
        );
      }
      const params = (route.params || action.params || initialRouteParams) && {
        ...(route.params || {}),
        ...(action.params || {}),
        ...(initialRouteParams || {}),
      };
      route = {
        ...route,
        ...(params ? { params } : {}),
        routeName: initialRouteName,
        key: action.key || generateKey(),
      };
      return {
        key: 'StackRouterRoot',
        isTransitioning: false,
        index: 0,
        routes: [route],
      };
    }
    // Build paths for each route
    routeNames.forEach(routeName => {
      let pathPattern =
        pathsByRouteNames[routeName] || routeConfigs[routeName].path;
      let matchExact = !!pathPattern && !childRouters[routeName];
      if (pathPattern === undefined) {
        pathPattern = routeName;
      }
      const keys = [];
      let re, toPath, priority;
      if (typeof pathPattern === 'string') {
        // pathPattern may be either a string or a regexp object according to path-to-regexp docs.
        re = pathToRegexp(pathPattern, keys);
        toPath = pathToRegexp.compile(pathPattern);
        priority = 0;
      } else {
        // for wildcard match
        re = pathToRegexp('*', keys);
        toPath = () => '';
        matchExact = true;
        priority = -1;
      }
      if (!matchExact) {
        const wildcardRe = pathToRegexp(`${pathPattern}/*`, keys);
        re = new RegExp(`(?:${re.source})|(?:${wildcardRe.source})`);
      }
      pathsByRouteNames[routeName] = { re, keys, toPath, priority };
    });
    paths = Object.entries(pathsByRouteNames);
    paths.sort((a: [string, *], b: [string, *]) => b[1].priority - a[1].priority);
    return {
      getStateForAction(action, state) {
        // Set up the initial state if needed
        if (!state) {
          return getInitialState(action);
        }
        // Handle explicit push navigation action. This must happen after the
        // focused child router has had a chance to handle the action.
        if (
          behavesLikePushAction(action) &&
          childRouters[action.routeName] !== undefined
        ) {
  
          //Handle replaceWithAnimation action
          if (action.type === NavigationActions.REPLACE_WITH_ANIMATION) {
            state.routes = state.routes.map((eachRoute, index) => {
            // We only mark the current screen as dead.
              if (index === state.routes.length - 1) {
                if (eachRoute.params) {
                  eachRoute.params.willBeRemoved = true
                } else {
                  eachRoute.params = { willBeRemoved: true }
                }
              } 
              return eachRoute 
            })
          }
  
          return {
            removeAfterTransition: action.type === NavigationActions.REPLACE_WITH_ANIMATION,
          };
        }

        // Update transitioning state
        if (
          action.type === NavigationActions.COMPLETE_TRANSITION &&
          (action.key == null || action.key === state.key) &&
          state.isTransitioning
        ) {
  
          if (state.removeAfterTransition === true){
            let routes = state.routes
  
            routes = routes.filter((eachRoute) => {
              if (eachRoute.params && eachRoute.params.willBeRemoved) {
                state.index--
                return false
              }
              return true
            })
  
            return {
              ...state,
              routes: routes,
              isTransitioning: false,
              removeAfterTransition: false
            }
          }else{
            return {
              ...state,
              isTransitioning: false,
            };
          }
        }

       
        return state;
      },
      getActionForPathAndParams(pathToResolve, inputParams) {
        // If the path is empty (null or empty string)
        // just return the initial route action
        if (!pathToResolve) {
          return NavigationActions.navigate({
            routeName: initialRouteName,
          });
        }
        const [pathNameToResolve, queryString] = pathToResolve.split('?');
        // Attempt to match `pathNameToResolve` with a route in this router's
        // routeConfigs
        let matchedRouteName;
        let pathMatch;
        let pathMatchKeys;
        // eslint-disable-next-line no-restricted-syntax
        for (const [routeName, path] of paths) {
          const { re, keys } = path;
          pathMatch = re.exec(pathNameToResolve);
          if (pathMatch && pathMatch.length) {
            pathMatchKeys = keys;
            matchedRouteName = routeName;
            break;
          }
        }
        // We didn't match -- return null
        if (!matchedRouteName) {
          // If the path is empty (null or empty string)
          // just return the initial route action
          if (!pathToResolve) {
            return NavigationActions.navigate({
              routeName: initialRouteName,
            });
          }
          return null;
        }
        // Determine nested actions:
        // If our matched route for this router is a child router,
        // get the action for the path AFTER the matched path for this
        // router
        let nestedAction;
        let nestedQueryString = queryString ? '?' + queryString : '';
        if (childRouters[matchedRouteName]) {
          nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(
            pathMatch.slice(pathMatchKeys.length).join('/') + nestedQueryString
          );
          if (!nestedAction) {
            return null;
          }
        }
        // reduce the items of the query string. any query params may
        // be overridden by path params
        const queryParams = !isEmpty(inputParams)
          ? inputParams
          : (queryString || '').split('&').reduce((result, item) => {
              if (item !== '') {
                const nextResult = result || {};
                const [key, value] = item.split('=');
                nextResult[key] = value;
                return nextResult;
              }
              return result;
            }, null);
        // reduce the matched pieces of the path into the params
        // of the route. `params` is null if there are no params.
        const params = pathMatch.slice(1).reduce((result, matchResult, i) => {
          const key = pathMatchKeys[i];
          if (key.asterisk || !key) {
            return result;
          }
          const nextResult = result || {};
          const paramName = key.name;
          let decodedMatchResult;
          try {
            decodedMatchResult = decodeURIComponent(matchResult);
          } catch (e) {
            // ignore `URIError: malformed URI`
          }
          nextResult[paramName] = decodedMatchResult || matchResult;
          return nextResult;
        }, queryParams);
        return NavigationActions.navigate({
          routeName: matchedRouteName,
          ...(params ? { params } : {}),
          ...(nestedAction ? { action: nestedAction } : {}),
        });
      },
      getScreenOptions: createConfigGetter(
        routeConfigs,
        stackConfig.navigationOptions
      ),
      getScreenConfig: getScreenConfigDeprecated,
    };
  };