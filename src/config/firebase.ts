// Firebase Configuration

import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, serverTimestamp, writeBatch, runTransaction } from '@react-native-firebase/firestore';

// Initialize Firebase services using v22 modular API
// React Native Firebase automatically initializes the app
export const auth = getAuth();
export const firestore = getFirestore();

// Debug logging
console.log('🔍 Firebase Configuration Check:');
console.log('Project ID from google-services.json:', 'foodventurer-20548');
console.log('Package name from google-services.json:', 'com.codeblooded.foodventurer');
console.log('API Key from google-services.json:', 'AIzaSyAUH7AIvFDuBO-_hI8VFqZsB6Dt3B1rn0M');

console.log('Firebase initialized:', {
  auth: !!auth,
  firestore: !!firestore,
  authApp: auth.app?.name,
  firestoreApp: firestore.app?.name,
  authProjectId: auth.app?.options?.projectId,
  firestoreProjectId: firestore.app?.options?.projectId,
});

// Test Firebase connectivity
console.log('🔍 Testing Firebase connectivity...');
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? 'User logged in' : 'No user');
});

// Initialize Firebase (this is done automatically by the plugin)
// The app is initialized when the plugin loads

// Firebase configuration object (for reference)
export const firebaseConfig = {
  // Configuration is automatically loaded from google-services.json
  // This object is for reference only
  projectId: 'foodventurer-20548', // Updated to match google-services.json
  appId: 'com.codeblooded.foodventurer', // Updated to match google-services.json
  apiKey: 'AIzaSyAUH7AIvFDuBO-_hI8VFqZsB6Dt3B1rn0M', // From google-services.json
  authDomain: 'foodventurer-20548.firebaseapp.com',
  storageBucket: 'foodventurer-20548.firebasestorage.app',
  messagingSenderId: '291044185235',
};

// Firebase collections
export const COLLECTIONS = {
  USERS: 'users',
  BUSINESSES: 'businesses',
  REVIEWS: 'reviews',
  FAVORITES: 'favorites',
  CATEGORIES: 'categories',
  ANALYTICS: 'analytics',
} as const;

// Firebase error codes
export const FIREBASE_ERRORS = {
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  INVALID_EMAIL: 'auth/invalid-email',
  NETWORK_ERROR: 'auth/network-request-failed',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
} as const;

// Helper function to get user-friendly error messages
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case FIREBASE_ERRORS.USER_NOT_FOUND:
      return 'No account found with this email address.';
    case FIREBASE_ERRORS.WRONG_PASSWORD:
      return 'Incorrect password. Please try again.';
    case FIREBASE_ERRORS.EMAIL_ALREADY_IN_USE:
      return 'An account with this email already exists.';
    case FIREBASE_ERRORS.WEAK_PASSWORD:
      return 'Password should be at least 6 characters long.';
    case FIREBASE_ERRORS.INVALID_EMAIL:
      return 'Please enter a valid email address.';
    case FIREBASE_ERRORS.NETWORK_ERROR:
      return 'Network error. Please check your internet connection.';
    case FIREBASE_ERRORS.TOO_MANY_REQUESTS:
      return 'Too many failed attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
};

// Firebase timestamp helper
export const getFirebaseTimestamp = () => serverTimestamp();

// Batch operations helper
export const createBatch = () => writeBatch(firestore);

// Transaction helper
export const runTransactionHelper = (updateFunction: (transaction: any) => Promise<any>) =>
  runTransaction(firestore, updateFunction);
