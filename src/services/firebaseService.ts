import { sendPasswordResetEmail } from 'firebase/auth';
import app, { auth, db } from '../lib/firebase';

// Keep every Firebase feature on the same app instance. In particular, `db`
// is already connected to the configured named Firestore database rather than
// accidentally falling back to the project's `(default)` database.
export { app, db, auth };

export const isFirebaseConfigured = Boolean(app && auth);

export const resetUserPassword = async (email: string) => {
  if (!auth) {
    throw new Error('Firebase authentication is not configured. Please add valid Firebase credentials before using password reset.');
  }

  return await sendPasswordResetEmail(auth, email);
};
