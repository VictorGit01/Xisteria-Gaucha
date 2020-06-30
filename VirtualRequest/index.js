/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// console.error = (error) => error.apply;
// console.reportErrorAsExceptions = false;

AppRegistry.registerComponent(appName, () => App);
