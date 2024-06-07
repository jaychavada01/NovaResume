import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import  { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAf8B1IiZO45DdfKLb4gKwWf9a7AAlfELI",
  authDomain: "novaresume-4d779.firebaseapp.com",
  projectId: "novaresume-4d779",
  storageBucket: "novaresume-4d779.appspot.com",
  messagingSenderId: "485222935199",
  appId: "1:485222935199:web:082ba76ed7b3fb336e50aa",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { auth, db, storage };
