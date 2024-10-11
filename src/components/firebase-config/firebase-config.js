
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";





const firebaseConfig = {
  apiKey: "AIzaSyDjcxRhpdFth-aeRRu-hL3l92iWLgx8H1o",
  authDomain: "chat-app-ee436.firebaseapp.com",
  projectId: "chat-app-ee436",
  storageBucket: "chat-app-ee436.appspot.com",
  messagingSenderId: "764798330863",
  appId: "1:764798330863:web:0a649cc08ef72f5e37381a"
};


const app = initializeApp(firebaseConfig);

export const db= getFirestore(app)
export const auth= getAuth(app)
export const usersDbRef= collection(db,"users")
export const messagesDbRef= collection(db,"messages")



