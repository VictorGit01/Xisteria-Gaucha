import firebase from 'firebase'
import './src/fixtimerbug'

var firebaseConfig = {
    apiKey: "AIzaSyA3vtEcK_JsUuHzV6wbgnF8Xf71xRU10Rw",
    authDomain: "xisteria-client.firebaseapp.com",
    databaseURL: "https://xisteria-client.firebaseio.com",
    projectId: "xisteria-client",
    storageBucket: "xisteria-client.appspot.com",
    messagingSenderId: "827229382080",
    appId: "1:827229382080:web:402054a0a8fbe20e871425",
    measurementId: "G-QQP5FSJC37"
};

// Initialize Firebase
if ( !firebase.apps.length ) {
    firebase.initializeApp(firebaseConfig);
}
  
export default firebase;