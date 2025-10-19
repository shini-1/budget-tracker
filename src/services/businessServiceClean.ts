// Business Service with Google Places API and Firebase integration

import { API_CONFIG } from '../constants';
import { Business, BusinessForm, SearchParams, PaginatedResponse, ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { mockBusinessService } from './mockBusinessService';
import { firebaseBusinessService } from './firebaseBusinessService';
import { googlePlacesService } from './googlePlacesService';

class BusinessService {
  private useGooglePlaces = true; // Primary data source
  private useFirebase = true; // For user-generated content
  private useMockService = false; // Fallback only

  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    // Primary: Google Places API for real restaurant data
    if (this.useGooglePlaces) {
      try {
        const googleResponse = await googlePlacesService.getBusinesses(params);

        // Optionally store in Firebase for caching/user data
        if (this.useFirebase && googleResponse.data.length > 0) {
          // Cache Google Places data in Firebase (async, don't wait)
          this.cacheGooglePlacesData(googleResponse.data).catch(err =>
            console.warn('Failed to cache Google Places data:', err)
          );
        }

        return googleResponse;
      } catch (error) {
        console.warn('Google Places API failed, falling back to Firebase:', error);
      }
    }

    // Secondary: Firebase for user-generated business data
    if (this.useFirebase) {
      try {
        return await firebaseBusinessService.getBusinesses(params);
      } catch (error) {
        console.warn('Firebase failed, falling back to mock data:', error);
      }
    }

    // Final fallback: Mock data
    if (this.useMockService) {
      return mockBusinessService.getBusinesses(params);
    }

    throw new Error('All business data sources failed');
  }

  async searchBusinesses(searchParams: SearchParams): Promise<PaginatedResponse<Business>> {
    // Primary: Google Places API search
    if (this.useGooglePlaces) {
      try {
        return await googlePlacesService.searchBusinesses(searchParams);
      } catch (error) {
        console.warn('Google Places search failed:', error);
      }
    }

    // Fallback to Firebase search
    if (this.useFirebase) {
      try {
        return await firebaseBusinessService.searchBusinesses(searchParams);
      } catch (error) {
        console.warn('Firebase search failed:', error);
      }
    }

    // Final fallback to mock search
    if (this.useMockService) {
      return mockBusinessService.searchBusinesses(searchParams);
    }

    throw new Error('All search sources failed');
  }

  async getBusinessById(id: string): Promise<Business> {
    // First try Firebase (for user-generated content)
    if (this.useFirebase) {
      try {
        return await firebaseBusinessService.getBusinessById(id);
      } catch (error) {
        console.warn('Firebase getBusinessById failed:', error);
      }
    }

    // Fallback to mock data
    if (this.useMockService) {
      return mockBusinessService.getBusinessById(id);
    }

    throw new Error('Business not found');
  }

  async createBusiness(businessData: BusinessForm): Promise<Business> {
    // Always store user-generated businesses in Firebase
    if (this.useFirebase) {
      return await firebaseBusinessService.createBusiness(businessData);
    }

    throw new Error('Business creation not available');
  }

  async updateBusiness(id: string, data: Partial<BusinessForm>): Promise<Business> {
    if (this.useFirebase) {
      return await firebaseBusinessService.updateBusiness(id, data);
    }

    throw new Error('Business update not available');
  }

  async deleteBusiness(id: string): Promise<void> {
    if (this.useFirebase) {
      return await firebaseBusinessService.deleteBusiness(id);
    }

    throw new Error('Business deletion not available');
  }

  async getUserBusinesses(userId: string): Promise<Business[]> {
    if (this.useFirebase) {
      return await firebaseBusinessService.getUserBusinesses(userId);
    }

    return [];
  }

  // Helper method to cache Google Places data in Firebase
  private async cacheGooglePlacesData(googlePlacesData: Business[]): Promise<void> {
    if (!this.useFirebase) return;

    try {
      // Only cache data that doesn't already exist
      for (const business of googlePlacesData) {
        try {
          // Check if business already exists in Firebase
          await firebaseBusinessService.getBusinessById(business.id);
        } catch {
          // Business doesn't exist, create it with Google Places data
          const businessForm: BusinessForm = {
            name: business.name,
            description: business.description,
            category: business.category,
            location: business.location,
            phoneNumber: business.phoneNumber,
            email: business.email,
            website: business.website || '',
            images: business.images,
            priceRange: business.priceRange,
            hours: business.hours,
            amenities: business.amenities,
            ownerId: business.ownerId,
          };

          await firebaseBusinessService.createBusiness(businessForm);
        }
      }
    } catch (error) {
      console.warn('Failed to cache Google Places data:', error);
      // Don't throw - this is just caching
    }
  }
}

export const businessService = new BusinessService();
