import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB2vukm7rhfbWK9IQGcz20I8f_bwmdtXC4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'time-budget-6e563.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'time-budget-6e563',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'time-budget-6e563.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '667887044952',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:667887044952:web:0aae1b12f7acb5ff733d2d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

