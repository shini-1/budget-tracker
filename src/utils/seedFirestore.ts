// Seed Firestore with sample businesses and markers
import firestore from '@react-native-firebase/firestore';

export const seedFirestoreData = async () => {
  console.log('🌱 Starting Firestore seed...');

  try {
    // Sample businesses data (matching mock data)
    const businesses = [
      {
        id: '1',
        name: 'Ati-Atihan Restaurant',
        description: 'Authentic Aklanon cuisine featuring traditional dishes and local flavors. Experience the rich culinary heritage of Kalibo.',
        category: 'restaurant',
        location: {
          latitude: 11.6894,
          longitude: 122.3670,
          address: 'Poblacion, Kalibo, Aklan',
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
          postalCode: '5600',
        },
        phoneNumber: '+63 917 123 4567',
        email: 'info@atiatihanrestaurant.com',
        website: 'https://atiatihanrestaurant.com',
        images: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        ],
        rating: 4.6,
        reviewCount: 187,
        priceRange: '$$' as const,
        hours: {
          monday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          tuesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          wednesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          thursday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
          friday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
          saturday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
          sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
        },
        amenities: ['wifi', 'parking', 'outdoor_seating', 'air_conditioning'],
        isVerified: true,
        isActive: true,
        ownerId: 'owner123',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {
        id: '2',
        name: 'Pansi Restaurant',
        description: 'Fresh seafood and local delicacies in a cozy atmosphere. Known for our grilled fish and traditional soups.',
        category: 'restaurant',
        location: {
          latitude: 11.6900,
          longitude: 122.3675,
          address: 'Pastrana Street, Kalibo, Aklan',
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
          postalCode: '5600',
        },
        phoneNumber: '+63 917 234 5678',
        email: 'contact@pansirestaurant.com',
        images: [
          'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
        ],
        rating: 4.3,
        reviewCount: 142,
        priceRange: '$' as const,
        hours: {
          monday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '21:00' },
          sunday: { isOpen: false, openTime: '', closeTime: '' },
        },
        amenities: ['parking', 'takeout'],
        isVerified: true,
        isActive: true,
        ownerId: 'owner456',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {
        id: '3',
        name: 'Boracay Breeze Café',
        description: 'Relaxing café with specialty coffee, pastries, and light meals. Perfect spot for meetings or casual hangouts.',
        category: 'cafe',
        location: {
          latitude: 11.6885,
          longitude: 122.3680,
          address: 'Roxas Avenue, Kalibo, Aklan',
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
          postalCode: '5600',
        },
        phoneNumber: '+63 917 345 6789',
        email: 'hello@boracaybreeze.com',
        images: [
          'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
        ],
        rating: 4.7,
        reviewCount: 203,
        priceRange: '$$' as const,
        hours: {
          monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
          tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
          wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
          thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
          friday: { isOpen: true, openTime: '06:00', closeTime: '23:00' },
          saturday: { isOpen: true, openTime: '07:00', closeTime: '23:00' },
          sunday: { isOpen: true, openTime: '07:00', closeTime: '22:00' },
        },
        amenities: ['wifi', 'air_conditioning', 'outdoor_seating'],
        isVerified: true,
        isActive: true,
        ownerId: 'owner789',
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
    ];

    // Create businesses
    console.log('📝 Creating businesses...');
    for (const business of businesses) {
      await firestore()
        .collection('businesses')
        .doc(business.id)
        .set(business);
      console.log(`✅ Created business: ${business.name}`);
    }

    // Create business markers
    console.log('📍 Creating business markers...');
    const markers = [
      {
        businessId: '1',
        latitude: 11.6894,
        longitude: 122.3670,
        address: 'Exact location at Poblacion, Kalibo',
        placedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {
        businessId: '2',
        latitude: 11.6900,
        longitude: 122.3675,
        address: 'Pastrana Street corner, Kalibo',
        placedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
      {
        businessId: '3',
        latitude: 11.6885,
        longitude: 122.3680,
        address: 'Roxas Avenue main road, Kalibo',
        placedAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      },
    ];

    for (const marker of markers) {
      await firestore()
        .collection('businessMarkers')
        .doc(marker.businessId)
        .set(marker);
      console.log(`✅ Created marker for business: ${marker.businessId}`);
    }

    console.log('🎉 Firestore seed completed successfully!');
    console.log('📊 Created:');
    console.log(`   - ${businesses.length} businesses`);
    console.log(`   - ${markers.length} markers`);
    
    return {
      success: true,
      businessesCreated: businesses.length,
      markersCreated: markers.length,
    };
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    throw error;
  }
};
