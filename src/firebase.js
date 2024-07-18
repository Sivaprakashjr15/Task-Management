import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDvwvcZwfScfg7plBsrLZEGbc4GiM3ZmO4",
  authDomain: "task-management-d0684.firebaseapp.com",
  projectId: "task-management-d0684",
  storageBucket: "task-management-d0684.appspot.com",
  messagingSenderId: "850475807508",
  appId: "1:850475807508:web:3cfbc60b8cd28b04b90801",
  measurementId: "G-3G1EHBPHKH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();