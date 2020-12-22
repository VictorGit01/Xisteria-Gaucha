import firebase from 'firebase';
import './src/fixtimerbug';
// import { FIREBASE_CONFIG, FIREBASE_CONFIG_TEST } from '@env';
import { 
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from '@env';

// var firebaseConfig = {
//   apiKey: FIREBASE_CONFIG.apiKey,
//   authDomain: FIREBASE_CONFIG.authDomain,
//   databaseURL: FIREBASE_CONFIG.databaseURL,
//   projectId: FIREBASE_CONFIG.projectId,
//   storageBucket: FIREBASE_CONFIG.storageBucket,
//   messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
//   appId: FIREBASE_CONFIG.appId,
//   measurementId: FIREBASE_CONFIG.measurementId,
// }

// var firebaseConfig = {
//   apiKey: process.env['API_KEY'],
//   authDomain: process.env['AUTH_DOMAIN'],
//   databaseURL: process.env['DATABASE_URL'],
//   projectId: process.env['PROJECT_ID'],
//   storageBucket: process.env['STORAGE_BUCKET'],
//   messagingSenderId: process.env['MESSAGING_SENDER_ID'],
//   appId: process.env['APP_ID'],
//   measurementId: process.env['MEASUREMENT_ID'],
// }

var firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
}
// Initialize Firebase
if ( !firebase.apps.length ) {
  firebase.initializeApp(firebaseConfig);
}
// firebase.analytics();

export default firebase;