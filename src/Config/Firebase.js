import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

const config = {
  apiKey: 'AIzaSyCew8S2z0SkDxn3Lvf2INRqchqQaWUXJzc',
  authDomain: 'pokemon-soul-link.firebaseapp.com',
  databaseURL: 'https://pokemon-soul-link.firebaseio.com',
  projectId: 'pokemon-soul-link',
  storageBucket: 'pokemon-soul-link.appspot.com',
  messagingSenderId: '690709317909',
  appId: '1:690709317909:web:be113624d9f85123',
  measurementId: 'G-S5QKP22KEX',
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase;
