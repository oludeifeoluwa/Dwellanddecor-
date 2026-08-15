import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { getStorage } from "firebase/storage";
import appConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appConfig.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appConfig.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appConfig.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appConfig.appId || "",
};

const hasValidFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'INVALID_API_KEY' &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = hasValidFirebaseConfig
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;
const storage = app ? getStorage(app) : null;

export { app, db, auth, storage };

export const isFirebaseConfigured = Boolean(app && auth);

export const resetUserPassword = async (email: string) => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured. Please add valid Firebase credentials before using password reset.');
  }

  return await sendPasswordResetEmail(auth, email);
};