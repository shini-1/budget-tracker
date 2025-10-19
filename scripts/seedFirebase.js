/**
 * Firebase Seed Script
 * 
 * This script populates your Firebase Firestore database with sample data.
 * 
 * Setup:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Save as serviceAccountKey.json in this directory
 * 4. Run: node scripts/seedFirebase.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample data
const sampleBusinesses = [
  {
    name: "The Golden Spoon",
    description: "Fine dining restaurant serving contemporary Filipino cuisine with a modern twist. Experience exquisite flavors in an elegant atmosphere.",
    category: "fine_dining",
    location: {
      latitude: 11.6894,
      longitude: 122.3670,
      address: "123 Roxas Avenue, Poblacion",
      city: "Kalibo",
      state: "Aklan",
      country: "Philippines",
      postalCode: "5600"
    },
    phoneNumber: "+63 36 268 1234",
    email: "info@goldenspoon.ph",
    website: "https://goldenspoon.ph",
    images: [],
    rating: 4.5,
    reviewCount: 0,
    priceRange: "$$$",
    hours: {
      monday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      tuesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      wednesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      thursday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      friday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
      saturday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
      sunday: { isOpen: true, openTime: "11:00", closeTime: "22:00" }
    },
    amenities: ["wifi", "parking", "reservations", "outdoor_seating", "alcohol"],
    isVerified: true,
    isActive: true,
    ownerId: "sample_owner_1"
  },
  {
    name: "Café Aklan",
    description: "Cozy coffee shop offering artisanal coffee, fresh pastries, and light meals. Perfect spot for work or relaxation.",
    category: "cafe",
    location: {
      latitude: 11.6900,
      longitude: 122.3680,
      address: "456 Pastrana Street",
      city: "Kalibo",
      state: "Aklan",
      country: "Philippines",
      postalCode: "5600"
    },
    phoneNumber: "+63 36 268 5678",
    email: "hello@cafeaklan.ph",
    website: "https://cafeaklan.ph",
    images: [],
    rating: 4.3,
    reviewCount: 0,
    priceRange: "$$",
    hours: {
      monday: { isOpen: true, openTime: "07:00", closeTime: "20:00" },
      tuesday: { isOpen: true, openTime: "07:00", closeTime: "20:00" },
      wednesday: { isOpen: true, openTime: "07:00", closeTime: "20:00" },
      thursday: { isOpen: true, openTime: "07:00", closeTime: "20:00" },
      friday: { isOpen: true, openTime: "07:00", closeTime: "21:00" },
      saturday: { isOpen: true, openTime: "08:00", closeTime: "21:00" },
      sunday: { isOpen: true, openTime: "08:00", closeTime: "20:00" }
    },
    amenities: ["wifi", "outdoor_seating", "takeout", "vegetarian"],
    isVerified: true,
    isActive: true,
    ownerId: "sample_owner_2"
  },
  {
    name: "Mang Inasal Kalibo",
    description: "Popular Filipino fast food chain specializing in grilled chicken and traditional Filipino dishes.",
    category: "fast_food",
    location: {
      latitude: 11.6880,
      longitude: 122.3665,
      address: "789 Magsaysay Avenue",
      city: "Kalibo",
      state: "Aklan",
      country: "Philippines",
      postalCode: "5600"
    },
    phoneNumber: "+63 36 268 9012",
    email: "kalibo@manginasal.com",
    website: "https://manginasal.com",
    images: [],
    rating: 4.1,
    reviewCount: 0,
    priceRange: "$",
    hours: {
      monday: { isOpen: true, openTime: "10:00", closeTime: "21:00" },
      tuesday: { isOpen: true, openTime: "10:00", closeTime: "21:00" },
      wednesday: { isOpen: true, openTime: "10:00", closeTime: "21:00" },
      thursday: { isOpen: true, openTime: "10:00", closeTime: "21:00" },
      friday: { isOpen: true, openTime: "10:00", closeTime: "22:00" },
      saturday: { isOpen: true, openTime: "10:00", closeTime: "22:00" },
      sunday: { isOpen: true, openTime: "10:00", closeTime: "21:00" }
    },
    amenities: ["wifi", "parking", "delivery", "takeout", "kids_menu"],
    isVerified: true,
    isActive: true,
    ownerId: "sample_owner_3"
  },
  {
    name: "Bella Italia Pizzeria",
    description: "Authentic Italian pizzeria with wood-fired oven. Serving traditional Neapolitan pizzas and pasta dishes.",
    category: "pizzeria",
    location: {
      latitude: 11.6910,
      longitude: 122.3690,
      address: "321 Quezon Street",
      city: "Kalibo",
      state: "Aklan",
      country: "Philippines",
      postalCode: "5600"
    },
    phoneNumber: "+63 36 268 3456",
    email: "info@bellaitalia.ph",
    website: "",
    images: [],
    rating: 4.6,
    reviewCount: 0,
    priceRange: "$$",
    hours: {
      monday: { isOpen: false, openTime: "", closeTime: "" },
      tuesday: { isOpen: true, openTime: "11:00", closeTime: "21:00" },
      wednesday: { isOpen: true, openTime: "11:00", closeTime: "21:00" },
      thursday: { isOpen: true, openTime: "11:00", closeTime: "21:00" },
      friday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      saturday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      sunday: { isOpen: true, openTime: "11:00", closeTime: "21:00" }
    },
    amenities: ["wifi", "delivery", "takeout", "outdoor_seating", "alcohol"],
    isVerified: true,
    isActive: true,
    ownerId: "sample_owner_4"
  },
  {
    name: "Seafood Island",
    description: "Fresh seafood restaurant offering a wide variety of Filipino-style seafood dishes in a fun, island-themed atmosphere.",
    category: "restaurant",
    location: {
      latitude: 11.6870,
      longitude: 122.3655,
      address: "555 Toting Reyes Street",
      city: "Kalibo",
      state: "Aklan",
      country: "Philippines",
      postalCode: "5600"
    },
    phoneNumber: "+63 36 268 7890",
    email: "kalibo@seafoodisland.ph",
    website: "https://seafoodisland.ph",
    images: [],
    rating: 4.4,
    reviewCount: 0,
    priceRange: "$$",
    hours: {
      monday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      tuesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      wednesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      thursday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
      friday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
      saturday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
      sunday: { isOpen: true, openTime: "11:00", closeTime: "22:00" }
    },
    amenities: ["parking", "reservations", "kids_menu", "alcohol"],
    isVerified: true,
    isActive: true,
    ownerId: "sample_owner_5"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed businesses
    console.log('📍 Seeding businesses...');
    const businessBatch = db.batch();
    
    for (const business of sampleBusinesses) {
      const docRef = db.collection('businesses').doc();
      businessBatch.set(docRef, {
        ...business,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`  ✓ Added: ${business.name}`);
    }
    
    await businessBatch.commit();
    console.log(`✅ Successfully added ${sampleBusinesses.length} businesses\n`);

    console.log('✨ Database seeding completed!\n');
    console.log('Next steps:');
    console.log('1. Go to Firebase Console to verify the data');
    console.log('2. Set up security rules (see FIREBASE_SETUP.md)');
    console.log('3. Create indexes for better performance');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
