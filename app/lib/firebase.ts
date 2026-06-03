import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvVPg6BZbaEf1WgCMp9WanDP2JSkDHSZY",
  authDomain: "evlilik-finans-dda15.firebaseapp.com",
  projectId: "evlilik-finans-dda15",
  storageBucket: "evlilik-finans-dda15.firebasestorage.app",
  messagingSenderId: "452177593190",
  appId: "1:452177593190:web:d44eb2100f6c726566bea7",
  measurementId: "G-8E7PY9BXLC"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
