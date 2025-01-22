// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCpyj2rUlp63rkmB9yazmqCSSLZ7A3R2W0",
  authDomain: "bg-protection-plan-e69e6.firebaseapp.com",
  projectId: "bg-protection-plan-e69e6",
  storageBucket: "bg-protection-plan-e69e6.firebasestorage.app",
  messagingSenderId: "943172891392",
  appId: "1:943172891392:web:059ab4d48372b3e101b9e5",
  measurementId: "G-4ZERZ5KZ6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);