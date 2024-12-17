import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXC8mrz5P46JhsFyU9AxsGqbNfGbyQUok",
  authDomain: "nelkpro.firebaseapp.com",
  projectId: "nelkpro",
  storageBucket: "nelkpro.firebasestorage.app",
  messagingSenderId: "197558701827",
  appId: "1:197558701827:web:ce96f324a6f19ab43f6336"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);