// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5TDDuhNdETav6dAxvhVvR2H2uq53auOw",
    authDomain: "e-commerce-e4a9b.firebaseapp.com",
    projectId: "e-commerce-e4a9b",
    storageBucket: "e-commerce-e4a9b.firebasestorage.app",
    messagingSenderId: "1030760849816",
    appId: "1:1030760849816:web:2ea1ca94ecf452318dcbed",
    measurementId: "G-Q2ZRSMQ2MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

/*
npm install firebase

npm install -g firebase-tools

firebase login
firebase init
firebase deploy
 */

/*
git commit -m " "
git push -u origin main

git pull origin main
 */