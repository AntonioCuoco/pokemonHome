// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider,getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqg3IwY6Bttjoeo53PgHpzj3New-Zjz54",
  authDomain: "pokehome-22e89.firebaseapp.com",
  projectId: "pokehome-22e89",
  storageBucket: "pokehome-22e89.appspot.com",
  messagingSenderId: "857387821608",
  appId: "1:857387821608:web:fad0ddff9fbe4f78c5231d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();