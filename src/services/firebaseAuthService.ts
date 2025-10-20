// Firebase Authentication Service

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { User, UserRole, LoginForm, RegisterForm } from '../types';
import { COLLECTIONS, getFirebaseErrorMessage } from '../config/firebase';

// Firestore user data interface (matches what we store in Firestore)
interface FirestoreUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  profileImage?: string;
  isVerified: boolean;
  preferences: Record<string, any>;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

class FirebaseAuthService {
  // Fallback sign in method (for testing - skips Firestore data)
  async signInBasic(email: string, password: string): Promise<User> {
    try {
      console.log('🔄 Using fallback authentication (no Firestore)...');
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('✅ Basic authentication successful for user:', userCredential.user.email);

      const user = userCredential.user;

      // Return minimal user data without Firestore lookup
      return {
        id: user.uid,
        email: user.email || '',
        firstName: 'Test', // Default values for fallback
        lastName: 'User',
        phoneNumber: '',
        role: 'user' as UserRole,
        avatar: undefined,
        isVerified: user.emailVerified,
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Firebase basic authentication error:', {
        code: error.code,
        message: error.message,
        fullError: error,
      });
      const errorMessage = getFirebaseErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('Attempting to sign in user:', email);
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('Sign in successful for user:', userCredential.user.email);
      const user = userCredential.user;
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      // Get user data from Firestore
      const userDocRef = firestore().collection(COLLECTIONS.USERS).doc(user.uid);
      const userDoc = await userDocRef.get();

      // If user profile doesn't exist in Firestore, create it
      if (!userDoc.exists()) {
        console.log('User profile not found in Firestore, creating default profile...');
        
        // Extract name from email or use defaults
        const emailName = user.email?.split('@')[0] || 'User';
        const nameParts = emailName.split(/[._-]/);
        const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || 'User';
        const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || '';
        
        // Create default user profile
        const defaultUserData = {
          firstName,
          lastName,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          role: 'user' as UserRole,
          profileImage: user.photoURL || null,
          isVerified: user.emailVerified,
          preferences: {},
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        };

        await userDocRef.set(defaultUserData);
        
        return {
          id: user.uid,
          email: user.email || '',
          firstName,
          lastName,
          phoneNumber: user.phoneNumber || undefined,
          role: 'user' as UserRole,
          avatar: user.photoURL || undefined,
          isVerified: user.emailVerified,
          createdAt: user.metadata.creationTime || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const userData = userDoc.data() as FirestoreUserData;
      
      return {
        id: user.uid,
        email: user.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        avatar: userData.profileImage,
        isVerified: userData.isVerified,
        createdAt: userData.createdAt.toDate().toISOString(),
        updatedAt: userData.updatedAt.toDate().toISOString(),
      };
    } catch (error: any) {
      console.error('Firebase authentication error in signIn:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      const errorMessage = getFirebaseErrorMessage(error?.code);
      throw new Error(errorMessage || error?.message || 'Authentication failed');
    }
  }

  // Register new user
  async register(userData: RegisterForm): Promise<User> {
    try {
      // Create user account
      const userCredential = await auth().createUserWithEmailAndPassword(userData.email, userData.password);
      
      const user = userCredential.user;
      if (!user) {
        throw new Error('Registration failed');
      }

      // Update user profile
      await user.updateProfile({
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      // Create user document in Firestore
      const newUser: User = {
        id: user.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        avatar: undefined,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await firestore().collection(COLLECTIONS.USERS).doc(user.uid).set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        profileImage: null,
        isVerified: false,
        preferences: {},
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      return newUser;
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const currentAuth = auth();
      const user = currentAuth.currentUser;
      if (!user) {
        return null;
      }

      const userDoc = await firestore().collection(COLLECTIONS.USERS).doc(user.uid).get();

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as FirestoreUserData;
      
      return {
        id: user.uid,
        email: user.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        avatar: userData.profileImage,
        isVerified: userData.isVerified,
        createdAt: userData.createdAt.toDate().toISOString(),
        updatedAt: userData.updatedAt.toDate().toISOString(),
      };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      // Convert User interface fields to Firestore fields
      const firestoreUpdates: Partial<FirestoreUserData> = {};

      if (updates.firstName !== undefined) firestoreUpdates.firstName = updates.firstName;
      if (updates.lastName !== undefined) firestoreUpdates.lastName = updates.lastName;
      if (updates.email !== undefined) firestoreUpdates.email = updates.email;
      if (updates.phoneNumber !== undefined) firestoreUpdates.phoneNumber = updates.phoneNumber;
      if (updates.role !== undefined) firestoreUpdates.role = updates.role;
      if (updates.avatar !== undefined) firestoreUpdates.profileImage = updates.avatar;
      if (updates.isVerified !== undefined) firestoreUpdates.isVerified = updates.isVerified;

      firestoreUpdates.updatedAt = firestore.FieldValue.serverTimestamp() as any;

      await firestore().collection(COLLECTIONS.USERS).doc(userId).update(firestoreUpdates);
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Delete user account
  async deleteUser(): Promise<void> {
    try {
      const currentAuth = auth();
      const user = currentAuth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      // Delete user document from Firestore
      await firestore().collection(COLLECTIONS.USERS).doc(user.uid).delete();

      // Delete user account
      await user.delete();
    } catch (error: any) {
      throw new Error('Failed to delete account');
    }
  }

  // Listen to authentication state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await this.getCurrentUser();
          callback(user);
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Refresh token
  async refreshToken(): Promise<string> {
    try {
      const currentAuth = auth();
      const user = currentAuth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      const token = await user.getIdToken(true);
      return token;
    } catch (error: any) {
      throw new Error('Failed to refresh token');
    }
  }

  // Get ID token
  async getIdToken(): Promise<string | null> {
    try {
      const currentAuth = auth();
      const user = currentAuth.currentUser;
      if (!user) {
        return null;
      }

      return await user.getIdToken();
    } catch (error: any) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
