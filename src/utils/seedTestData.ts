// Utility to seed Firebase with test accounts and sample businesses
// Can be called from the app during development

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const TEST_ACCOUNTS = [
  {
    email: 'owner@foodventurer.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Owner',
    role: 'business_owner' as const,
    phoneNumber: '+1234567890',
  },
  {
    email: 'atiathan@foodventurer.com',
    password: 'password123',
    firstName: 'Atiathan',
    lastName: 'Business',
    role: 'business_owner' as const,
    phoneNumber: '+1234567891',
  },
];

const SAMPLE_BUSINESS = {
  name: 'The Golden Spoon Restaurant',
  description: 'Fine dining experience with locally sourced ingredients and authentic Filipino cuisine',
  category: 'fine_dining',
  location: {
    latitude: 11.6894,
    longitude: 122.3670,
    address: '123 Main St, Iloilo City',
    city: 'Iloilo City',
    state: 'Iloilo',
    country: 'Philippines',
  },
  phoneNumber: '+639123456789',
  email: 'contact@goldenspoon.com',
  website: 'https://goldenspoon.com',
  images: [],
  priceRange: '$$$',
  hours: {
    monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
    sunday: { isOpen: true, openTime: '12:00', closeTime: '21:00' },
  },
  amenities: ['WiFi', 'Parking', 'Outdoor Seating', 'Reservations', 'Air Conditioning'],
};

export async function seedTestData(): Promise<void> {
  console.log('🌱 Starting to seed test data...');

  try {
    const createdAccounts: string[] = [];
    const errors: string[] = [];

    for (const account of TEST_ACCOUNTS) {
      try {
        // Create user in Firebase Authentication
        const userCredential = await auth().createUserWithEmailAndPassword(
          account.email,
          account.password
        );

        const user = userCredential.user;
        console.log(`✅ Created auth user: ${account.email}`);

        // Update display name
        await user.updateProfile({
          displayName: `${account.firstName} ${account.lastName}`,
        });

        // Create user document in Firestore
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            phoneNumber: account.phoneNumber,
            role: account.role,
            profileImage: null,
            isVerified: false,
            preferences: {},
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

        console.log(`✅ Created Firestore user document: ${account.email}`);

        // If atiathan account, create a sample business
        if (account.email === 'atiathan@foodventurer.com') {
          const businessRef = firestore().collection('businesses').doc();
          
          await businessRef.set({
            ...SAMPLE_BUSINESS,
            ownerId: user.uid,
            rating: 4.5,
            reviewCount: 42,
            isVerified: true,
            isActive: true,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

          console.log(`✅ Created business for: ${account.email}`);
          createdAccounts.push(`${account.email} (with business)`);
        } else {
          createdAccounts.push(account.email);
        }

        // Sign out after creating each account
        await auth().signOut();
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Account already exists: ${account.email}`);
          errors.push(`${account.email} - Already exists`);
        } else {
          console.error(`❌ Error creating account ${account.email}:`, error.message);
          errors.push(`${account.email} - ${error.message}`);
        }
      }
    }

    // Show results
    let message = '✅ Test Data Seeding Complete!\n\n';
    
    if (createdAccounts.length > 0) {
      message += '📝 Created Accounts:\n';
      createdAccounts.forEach(acc => {
        message += `• ${acc}\n`;
      });
      message += '\nPassword for all: password123\n';
    }
    
    if (errors.length > 0) {
      message += '\n⚠️ Skipped/Errors:\n';
      errors.forEach(err => {
        message += `• ${err}\n`;
      });
    }

    Alert.alert('Seed Complete', message);
    console.log('✅ Test data seeding completed!');
  } catch (error: any) {
    console.error('❌ Error seeding test data:', error);
    Alert.alert('Seed Error', error.message || 'Failed to seed test data');
  }
}

export const TEST_CREDENTIALS = {
  BUSINESS_OWNER_NO_BUSINESS: {
    email: 'owner@foodventurer.com',
    password: 'password123',
  },
  BUSINESS_OWNER_WITH_BUSINESS: {
    email: 'atiathan@foodventurer.com',
    password: 'password123',
  },
};
