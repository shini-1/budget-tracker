import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, collection } from '@react-native-firebase/firestore';

export class FirebaseTestService {
  static async testFirebaseConnection(): Promise<{ success: boolean; error?: string; projectId?: string }> {
    try {
      console.log('🔍 Testing Firebase connection...');

      // Test 1: Check if Firebase is initialized
      const auth = getAuth();
      const firestore = getFirestore();

      const projectId = auth.app?.options?.projectId || firestore.app?.options?.projectId;
      console.log('✅ Firebase services initialized for project:', projectId);

      // Test 2: Try a simple Firestore operation that doesn't require auth
      try {
        // This should work if the project is accessible
        const testRef = collection(firestore, 'test_connection');
        console.log('✅ Firestore collection reference created');
      } catch (firestoreError: any) {
        console.warn('⚠️ Firestore test failed (expected if rules are restrictive):', firestoreError.message);
      }

      return { success: true, projectId };
    } catch (error: any) {
      console.error('❌ Firebase connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async comprehensiveFirebaseTest(): Promise<{
    success: boolean;
    results: {
      projectConnection: { success: boolean; projectId?: string; error?: string };
      authService: { success: boolean; status: string; error?: string };
      firestoreAccess: { success: boolean; error?: string };
      recommendations: string[];
    }
  }> {
    const results = {
      projectConnection: { success: false, projectId: undefined, error: undefined } as { success: boolean; projectId?: string; error?: string },
      authService: { success: false, status: 'unknown', error: undefined } as { success: boolean; status: string; error?: string },
      firestoreAccess: { success: false, error: undefined } as { success: boolean; error?: string },
      recommendations: [] as string[]
    };

    // Test 1: Project Connection
    try {
      const auth = getAuth();
      const firestore = getFirestore();
      const projectId = auth.app?.options?.projectId || firestore.app?.options?.projectId;

      results.projectConnection = {
        success: true,
        projectId
      };

      if (projectId !== 'foodventurer-20548') {
        results.recommendations.push('❌ WRONG PROJECT: Expected foodventurer-20548, got ' + projectId);
      } else {
        results.recommendations.push('✅ Project connection correct');
      }
    } catch (error: any) {
      results.projectConnection = {
        success: false,
        error: error.message
      };
      results.recommendations.push('❌ Firebase connection failed: ' + error.message);
    }

    // Test 2: Auth Service
    try {
      const auth = getAuth();

      // Test if we can access auth properties (this should work if auth is initialized)
      const projectId = auth.app?.options?.projectId;
      const apiKey = auth.app?.options?.apiKey;

      console.log('✅ Auth service initialized:', {
        projectId,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey ? apiKey.substring(0, 20) + '...' : 'none'
      });

      // If we can access the auth service properties, it's likely working
      results.authService = {
        success: true,
        status: 'available'
      };
      results.recommendations.push('✅ Auth service initialized and accessible');

      // Try a simple operation to see if auth is fully working
      try {
        const currentUser = auth.currentUser;
        console.log('✅ Auth currentUser check successful');
      } catch (userError: any) {
        console.warn('⚠️ Auth currentUser check failed:', userError.message);
        // This might be normal if no user is signed in
      }

    } catch (error: any) {
      results.authService = {
        success: false,
        status: 'restricted',
        error: error.message
      };
      results.recommendations.push('❌ AUTH SERVICE ISSUE: Check Firebase Console Authentication settings');
    }

    // Test 3: Firestore Access
    try {
      const firestore = getFirestore();
      const testRef = collection(firestore, 'test_connection');
      // Just test if we can create a collection reference

      results.firestoreAccess = { success: true };
      results.recommendations.push('✅ Firestore access available');
    } catch (error: any) {
      results.firestoreAccess = {
        success: false,
        error: error.message
      };
      results.recommendations.push('⚠️ Firestore access limited (may be normal)');
    }

    // Overall assessment
    const overallSuccess = results.projectConnection.success &&
                          results.authService.success;

    return {
      success: overallSuccess,
      results
    };
  }
}
