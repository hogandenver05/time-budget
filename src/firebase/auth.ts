import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User } from '../types/user';
import { seedDefaultCategories } from './seedCategories';
import { deleteUserData } from './firestore';

const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    // Note: Firebase Auth doesn't store displayName directly, we'll store it in Firestore
    await createUserDocument(user, { displayName });
    
    return user;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error(
        'Firebase Authentication is not enabled. Please enable it in Firebase Console: ' +
        'Authentication > Sign-in method > Enable Email/Password'
      );
    }
    throw error;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user document exists, create if not
    await ensureUserDocument(user);
    
    return user;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error(
        'Firebase Authentication is not enabled. Please enable it in Firebase Console: ' +
        'Authentication > Sign-in method > Enable Email/Password'
      );
    }
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    
    // Check if user document exists, create if not
    await ensureUserDocument(user);
    
    return user;
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error(
        'Firebase Authentication is not enabled. Please enable it in Firebase Console: ' +
        'Authentication > Sign-in method > Enable Google'
      );
    }
    throw error;
  }
}

/**
 * Sign out
 */
export async function logOut() {
  await signOut(auth);
}

/**
 * Delete user account and all associated data
 */
export async function deleteAccount(userId: string) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  // Delete all user data from Firestore
  await deleteUserData(userId);

  // Delete the user account from Firebase Auth
  await deleteUser(user);
}

/**
 * Create or update user document in Firestore
 */
async function createUserDocument(
  firebaseUser: FirebaseUser,
  additionalData?: { displayName?: string }
) {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { displayName, email } = firebaseUser;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const userData: User = {
      displayName: additionalData?.displayName || displayName || email?.split('@')[0] || 'User',
      email: email || '',
      timeZone,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
    
    await setDoc(userRef, userData);
    
    // Seed default categories for new users
    await seedDefaultCategories(firebaseUser.uid);
  }
}

/**
 * Ensure user document exists (for existing users who might not have one)
 */
async function ensureUserDocument(firebaseUser: FirebaseUser) {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await createUserDocument(firebaseUser);
  }
}

