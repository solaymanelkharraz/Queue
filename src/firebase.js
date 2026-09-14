import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCEGRQ-k0kZFMpYwX4PtJvY6emdOOS7j6Y",
  authDomain: "tasshilat-queue.firebaseapp.com",
  databaseURL: "https://tasshilat-queue-default-rtdb.europe-west1.firebasedatabase.app", 
  projectId: "tasshilat-queue",
  storageBucket: "tasshilat-queue.firebasestorage.app",
  messagingSenderId: "532066461790",
  appId: "1:532066461790:web:e3101119e172c69e942ccf"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);