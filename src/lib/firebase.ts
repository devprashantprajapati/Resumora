import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

// Use environment variables if available (for Vercel), otherwise fallback to AI Studio config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// If using custom Firebase (Vercel), use VITE_FIREBASE_DATABASE_ID if provided, otherwise default to undefined (which uses the '(default)' database).
// If using AI Studio (no VITE_FIREBASE_PROJECT_ID), use the generated AI studio databaseId.
const isCustomFirebase = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;
const databaseId = isCustomFirebase 
  ? (import.meta.env.VITE_FIREBASE_DATABASE_ID || undefined) 
  : defaultFirebaseConfig.firestoreDatabaseId;

// Initialize Firestore with offline persistence
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
}, databaseId);

export const googleProvider = new GoogleAuthProvider();
