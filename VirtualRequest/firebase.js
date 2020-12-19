import firebase from 'firebase'
import './src/fixtimerbug'
// import 'firebase/firebase-messaging'

// Comentado dia 01/12/2020 snelsonvictor68@gmail.com:
// var firebaseConfig = {
//     apiKey: "AIzaSyCDzRGNG1IfVGoO9xbv5vYicBwdi4ExMOc",
//     authDomain: "teste-xisteria.firebaseapp.com",
//     databaseURL: "https://teste-xisteria.firebaseio.com",
//     projectId: "teste-xisteria",
//     storageBucket: "teste-xisteria.appspot.com",
//     messagingSenderId: "745899798801",
//     appId: "1:745899798801:web:a04724cb2c5f69cec11cb0",
//     measurementId: "G-1HP23XP1XE"
// };

// // Initialize Firebase
// if ( !firebase.apps.length ) {
//     firebase.initializeApp(firebaseConfig);
// }

// nelson.aprendiz2018@gmail.com:
// var firebaseConfig = {
//     apiKey: "AIzaSyD-ILQBoWWwgnhsGhouTHoO9C5Ec1QYCko",
//     authDomain: "xisteria-test.firebaseapp.com",
//     databaseURL: "https://xisteria-test.firebaseio.com",
//     projectId: "xisteria-test",
//     storageBucket: "xisteria-test.appspot.com",
//     messagingSenderId: "52821853058",
//     appId: "1:52821853058:web:deb4c1bdb162c9b7b2059b",
//     measurementId: "G-T2MP0ZYDBR"
// };
// // Initialize Firebase
// if ( !firebase.apps.length ) {
//   firebase.initializeApp(firebaseConfig);
// }

// fdatabases001@gmail.com
var firebaseConfig = {
    apiKey: "AIzaSyBr2gXthRwcDBUJJNkId3ObHuNVq0xlJrQ",
    authDomain: "xisteria-gaucha.firebaseapp.com",
    databaseURL: "https://xisteria-gaucha.firebaseio.com",
    projectId: "xisteria-gaucha",
    storageBucket: "xisteria-gaucha.appspot.com",
    messagingSenderId: "752253752058",
    appId: "1:752253752058:web:e1d02ddce3f525d0302f43",
    measurementId: "G-665CGXG3R1"
};
// Initialize Firebase
if ( !firebase.apps.length ) {
    firebase.initializeApp(firebaseConfig);
}
  
export default firebase;