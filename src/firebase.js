import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA6AAwv65DmqTP6KSKNUiM5QKSxPDaOimk",
    authDomain: "hijackumasschat.firebaseapp.com",
    projectId: "hijackumasschat",
    storageBucket: "hijackumasschat.firebasestorage.app",
    messagingSenderId: "989858441121",
    appId: "1:989858441121:web:4e5690140091496db08de0"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();