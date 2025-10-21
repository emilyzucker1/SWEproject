// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";


// https://firebase.google.com/docs/web/setup#available-libraries for additional libraries

const VITE_FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: "gifgiving-faa01.firebaseapp.com",
  projectId: "gifgiving-faa01",
  storageBucket: "gifgiving-faa01.firebasestorage.app",
  messagingSenderId: "863274232049",
  appId: "1:863274232049:web:eacf66c2d0bad3e3dca150",
  measurementId: "G-VZLZ9RX6QD"
};

// Initialize Firebase
const gifgivingApp = getApps().length 
? getApp()
: initializeApp(firebaseConfig);

const googleAuthProvider = new GoogleAuthProvider();
const auth = getAuth(gifgivingApp);
const user = auth.currentUser;
const email = ""

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const email = user.email;
  }
});

export { auth, googleAuthProvider, user, email };