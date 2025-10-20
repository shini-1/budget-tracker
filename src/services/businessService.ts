// Business Service with Google Places API and Firebase integration

import { Business, BusinessForm, SearchParams, PaginatedResponse } from '../types';
import { mockBusinessService } from './mockBusinessService';
import { firebaseBusinessService } from './firebaseBusinessService';
import { googlePlacesService } from './googlePlacesService';

class BusinessService {
  private useGooglePlaces = false; // Disabled to avoid Google Maps API billing errors
  private useFirebase = true; // Primary data source - all businesses stored in Firestore
  private useMockService = false; // Fallback only - disabled in production

  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    // Primary: Google Places API for real restaurant data
    if (this.useGooglePlaces) {
      try {
        return await googlePlacesService.getBusinesses(params);
      } catch (error) {
        console.warn('Google Places API failed:', error);
      }
    }

    // Secondary: Firebase for user-generated business data
    if (this.useFirebase) {
      try {
        return await firebaseBusinessService.getBusinesses(params);
      } catch (error) {
        console.warn('Firebase failed:', error);
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

  async createBusiness(businessData: BusinessForm, ownerId: string): Promise<Business> {
    // Always store user-generated businesses in Firebase
    if (this.useFirebase) {
      return await firebaseBusinessService.createBusiness(businessData, ownerId);
    }

    throw new Error('Business creation not available');
  }

  async updateBusiness(id: string, data: Partial<BusinessForm>): Promise<void> {
    if (this.useFirebase) {
      await firebaseBusinessService.updateBusiness(id, data);
      return;
    }

    throw new Error('Business update not available');
  }

  async deleteBusiness(id: string): Promise<void> {
    if (this.useFirebase) {
      await firebaseBusinessService.deleteBusiness(id);
    }

    throw new Error('Business deletion not available');
  }

  async getUserBusinesses(userId: string): Promise<Business[]> {
    if (this.useFirebase) {
      return await firebaseBusinessService.getUserBusinesses(userId);
    }

    return [];
  }
}

export const businessService = new BusinessService();
