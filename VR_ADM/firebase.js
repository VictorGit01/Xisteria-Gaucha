import firebase from 'firebase';
import './src/fixtimerbug'

// Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyAneLouDhjjSeKDB-SVn07P369kW3ctU_U",
//     authDomain: "xisteriagaucha-f4611.firebaseapp.com",
//     databaseURL: "https://xisteriagaucha-f4611.firebaseio.com",
//     projectId: "xisteriagaucha-f4611",
//     storageBucket: "xisteriagaucha-f4611.appspot.com",
//     messagingSenderId: "147131751815",
//     appId: "1:147131751815:web:9aa7786bf3349abf884722",
//     measurementId: "G-RWD0M1VLF1"
//   };





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
//try {
    if ( !firebase.apps.length ) {
        firebase.initializeApp(firebaseConfig);
       }
// firebase.analytics();
//}catch(err) {
  //if (!/already exists/.test(err.message)) {
    //console.error("Firebase initialization error raised", err.stack)
  //}
//}

export default firebase;