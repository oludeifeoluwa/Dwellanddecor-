import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Order, UserAccount, Product } from '../types';

export interface UserProfileData {
  uid: string;
  email: string;
  fullName: string;
  phone?: string;
  university?: string;
  dormHall?: string;
  roomNumber?: string;
  role?: 'user' | 'admin';
  points?: number;
  createdAt?: string;
}

// ================= FIRESTORE ERROR HANDLING ================= //

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn(`Firestore Info [${operationType} on ${path}]:`, errInfo.error);
  return errInfo;
}

// ================= AUTHENTICATION SERVICES ================= //

export const registerUser = async (email: string, pass: string, fullName: string): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  try {
    await updateProfile(userCredential.user, { displayName: fullName });
  } catch (err) {
    console.warn('Profile update warning:', err);
  }
  
  // Create default user profile in Firestore
  const newProfile: UserProfileData = {
    uid: userCredential.user.uid,
    email,
    fullName,
    role: 'user',
    points: 100, // Welcome reward bonus
    createdAt: new Date().toISOString()
  };
  try {
    await saveUserProfile(newProfile);
  } catch (err) {
    console.warn('Firestore user profile save notice:', err);
  }
  
  return userCredential.user;
};

export const loginUser = async (email: string, pass: string): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
};

export const loginUserWithGoogle = async (): Promise<FirebaseUser> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Save user profile to Firestore
  const newProfile: UserProfileData = {
    uid: result.user.uid,
    email: result.user.email || 'student@google.com',
    fullName: result.user.displayName || 'Google Student User',
    role: 'user',
    points: 200,
    createdAt: new Date().toISOString()
  };
  try {
    await saveUserProfile(newProfile);
  } catch (err) {
    console.warn('Firestore Google profile save notice:', err);
  }
  
  return result.user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Signout notice:', err);
  }
};

export const resetUserPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const onAuthSync = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback, (err) => {
    console.warn('Auth sync notice:', err);
  });
};

// ================= USER PROFILE SERVICES ================= //

export const saveUserProfile = async (profile: UserProfileData): Promise<void> => {
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.warn('Error saving user profile to Firestore:', err);
  }
};

export const fetchUserProfile = async (uid: string): Promise<UserProfileData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
    return null;
  }
};

// ================= REAL-TIME ORDERS SYNC ================= //

export const saveOrderToFirestore = async (order: Order): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      syncedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to save order to Firestore:', error);
    throw error;
  }
};

export const subscribeToRealtimeOrders = (
  userId: string | null, 
  onOrdersUpdated: (orders: Order[]) => void
) => {
  try {
    const ordersCol = collection(db, 'orders');
    
    // Listen for orders matching current user, or all if no user constraint
    const q = userId 
      ? query(ordersCol, where('userId', '==', userId))
      : query(ordersCol);

    return onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = [];
      snapshot.forEach((doc) => {
        fetchedOrders.push(doc.data() as Order);
      });
      
      // Sort by date descending
      fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      onOrdersUpdated(fetchedOrders);
    }, (error) => {
      console.warn('Firestore orders real-time listener notice:', error.message);
    });
  } catch (e) {
    console.warn('Could not establish real-time order subscription:', e);
    return () => {};
  }
};

export const updateOrderStatusInFirestore = async (orderId: string, status: Order['status']): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

// ================= REAL-TIME PRODUCTS SYNC ================= //

export const subscribeToRealtimeProducts = (onProductsUpdated: (products: Product[]) => void) => {
  try {
    const productsCol = collection(db, 'products');
    return onSnapshot(productsCol, (snapshot) => {
      // Always construct the products array (may be empty) and notify listeners
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push(doc.data() as Product);
      });
      onProductsUpdated(prods);
    }, (error) => {
      console.warn('Firestore products listener info:', error.message);
    });
  } catch {
    return () => {};
  }
};

export const updateProductInFirestore = async (productId: string, updates: Partial<Product>): Promise<void> => {
  try {
    const pRef = doc(db, 'products', productId);
    await setDoc(pRef, updates, { merge: true });
  } catch (e) {
    console.warn('Failed to update product in Firestore:', e);
  }
};

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    const pRef = doc(db, 'products', productId);
    await deleteDoc(pRef);
  } catch (e) {
    console.warn('Failed to delete product from Firestore:', e);
    // Re-throw so callers can handle rollback/notify
    throw e;
  }
};

export const seedProductsToFirestore = async (productsList: Product[]): Promise<void> => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    const validIds = new Set(productsList.map(p => p.id));
    
    // Purge any stale, mock or corrupted product documents from earlier tests
    for (const d of snapshot.docs) {
      if (!validIds.has(d.id) && !d.id.startsWith('custom-')) {
        try {
          await deleteDoc(d.ref);
        } catch {
          // ignore
        }
      }
    }

    // Upsert all products with verified images
    for (const p of productsList) {
      const pRef = doc(db, 'products', p.id);
      await setDoc(pRef, p, { merge: true });
    }
  } catch (e) {
    console.warn('Product seeding skipped or error:', e);
  }
};

// ================= STORE GLOBAL SETTINGS SYNC ================= //

export interface StoreSettings {
  whatsappNumber: string;
  ownerRoomAddress: string;
}

export const saveStoreSettingsToFirestore = async (settings: Partial<StoreSettings>): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', 'store_config');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (e) {
    console.warn('Failed to save store settings to Firestore:', e);
  }
};

export const subscribeToRealtimeStoreSettings = (onSettingsUpdated: (settings: Partial<StoreSettings>) => void) => {
  try {
    const settingsRef = doc(db, 'settings', 'store_config');
    return onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        onSettingsUpdated(snapshot.data() as StoreSettings);
      }
    }, (error) => {
      console.warn('Firestore store settings listener info:', error.message);
    });
  } catch {
    return () => {};
  }
};
