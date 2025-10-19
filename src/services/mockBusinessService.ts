// Mock Business Service for Development

import { Business, BusinessCategory, Location, SearchParams, PaginatedResponse } from '../types';

// Mock restaurant data for Kalibo, Aklan
const mockRestaurants: Business[] = [
  {
    id: '1',
    name: 'Ati-Atihan Restaurant',
    description: 'Authentic Aklanon cuisine featuring local delicacies and traditional dishes from the Ati-Atihan festival region.',
    category: 'restaurant' as BusinessCategory,
    location: {
      latitude: 11.6900,
      longitude: 122.3675,
      address: 'Poblacion, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 123 4567',
    email: 'info@atiatihanrestaurant.com',
    website: 'https://atiatihanrestaurant.com',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    ],
    rating: 4.6,
    reviewCount: 187,
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    amenities: ['wifi', 'parking', 'delivery'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner1',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-01T15:30:00Z',
  },
  {
    id: '2',
    name: 'Pansi Restaurant',
    description: 'Traditional Filipino restaurant serving pansit, adobo, and other classic dishes with a modern twist.',
    category: 'restaurant' as BusinessCategory,
    location: {
      latitude: 11.6885,
      longitude: 122.3665,
      address: 'Andagao, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 234 5678',
    email: 'hello@pansirestaurant.com',
    website: 'https://pansirestaurant.com',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    ],
    rating: 4.4,
    reviewCount: 142,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '06:00', closeTime: '20:00' },
    },
    amenities: ['wifi', 'parking', 'delivery', 'takeout'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner2',
    createdAt: '2023-02-20T09:00:00Z',
    updatedAt: '2023-11-15T14:20:00Z',
  },
  {
    id: '3',
    name: 'Boracay Breeze Café',
    description: 'Charming café inspired by Boracay beaches, serving fresh seafood, tropical drinks, and local specialties.',
    category: 'cafe' as BusinessCategory,
    location: {
      latitude: 11.6910,
      longitude: 122.3680,
      address: 'Osmeña Avenue, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 345 6789',
    email: 'cafe@boracaybreeze.com',
    website: 'https://boracaybreeze.com',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    ],
    rating: 4.7,
    reviewCount: 203,
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
    },
    amenities: ['wifi', 'outdoor_seating', 'alcohol'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner3',
    createdAt: '2023-03-10T11:00:00Z',
    updatedAt: '2023-12-05T16:45:00Z',
  },
  {
    id: '4',
    name: 'Linamon Seafood House',
    description: 'Fresh seafood restaurant specializing in Aklanon linamon (mudfish) and other river delicacies.',
    category: 'restaurant' as BusinessCategory,
    location: {
      latitude: 11.6870,
      longitude: 122.3650,
      address: 'Magsaysay Avenue, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 456 7890',
    email: 'seafood@linamonhouse.com',
    website: 'https://linamonhouse.com',
    images: [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    ],
    rating: 4.5,
    reviewCount: 156,
    priceRange: '$$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
    },
    amenities: ['wifi', 'parking', 'reservations'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner4',
    createdAt: '2023-04-05T12:00:00Z',
    updatedAt: '2023-11-20T13:15:00Z',
  },
  {
    id: '5',
    name: 'Aklan Lechon Haus',
    description: 'Famous for authentic Aklanon-style lechon and other roasted delicacies. A local favorite for celebrations.',
    category: 'restaurant' as BusinessCategory,
    location: {
      latitude: 11.6920,
      longitude: 122.3690,
      address: 'Toting Reyes Street, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 567 8901',
    email: 'lechon@aklanhaus.com',
    website: 'https://aklanhaus.com',
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    ],
    rating: 4.8,
    reviewCount: 278,
    priceRange: '$$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '09:00', closeTime: '20:00' },
    },
    amenities: ['parking', 'catering', 'reservations'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner5',
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2023-12-10T17:30:00Z',
  },
  {
    id: '6',
    name: 'Kalibo Fast Food Corner',
    description: 'Quick and affordable Filipino fast food including siomai, siopao, and halo-halo.',
    category: 'fast_food' as BusinessCategory,
    location: {
      latitude: 11.6895,
      longitude: 122.3678,
      address: 'Rizal Street, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 678 9012',
    email: 'fastfood@kalibocorner.com',
    website: 'https://kalibocorner.com',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    ],
    rating: 4.2,
    reviewCount: 89,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '06:00', closeTime: '22:00' },
    },
    amenities: ['wifi', 'delivery', 'takeout'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner6',
    createdAt: '2023-06-18T10:30:00Z',
    updatedAt: '2023-11-25T12:45:00Z',
  },
  {
    id: '7',
    name: 'Maria\'s Bakery & Bakeshop',
    description: 'Traditional Filipino bakery with fresh pandesal, ensaymada, and other local breads and pastries.',
    category: 'bakery' as BusinessCategory,
    location: {
      latitude: 11.6875,
      longitude: 122.3660,
      address: 'Comonwealth Avenue, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 789 0123',
    email: 'bakery@mariasbakeshop.com',
    website: 'https://mariasbakeshop.com',
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    ],
    rating: 4.3,
    reviewCount: 124,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '05:00', closeTime: '20:00' },
    },
    amenities: ['parking', 'takeout'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner7',
    createdAt: '2023-07-22T06:00:00Z',
    updatedAt: '2023-12-08T11:20:00Z',
  },
  {
    id: '8',
    name: 'Island Hop Pizza',
    description: 'Wood-fired pizzas with Filipino and international toppings, using local ingredients.',
    category: 'pizzeria' as BusinessCategory,
    location: {
      latitude: 11.6905,
      longitude: 122.3685,
      address: 'Ledesma Street, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 890 1234',
    email: 'pizza@islandhop.com',
    website: 'https://islandhop.com',
    images: [
      'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    ],
    rating: 4.4,
    reviewCount: 167,
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
    },
    amenities: ['wifi', 'delivery', 'takeout'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner8',
    createdAt: '2023-08-14T13:00:00Z',
    updatedAt: '2023-11-30T18:10:00Z',
  },
  {
    id: '9',
    name: 'Tropical Ice Cream Parlor',
    description: 'Artisanal ice cream parlor with local flavors including kalamansi, mango, and ube ice cream.',
    category: 'restaurant' as BusinessCategory,
    location: {
      latitude: 11.6880,
      longitude: 122.3655,
      address: 'Quezon Avenue, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 901 2345',
    email: 'icecream@tropicalparlor.com',
    website: 'https://tropicalparlor.com',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400',
    ],
    rating: 4.6,
    reviewCount: 98,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '10:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '10:00', closeTime: '22:00' },
    },
    amenities: ['wifi', 'outdoor_seating'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner9',
    createdAt: '2023-09-08T14:30:00Z',
    updatedAt: '2023-12-12T19:45:00Z',
  },
  {
    id: '10',
    name: 'Sukip Café',
    description: 'Modern café serving specialty Filipino coffee, fresh juices, and light meals in a cozy atmosphere.',
    category: 'cafe' as BusinessCategory,
    location: {
      latitude: 11.6915,
      longitude: 122.3695,
      address: 'McKinley Street, Kalibo, Aklan, Philippines',
      city: 'Kalibo',
      state: 'Aklan',
      country: 'Philippines',
      postalCode: '5600',
    },
    phoneNumber: '+63 917 012 3456',
    email: 'cafe@sukip.com',
    website: 'https://sukip.com',
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    ],
    rating: 4.5,
    reviewCount: 134,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
    },
    amenities: ['wifi', 'outdoor_seating'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner10',
    createdAt: '2023-10-03T09:15:00Z',
    updatedAt: '2023-12-15T16:30:00Z',
  },
];

class MockBusinessService {
  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = mockRestaurants.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: mockRestaurants.length,
        totalPages: Math.ceil(mockRestaurants.length / limit),
        hasNext: endIndex < mockRestaurants.length,
        hasPrev: page > 1,
      },
    };
  }

  async getBusinessById(id: string): Promise<Business> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const business = mockRestaurants.find(b => b.id === id);
    if (!business) {
      throw new Error('Business not found');
    }
    
    return business;
  }

  async searchBusinesses(searchParams: SearchParams): Promise<PaginatedResponse<Business>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let filteredRestaurants = [...mockRestaurants];

    // Filter by query
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.description.toLowerCase().includes(query) ||
        restaurant.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (searchParams.filters.category && searchParams.filters.category.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        searchParams.filters.category!.includes(restaurant.category)
      );
    }

    // Filter by price range
    if (searchParams.filters.priceRange && searchParams.filters.priceRange.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        searchParams.filters.priceRange!.includes(restaurant.priceRange)
      );
    }

    // Filter by rating
    if (searchParams.filters.rating) {
      filteredRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.rating >= searchParams.filters.rating!
      );
    }

    // Sort results
    switch (searchParams.sortBy) {
      case 'rating':
        filteredRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'most_reviewed':
        filteredRestaurants.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price_low_to_high':
        filteredRestaurants.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case 'price_high_to_low':
        filteredRestaurants.sort((a, b) => b.priceRange.length - a.priceRange.length);
        break;
      case 'newest':
        filteredRestaurants.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // distance
        // In a real app, you would calculate distance from user location
        break;
    }

    // Pagination
    const page = searchParams.page || 1;
    const limit = searchParams.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedData = filteredRestaurants.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredRestaurants.length,
        totalPages: Math.ceil(filteredRestaurants.length / limit),
        hasNext: endIndex < filteredRestaurants.length,
        hasPrev: page > 1,
      },
    };
  }

  async getNearbyRestaurants(location: Location, radius: number = 5): Promise<Business[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // In a real app, you would calculate actual distances
    // For now, return all restaurants as "nearby"
    return mockRestaurants;
  }
}

export const mockBusinessService = new MockBusinessService();
