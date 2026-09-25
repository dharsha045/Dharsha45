import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  reload
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { BloodGroup } from '../types';

// Resolve configuration from json or environment variables
const resolvedConfig = {
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfig?.projectId || 'original-flag-vnm8c',
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfig?.appId || '1:371470662405:web:6afe48560bfbb156dc956c',
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfig?.apiKey || 'AIzaSyDn5AghLgDmE_cNshaUIk_T4lqfqmBhEOM',
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig?.authDomain || 'original-flag-vnm8c.firebaseapp.com',
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig?.firestoreDatabaseId || 'ai-studio-lifelinksmartblo-770e1c6a-9341-4762-b132-1cf4239fc443',
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig?.storageBucket || 'original-flag-vnm8c.firebasestorage.app',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig?.messagingSenderId || '371470662405',
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore with custom databaseId and long polling transport
// experimentalForceLongPolling eliminates stream connection drops (code=unavailable) behind proxies/iframes
const firestoreDbId = resolvedConfig.firestoreDatabaseId && resolvedConfig.firestoreDatabaseId !== '(default)'
  ? resolvedConfig.firestoreDatabaseId
  : undefined;

export const db = firestoreDbId
  ? initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
        ignoreUndefinedProperties: true,
      },
      firestoreDbId
    )
  : initializeFirestore(app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    });

// Firestore User Document Interface
export interface FirestoreUserData {
  name: string;
  email: string;
  profilePhoto: string;
  phone: string;
  bloodGroup: BloodGroup;
  state: string;
  district: string;
  isDonor: boolean;
  emailVerified: boolean;
  loginProvider: 'email' | 'google';
  createdAt: string;
}

// Test Connection safely without throwing unauthenticated rule violations
export async function testFirestoreConnection(): Promise<boolean> {
  if (!auth.currentUser) return true;
  try {
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    await getDoc(userDocRef);
    return true;
  } catch {
    return false;
  }
}

// User Profile Operations
export async function getFirestoreUser(uid: string): Promise<FirestoreUserData | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserData;
    }
    return null;
  } catch (err) {
    console.error('Error fetching Firestore user profile:', err);
    return null;
  }
}

export async function createFirestoreUser(uid: string, data: FirestoreUserData): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await setDoc(userDocRef, data, { merge: true });
}

export async function updateFirestoreUser(uid: string, data: Partial<FirestoreUserData>): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, data);
}

// Search Donors across Firestore
export async function queryFirestoreDonors(params: {
  bloodGroup?: BloodGroup | 'All';
  state?: string;
  district?: string;
}): Promise<Array<FirestoreUserData & { id: string }>> {
  try {
    const usersCol = collection(db, 'users');
    let q = query(usersCol, where('isDonor', '==', true));

    if (params.bloodGroup && params.bloodGroup !== 'All') {
      q = query(q, where('bloodGroup', '==', params.bloodGroup));
    }
    if (params.state) {
      q = query(q, where('state', '==', params.state));
    }
    if (params.district) {
      q = query(q, where('district', '==', params.district));
    }

    const querySnapshot = await getDocs(q);
    const results: Array<FirestoreUserData & { id: string }> = [];
    querySnapshot.forEach((docSnap) => {
      results.push({
        id: docSnap.id,
        ...(docSnap.data() as FirestoreUserData)
      });
    });
    return results;
  } catch (err) {
    console.warn('Error querying Firestore donors:', err);
    return [];
  }
}

// User-friendly Firebase Error Mapper
export function formatAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code: string = error.code || '';
  const message: string = error.message || '';

  if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return 'Password should be at least 6 characters long.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return 'An account with this email already exists. Please sign in.';
  }
  if (
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential' ||
    message.includes('wrong-password') ||
    message.includes('invalid-credential')
  ) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (code === 'auth/user-not-found' || message.includes('user-not-found')) {
    return 'No registered account found with this email. Please sign up.';
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return 'Google sign-in was cancelled. Please try again.';
  }
  if (code === 'auth/popup-blocked' || message.includes('popup-blocked')) {
    return 'Sign-in popup was blocked by your browser. Please allow popups for LifeLink.';
  }
  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return 'Network connection error. Please check your internet connection and try again.';
  }
  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return 'Too many attempts. For security reasons, please wait a minute before trying again.';
  }
  if (
    code === 'auth/account-exists-with-different-credential' ||
    message.includes('account-exists-with-different-credential')
  ) {
    return 'An account with this email already exists using Email & Password. Please sign in with your email and password.';
  }
  if (code === 'auth/email-verification-pending') {
    return 'Please verify your email before continuing.';
  }
  if (code === 'auth/unauthorized-domain' || message.includes('unauthorized-domain')) {
    return 'GitHub Pages domain unauthorized in Firebase: Please add your domain (e.g. github.io or your-username.github.io) in Firebase Console > Authentication > Settings > Authorized domains.';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return 'Google Sign-In is disabled in Firebase Console. Go to Firebase Console > Authentication > Sign-in method > Google and click Enable.';
  }
  if (code === 'auth/cancelled-popup-request' || message.includes('cancelled-popup-request')) {
    return 'Sign-in was interrupted by another popup request. Please try again.';
  }

  // Fallback with readable message
  console.error('[Firebase Auth Error Details]', { code, message, error });
  if (code) {
    return `Authentication failed (${code.replace('auth/', '')}). Please check your Firebase settings or internet connection.`;
  }
  return message && !message.includes('Firebase:')
    ? message
    : 'Authentication could not be completed. Please check your details and try again.';
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  reload
};
export type { FirebaseUser };
