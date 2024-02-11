// Firebase
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC16uqe5uh95Jj5dVLj8yQ66mMJw4dXFEk",
  authDomain: "modest-progress-todo.firebaseapp.com",
  projectId: "modest-progress-todo",
  storageBucket: "modest-progress-todo.appspot.com",
  messagingSenderId: "166668469022",
  appId: "1:166668469022:web:8d0c652414d6191f413f0f",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
