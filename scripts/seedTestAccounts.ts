// Script to seed Firebase with test accounts and sample businesses
// Run this script once to create test data for development

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TEST_ACCOUNTS = [
  {
    email: 'owner@foodventurer.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'Owner',
    role: 'business_owner',
    phoneNumber: '+1234567890',
  },
  {
    email: 'atiathan@foodventurer.com',
    password: 'password123',
    firstName: 'Atiathan',
    lastName: 'Business',
    role: 'business_owner',
    phoneNumber: '+1234567891',
  },
  {
    email: 'testuser@foodventurer.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    phoneNumber: '+1234567892',
  },
];

const SAMPLE_BUSINESSES = [
  {
    name: 'The Golden Spoon',
    description: 'Fine dining experience with locally sourced ingredients',
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
    priceRange: '$$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '12:00', closeTime: '21:00' },
    },
    amenities: ['WiFi', 'Parking', 'Outdoor Seating', 'Reservations'],
  },
  {
    name: 'Cafe Brewtiful',
    description: 'Cozy cafe serving artisan coffee and fresh pastries',
    category: 'cafe',
    location: {
      latitude: 11.6920,
      longitude: 122.3650,
      address: '456 Coffee Lane, Iloilo City',
      city: 'Iloilo City',
      state: 'Iloilo',
      country: 'Philippines',
    },
    phoneNumber: '+639123456788',
    email: 'hello@brewtiful.com',
    website: 'https://brewtiful.com',
    images: [],
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    },
    amenities: ['WiFi', 'Takeout', 'Outdoor Seating'],
  },
];

async function seedTestAccounts() {
  console.log('🌱 Starting to seed test accounts...');

  try {
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

        // If business owner, create a sample business
        if (account.role === 'business_owner' && account.email === 'atiathan@foodventurer.com') {
          const businessRef = firestore().collection('businesses').doc();
          
          await businessRef.set({
            ...SAMPLE_BUSINESSES[0],
            ownerId: user.uid,
            rating: 4.5,
            reviewCount: 42,
            isVerified: true,
            isActive: true,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });

          console.log(`✅ Created business for: ${account.email}`);
        }

        // Sign out after creating each account
        await auth().signOut();
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`⚠️  Account already exists: ${account.email}`);
        } else {
          console.error(`❌ Error creating account ${account.email}:`, error.message);
        }
      }
    }

    // Create additional sample businesses without owners (for general browsing)
    console.log('🌱 Creating sample businesses...');
    
    for (let i = 1; i < SAMPLE_BUSINESSES.length; i++) {
      const businessRef = firestore().collection('businesses').doc();
      
      await businessRef.set({
        ...SAMPLE_BUSINESSES[i],
        ownerId: 'system',
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 100),
        isVerified: false,
        isActive: true,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Created sample business: ${SAMPLE_BUSINESSES[i].name}`);
    }

    console.log('✅ Test data seeding completed!');
    console.log('\n📝 Test Accounts Created:');
    console.log('1. owner@foodventurer.com / password123 (Business Owner - No Business)');
    console.log('2. atiathan@foodventurer.com / password123 (Business Owner - Has Business)');
    console.log('3. testuser@foodventurer.com / password123 (Regular User)');
  } catch (error) {
    console.error('❌ Error seeding test accounts:', error);
  }
}

// Export for use in React Native
export { seedTestAccounts };

// For Node.js execution
if (require.main === module) {
  seedTestAccounts()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
