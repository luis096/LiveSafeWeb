import firebase from "firebase";
import 'firebase/firestore';

const config = {
  apiKey: "AIzaSyCuck_TCGJv5gSVrNVsRD-9r4amZ4CrwUM",
  authDomain: "countryapp-f0ce1.firebaseapp.com",
  databaseURL: "https://countryapp-f0ce1.firebaseio.com",
  projectId: "countryapp-f0ce1",
  storageBucket: "countryapp-f0ce1.appspot.com",
  messagingSenderId: "810428216960",
  appId: "1:810428216960:web:ffe81dcac50290a2"
  }; 

  const Firebase = firebase.initializeApp(config);
  const Database = firebase.firestore();

  export {Firebase, Database};