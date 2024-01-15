import firebase from "firebase/compat/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyDl_lNWqpHet2HKNFB-D50umKyitHWLRu8",
    authDomain: "mrsound.firebaseapp.com",
    databaseURL: "https://mrsound-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mrsound",
    storageBucket: "mrsound.appspot.com",
    messagingSenderId: "938292048517",
    appId: "1:938292048517:web:18e9adb462d8a204e02fec",
    measurementId: "G-YW6NNFQ7JX"
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  
  const db = getDatabase();
  
  export { db };