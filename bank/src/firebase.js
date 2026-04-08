// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-K_tiPwjYG6cxq9hoarfGvXyl4frZYtc",
  authDomain: "bank-auth-f7c21.firebaseapp.com",
  projectId: "bank-auth-f7c21",
  storageBucket: "bank-auth-f7c21.firebasestorage.app",
  messagingSenderId: "160562295696",
  appId: "1:160562295696:web:2f0fc9616090f76801b915"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
