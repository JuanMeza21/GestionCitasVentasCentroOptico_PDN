import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOgqpgd3NeKsVNI9FUMuYIEqC7M_5rW_g",
  authDomain: "gcvco-59559.firebaseapp.com",
  projectId: "gcvco-59559",
  storageBucket: "gcvco-59559.firebasestorage.app",
  messagingSenderId: "805569281227",
  appId: "1:805569281227:web:760688f8bbb99b975caf4e",
  measurementId: "G-XQ058F1Y0N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, db }; 
