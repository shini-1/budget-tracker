// Firebase Configuration

import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase configuration is automatically loaded from google-services.json
// No need to manually configure as it's handled by the plugin

// Export Firebase services
export { auth, firestore };

// Initialize Firebase (this is done automatically by the plugin)
// The app is initialized when the plugin loads

// Firebase configuration object (for reference)
export const firebaseConfig = {
  // Configuration is automatically loaded from google-services.json
  // This object is for reference only
  projectId: 'foodventurer-app', // Replace with your actual project ID
  appId: 'com.coldblooded.foodventurer',
  apiKey: 'your-api-key', // This will be loaded from google-services.json
  authDomain: 'foodventurer-app.firebaseapp.com',
  storageBucket: 'foodventurer-app.appspot.com',
  messagingSenderId: 'your-sender-id',
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
export const getFirebaseTimestamp = () => firestore.FieldValue.serverTimestamp();

// Batch operations helper
export const createBatch = () => firestore().batch();

// Transaction helper
export const runTransaction = (updateFunction: (transaction: any) => Promise<any>) =>
  firestore().runTransaction(updateFunction);
