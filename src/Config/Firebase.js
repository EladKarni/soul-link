import firebase from 'firebase'

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  databaseURL: process.env.REACT_APP_FIREBASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_ID,
  storageBucket: "",
  messagingSenderId: "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log(process.env.REACT_APP_FIREBASE_ID);

firebase.initializeApp(config);
firebase.firestore();

export default firebase