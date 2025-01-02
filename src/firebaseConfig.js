import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDpUm5qAg7G0ucMLd8mPDHapwJXI44LeHk",
    authDomain: "faradis14-2d020.firebaseapp.com",
    databaseURL: "https://faradis14-2d020-default-rtdb.firebaseio.com",
    projectId: "faradis14-2d020",
    storageBucket: "faradis14-2d020.appspot.com",
    messagingSenderId: "941869371327",
    appId: "1:941869371327:web:ff0b97c2e3c4d0f35c9b0a",
    measurementId: "G-5B3YHDP8DW",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);