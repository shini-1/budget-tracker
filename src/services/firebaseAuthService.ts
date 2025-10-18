// Firebase Authentication Service

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User, UserRole, LoginForm, RegisterForm } from '../types';
import { COLLECTIONS, getFirebaseErrorMessage } from '../config/firebase';

class FirebaseAuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      if (!user) {
        throw new Error('Authentication failed');
      }

      // Get user data from Firestore
      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .get();

      if (!userDoc.exists) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      
      return {
        id: user.uid,
        email: user.email || '',
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phoneNumber: userData?.phoneNumber || '',
        role: userData?.role || 'user',
        profileImage: userData?.profileImage || null,
        isVerified: userData?.isVerified || false,
        preferences: userData?.preferences || {},
        createdAt: userData?.createdAt?.toDate() || new Date(),
        updatedAt: userData?.updatedAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error.code);
      throw new Error(errorMessage);
    }
  }

  // Register new user
  async register(userData: RegisterForm): Promise<User> {
    try {
      // Create user account
      const userCredential = await auth().createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );
      
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
        profileImage: null,
        isVerified: false,
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .set({
          ...newUser,
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
      const user = auth().currentUser;
      if (!user) {
        return null;
      }

      const userDoc = await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      
      return {
        id: user.uid,
        email: user.email || '',
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        phoneNumber: userData?.phoneNumber || '',
        role: userData?.role || 'user',
        profileImage: userData?.profileImage || null,
        isVerified: userData?.isVerified || false,
        preferences: userData?.preferences || {},
        createdAt: userData?.createdAt?.toDate() || new Date(),
        updatedAt: userData?.updatedAt?.toDate() || new Date(),
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
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Delete user account
  async deleteUser(): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      // Delete user document from Firestore
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(user.uid)
        .delete();

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
      const user = auth().currentUser;
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
      const user = auth().currentUser;
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
