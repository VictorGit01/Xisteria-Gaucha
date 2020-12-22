import firebase from 'firebase';
import './src/fixtimerbug';

var firebaseConfig = {/* Your web app's Firebase configuration */};

if ( !firebase.apps.length ) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;