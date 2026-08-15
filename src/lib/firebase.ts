import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Debug: log effective project id so we can confirm deployed app's Firebase project
try {
  // eslint-disable-next-line no-console
  console.debug('[debug] firebase-applet-config projectId:', firebaseConfig.projectId);
  // eslint-disable-next-line no-console
  console.debug('[debug] initialized app projectId:', app.options?.projectId);
} catch (e) {
  // ignore
}

// Initialize Firebase Firestore & Auth
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export default app;
