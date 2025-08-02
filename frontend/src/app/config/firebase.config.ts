// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiqBKjFmUCfN3DF_wZPPxD8lg9s8dqsKc",
  authDomain: "jalorineshop-9586f.firebaseapp.com",
  projectId: "jalorineshop-9586f",
  storageBucket: "jalorineshop-9586f.firebasestorage.app",
  messagingSenderId: "460898953841",
  appId: "1:460898953841:web:ae947f05ee73dedd14c9d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);
export default app;
