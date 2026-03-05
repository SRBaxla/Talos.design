import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// TODO: Replace with your Firebase project config
// Go to Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
    apiKey: "AIzaSyAwa43RYZTxwkHLv5dvsw-iGFuTld9GHQE",
    authDomain: "talos-d74d7.firebaseapp.com",
    projectId: "talos-d74d7",
    storageBucket: "talos-d74d7.firebasestorage.app",
    messagingSenderId: "101652642009",
    appId: "1:101652642009:web:4c8acbf0adadd84362e6c8",
    measurementId: "G-9MNQFWQWVZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

