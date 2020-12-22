import firebase from 'firebase'
import './src/fixtimerbug'
// import 'firebase/firebase-messaging'
// import { FIREBASE_CONFIG } from '@env'
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

// var firebaseConfig = FIREBASE_CONFIG;
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
  
export default firebase;