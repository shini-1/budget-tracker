// Mock Business Service for Development

import { Business, BusinessCategory, Location, SearchParams, PaginatedResponse } from '../types';

// Mock restaurant data
const mockRestaurants: Business[] = [
  {
    id: '1',
    name: 'The Golden Spoon',
    description: 'Award-winning fine dining restaurant with innovative cuisine and exceptional service.',
    category: 'fine_dining' as BusinessCategory,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: '123 Market Street, San Francisco, CA 94102',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102',
    },
    phoneNumber: '+1 (555) 123-4567',
    email: 'info@goldenspoon.com',
    website: 'https://goldenspoon.com',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    ],
    rating: 4.8,
    reviewCount: 324,
    priceRange: '$$$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '17:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '17:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '17:00', closeTime: '23:00' },
      sunday: { isOpen: false },
    },
    amenities: ['wifi', 'parking', 'reservations', 'alcohol'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner1',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-12-01T15:30:00Z',
  },
  {
    id: '2',
    name: 'Bella Vista Café',
    description: 'Cozy Italian café serving authentic pasta, pizza, and espresso drinks.',
    category: 'cafe' as BusinessCategory,
    location: {
      latitude: 37.7849,
      longitude: -122.4094,
      address: '456 Castro Street, San Francisco, CA 94114',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94114',
    },
    phoneNumber: '+1 (555) 234-5678',
    email: 'hello@bellavista.com',
    website: 'https://bellavista.com',
    images: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    ],
    rating: 4.5,
    reviewCount: 189,
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '07:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '07:00', closeTime: '21:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '21:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    },
    amenities: ['wifi', 'outdoor_seating', 'takeout', 'delivery'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner2',
    createdAt: '2023-02-20T09:00:00Z',
    updatedAt: '2023-11-15T12:00:00Z',
  },
  {
    id: '3',
    name: 'Burger Palace',
    description: 'Gourmet burgers made with locally sourced ingredients and creative toppings.',
    category: 'fast_food' as BusinessCategory,
    location: {
      latitude: 37.7649,
      longitude: -122.4294,
      address: '789 Mission Street, San Francisco, CA 94103',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94103',
    },
    phoneNumber: '+1 (555) 345-6789',
    email: 'orders@burgerpalace.com',
    website: 'https://burgerpalace.com',
    images: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    ],
    rating: 4.2,
    reviewCount: 267,
    priceRange: '$$' as const,
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '23:00' },
      sunday: { isOpen: true, openTime: '12:00', closeTime: '21:00' },
    },
    amenities: ['takeout', 'delivery', 'outdoor_seating', 'wifi'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner3',
    createdAt: '2023-03-10T11:00:00Z',
    updatedAt: '2023-10-20T14:30:00Z',
  },
  {
    id: '4',
    name: 'Sakura Sushi',
    description: 'Authentic Japanese sushi and sashimi prepared by master chefs.',
    category: 'sushi' as BusinessCategory,
    location: {
      latitude: 37.7549,
      longitude: -122.4394,
      address: '321 Geary Street, San Francisco, CA 94108',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94108',
    },
    phoneNumber: '+1 (555) 456-7890',
    email: 'reservations@sakurasushi.com',
    website: 'https://sakurasushi.com',
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
    ],
    rating: 4.7,
    reviewCount: 156,
    priceRange: '$$$' as const,
    hours: {
      monday: { isOpen: false },
      tuesday: { isOpen: true, openTime: '17:30', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '17:30', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '17:30', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '17:30', closeTime: '22:30' },
      saturday: { isOpen: true, openTime: '17:30', closeTime: '22:30' },
      sunday: { isOpen: true, openTime: '17:30', closeTime: '21:30' },
    },
    amenities: ['reservations', 'alcohol', 'wifi', 'parking'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner4',
    createdAt: '2023-04-05T16:00:00Z',
    updatedAt: '2023-12-10T10:15:00Z',
  },
  {
    id: '5',
    name: 'Taco Libre',
    description: 'Fresh Mexican street food with authentic flavors and vibrant atmosphere.',
    category: 'mexican' as BusinessCategory,
    location: {
      latitude: 37.7449,
      longitude: -122.4494,
      address: '654 Valencia Street, San Francisco, CA 94110',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94110',
    },
    phoneNumber: '+1 (555) 567-8901',
    email: 'hola@tacolibre.com',
    website: 'https://tacolibre.com',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
    ],
    rating: 4.3,
    reviewCount: 203,
    priceRange: '$' as const,
    hours: {
      monday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      tuesday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      wednesday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      thursday: { isOpen: true, openTime: '11:00', closeTime: '21:00' },
      friday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '11:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '12:00', closeTime: '20:00' },
    },
    amenities: ['takeout', 'delivery', 'outdoor_seating', 'alcohol'],
    isVerified: true,
    isActive: true,
    ownerId: 'owner5',
    createdAt: '2023-05-12T13:00:00Z',
    updatedAt: '2023-11-25T16:45:00Z',
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
