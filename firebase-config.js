/**
 * CLASEHOY - FIREBASE CONFIGURATION
 * Uses Firebase Compat Libraries for easy integration with Vanilla JS
 */

const firebaseConfig = {
    apiKey: "AIzaSyB4ClN9STDsb3uoY7quCiS_8IeDFPi80WQ",
    authDomain: "clasehoy-577d8.firebaseapp.com",
    projectId: "clasehoy-577d8",
    storageBucket: "clasehoy-577d8.firebasestorage.app",
    messagingSenderId: "566257873691",
    appId: "1:566257873691:web:3fb8043dcec7dbcb1d19be"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Services
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase Initialized");
