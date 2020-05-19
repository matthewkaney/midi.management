import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCLaX94IaPhTMOt4Sjv2Jy4wWHqu68fpEg',
  authDomain: 'midi-management.firebaseapp.com',
  projectId: 'midi-management',
});

export const database = firebase.firestore();
