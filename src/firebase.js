// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ THIS was missing!

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQ6qBxMhz8tm0tmukYdozHrPExgNKugek",
  authDomain: "brainwaves-securities.firebaseapp.com",
  projectId: "brainwaves-securities",
  storageBucket: "brainwaves-securities.firebasestorage.app",
  messagingSenderId: "681644199851",
  appId: "1:681644199851:web:ae430b0e658d5632a48cee",
  measurementId: "G-T695HDB9VB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // ✅ Fully working now
