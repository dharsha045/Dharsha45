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

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore with custom databaseId if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

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

// Test Connection per guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or network is unreachable.');
    }
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

  // Fallback without exposing raw internal error codes
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
