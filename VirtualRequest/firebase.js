import firebase from 'firebase'
import './src/fixtimerbug'

var firebaseConfig = {
    apiKey: "AIzaSyCDzRGNG1IfVGoO9xbv5vYicBwdi4ExMOc",
    authDomain: "teste-xisteria.firebaseapp.com",
    databaseURL: "https://teste-xisteria.firebaseio.com",
    projectId: "teste-xisteria",
    storageBucket: "teste-xisteria.appspot.com",
    messagingSenderId: "745899798801",
    appId: "1:745899798801:web:a04724cb2c5f69cec11cb0",
    measurementId: "G-1HP23XP1XE"
};

// Initialize Firebase
if ( !firebase.apps.length ) {
    firebase.initializeApp(firebaseConfig);
}
  
export default firebase;