import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBnp1_XAqnmxXk3UD97Smaw17i5y9ZYMsU",
  authDomain: "test-6aad7.firebaseapp.com",
  projectId: "test-6aad7",
  storageBucket: "test-6aad7.appspot.com",
  messagingSenderId: "551436218968",
  appId: "1:551436218968:web:1b4e94dbca3b261bac502d"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage();
