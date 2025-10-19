// Google Places API Service for Real Restaurant Data

import { Business, BusinessCategory, SearchParams, PaginatedResponse, PriceRange } from '../types';
import { MAPS_CONFIG } from '../constants';

interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    open_now?: boolean;
  };
  formatted_address?: string;
}

class GooglePlacesService {
  private apiKey = MAPS_CONFIG.API_KEY;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    try {
      const limit = params.limit || 20;

      if (!this.apiKey) {
        throw new Error('Google Maps API key is not configured');
      }

      // Kalibo, Aklan coordinates
      const kaliboLat = 11.6894;
      const kaliboLng = 122.3670;

      // Search for restaurants near Kalibo
      const url = `${this.baseUrl}/nearbysearch/json?location=${kaliboLat},${kaliboLng}&radius=5000&type=restaurant&key=${this.apiKey}`;

      console.log('🔍 Fetching restaurants from Google Places API...');
      const response = await fetch(url);
      const data: GooglePlacesResponse = await response.json();

      console.log('📡 Google Places API response status:', data.status);

      if (data.status === 'REQUEST_DENIED') {
        console.error('❌ Google Places API REQUEST_DENIED. Please check:');
        console.error('1. Places API is enabled in Google Cloud Console');
        console.error('2. API key has no restrictions blocking this request');
        console.error('3. Billing is enabled for your Google Cloud project');
        throw new Error('Google Places API access denied. Please check API key configuration.');
      }

      if (data.status === 'ZERO_RESULTS') {
        console.warn('⚠️ No restaurants found in this area');
        return {
          data: [],
          pagination: {
            page: 1,
            limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      if (data.status !== 'OK') {
        throw new Error(`Google Places API error: ${data.status}`);
      }

      console.log(`✅ Found ${data.results.length} restaurants`);

      // Convert Google Places results to our Business format
      const businesses: Business[] = data.results.slice(0, limit).map((place, index) => ({
        id: place.place_id,
        name: place.name,
        description: this.generateDescription(place),
        category: this.determineCategory(place.types) as BusinessCategory,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.formatted_address || place.vicinity,
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
        },
        phoneNumber: '+63 XXX XXX XXXX', // Google Places API doesn't provide phone in nearby search
        email: `info@${place.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: '', // Not available in nearby search
        images: place.photos ? place.photos.slice(0, 3).map(photo =>
          `${this.baseUrl}/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        ) : [],
        rating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        priceRange: this.convertPriceLevel(place.price_level) as PriceRange,
        hours: this.generateDefaultHours(),
        amenities: this.generateAmenities(),
        isVerified: false, // Real restaurants from Google aren't verified by default
        isActive: true,
        ownerId: `google_${place.place_id}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return {
        data: businesses,
        pagination: {
          page: 1,
          limit,
          total: businesses.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    } catch (error: any) {
      console.error('❌ Google Places API error:', error.message || error);
      throw error;
    }
  }

  async searchBusinesses(searchParams: SearchParams): Promise<PaginatedResponse<Business>> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Maps API key is not configured');
      }

      const kaliboLat = 11.6894;
      const kaliboLng = 122.3670;

      let url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(searchParams.query || 'restaurant')}&location=${kaliboLat},${kaliboLng}&radius=5000&key=${this.apiKey}`;

      // Add type filter if specified
      if (searchParams.filters.category && searchParams.filters.category.length > 0) {
        url += `&type=${searchParams.filters.category[0]}`;
      }

      console.log('🔍 Searching Google Places API...');
      const response = await fetch(url);
      const data: GooglePlacesResponse = await response.json();

      if (data.status === 'REQUEST_DENIED') {
        throw new Error('Google Places API access denied. Please check API key configuration.');
      }

      if (data.status === 'ZERO_RESULTS') {
        return {
          data: [],
          pagination: {
            page: 1,
            limit: searchParams.limit || 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      if (data.status !== 'OK') {
        throw new Error(`Google Places API search error: ${data.status}`);
      }

      // Convert and filter results
      let businesses: Business[] = data.results.map((place, index) => ({
        id: place.place_id,
        name: place.name,
        description: this.generateDescription(place),
        category: this.determineCategory(place.types) as BusinessCategory,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          address: place.formatted_address || place.vicinity,
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
        },
        phoneNumber: '+63 XXX XXX XXXX',
        email: `info@${place.name.toLowerCase().replace(/\s+/g, '')}.com`,
        website: '',
        images: place.photos ? place.photos.slice(0, 3).map(photo =>
          `${this.baseUrl}/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.apiKey}`
        ) : [],
        rating: place.rating || 0,
        reviewCount: place.user_ratings_total || 0,
        priceRange: this.convertPriceLevel(place.price_level) as PriceRange,
        hours: this.generateDefaultHours(),
        amenities: this.generateAmenities(),
        isVerified: false,
        isActive: true,
        ownerId: `google_${place.place_id}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      // Apply filters
      if (searchParams.filters.category && searchParams.filters.category.length > 0) {
        businesses = businesses.filter(business =>
          searchParams.filters.category!.includes(business.category)
        );
      }

      if (searchParams.filters.rating) {
        businesses = businesses.filter(business =>
          business.rating >= searchParams.filters.rating!
        );
      }

      // Apply sorting
      switch (searchParams.sortBy) {
        case 'rating':
          businesses.sort((a, b) => b.rating - a.rating);
          break;
        case 'most_reviewed':
          businesses.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'price_low_to_high':
          businesses.sort((a, b) => a.priceRange.length - b.priceRange.length);
          break;
        case 'price_high_to_low':
          businesses.sort((a, b) => b.priceRange.length - a.priceRange.length);
          break;
        default:
          // distance sorting would require user's location
          break;
      }

      // Apply pagination
      const page = searchParams.page || 1;
      const limit = searchParams.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedData = businesses.slice(startIndex, startIndex + limit);

      return {
        data: paginatedData,
        pagination: {
          page,
          limit,
          total: businesses.length,
          totalPages: Math.ceil(businesses.length / limit),
          hasNext: startIndex + limit < businesses.length,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Google Places API search error:', error);
      throw new Error('Failed to search restaurants');
    }
  }

  private generateDescription(place: GooglePlace): string {
    const type = place.types.includes('restaurant') ? 'restaurant' : 'dining establishment';
    const rating = place.rating ? ` with ${place.rating} star rating` : '';
    return `A popular ${type} located in Kalibo, Aklan${rating}.`;
  }

  private determineCategory(types: string[]): string {
    if (types.includes('bakery')) return 'bakery';
    if (types.includes('cafe')) return 'cafe';
    if (types.includes('bar')) return 'bar';
    if (types.includes('meal_takeaway') || types.includes('meal_delivery')) return 'fast_food';
    if (types.includes('fine_dining')) return 'fine_dining';
    return 'restaurant';
  }

  private convertPriceLevel(priceLevel?: number): string {
    switch (priceLevel) {
      case 1: return '$';
      case 2: return '$$';
      case 3: return '$$$';
      case 4: return '$$$$';
      default: return '$$';
    }
  }

  private generateDefaultHours() {
    return {
      monday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      tuesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      wednesday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      thursday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      friday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      saturday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
      sunday: { isOpen: true, openTime: '08:00', closeTime: '20:00' },
    };
  }

  private generateAmenities(): string[] {
    return ['parking', 'wifi', 'delivery']; // Default amenities
  }
}

export const googlePlacesService = new GooglePlacesService();
