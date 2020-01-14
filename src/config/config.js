import firebase from 'firebase';
import 'firebase/firestore';

// Base de CountryApp
const config = {
    apiKey: 'AIzaSyCuck_TCGJv5gSVrNVsRD-9r4amZ4CrwUM',
    authDomain: 'countryapp-f0ce1.firebaseapp.com',
    databaseURL: 'https://countryapp-f0ce1.firebaseio.com',
    projectId: 'countryapp-f0ce1',
    storageBucket: 'countryapp-f0ce1.appspot.com',
    messagingSenderId: '810428216960',
    appId: '1:810428216960:web:ffe81dcac50290a2'
};

// Base de LiveSafe
// const config = {
//     apiKey: 'AIzaSyC_6xPis8MppwEJZOb1RC9atc0ot2oh3Iw',
//     authDomain: 'livesafeweb.firebaseapp.com',
//     databaseURL: 'https://livesafeweb.firebaseio.com',
//     projectId: 'livesafeweb',
//     storageBucket: 'livesafeweb.appspot.com',
//     messagingSenderId: '1051085981085',
//     appId: '1:1051085981085:web:3176eb985b792175591b74'
// };

const Firebase = firebase.initializeApp(config);
const Database = firebase.firestore();

export { Firebase, Database };