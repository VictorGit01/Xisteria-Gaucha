const REPLACE_WITH_ANIMATION = 'Navigation/REPLACE_WITH_ANIMATION';

const createAction = (type, fn) => {
    fn.toString = () => type;
    return fn;
}

const replaceWithAnimation = createAction(REPLACE_WITH_ANIMATION, payload => ({
    type: REPLACE_WITH_ANIMATION,
    params: payload.params,
    action: payload.action,
    routeName: payload.routeName
}));

export default {
    // Action constants
    REPLACE_WITH_ANIMATION,

    // Action creators
    replaceWithAnimation
};