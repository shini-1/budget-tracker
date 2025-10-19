// Firestore Business Service - Handle business data and markers

import firestore from '@react-native-firebase/firestore';
import { Business, Location } from '../types';

export interface BusinessMarker {
  id: string;
  businessId: string;
  latitude: number;
  longitude: number;
  address?: string;
  placedAt: string;
  updatedAt: string;
}

export class FirestoreBusinessService {
  private businessCollection = 'businesses';
  private markerCollection = 'businessMarkers';

  /**
   * Create a new business
   */
  async createBusiness(businessData: Partial<Business>, ownerId: string): Promise<string> {
    try {
      const newBusiness = {
        ...businessData,
        ownerId,
        isActive: true,
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await firestore()
        .collection(this.businessCollection)
        .add(newBusiness);

      return docRef.id;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  /**
   * Update existing business
   */
  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<void> {
    try {
      await firestore()
        .collection(this.businessCollection)
        .doc(businessId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  /**
   * Get business by ID
   */
  async getBusinessById(businessId: string): Promise<Business | null> {
    try {
      const doc = await firestore()
        .collection(this.businessCollection)
        .doc(businessId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as Business;
    } catch (error) {
      console.error('Error getting business:', error);
      throw error;
    }
  }

  /**
   * Get businesses by owner ID
   */
  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    try {
      const snapshot = await firestore()
        .collection(this.businessCollection)
        .where('ownerId', '==', ownerId)
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[];
    } catch (error) {
      console.error('Error getting businesses by owner:', error);
      throw error;
    }
  }

  /**
   * Get all businesses with optional filters
   */
  async getAllBusinesses(filters?: {
    category?: string;
    priceRange?: string;
    isActive?: boolean;
  }): Promise<Business[]> {
    try {
      let query = firestore().collection(this.businessCollection);

      if (filters?.category && filters.category !== 'all') {
        query = query.where('category', '==', filters.category) as any;
      }

      if (filters?.priceRange && filters.priceRange !== 'all') {
        query = query.where('priceRange', '==', filters.priceRange) as any;
      }

      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive) as any;
      }

      const snapshot = await query.get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[];
    } catch (error) {
      console.error('Error getting all businesses:', error);
      throw error;
    }
  }

  /**
   * Search businesses by name or description
   */
  async searchBusinesses(searchTerm: string): Promise<Business[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation. For production, consider using Algolia or similar
      const snapshot = await firestore()
        .collection(this.businessCollection)
        .where('isActive', '==', true)
        .get();

      const businesses = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as Business[];

      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      return businesses.filter(business => 
        business.name.toLowerCase().includes(searchLower) ||
        business.description?.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }

  /**
   * Add or update business marker
   */
  async saveBusinessMarker(
    businessId: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<void> {
    try {
      const markerData: Omit<BusinessMarker, 'id'> = {
        businessId,
        latitude,
        longitude,
        address,
        placedAt: firestore.FieldValue.serverTimestamp() as any,
        updatedAt: firestore.FieldValue.serverTimestamp() as any,
      };

      await firestore()
        .collection(this.markerCollection)
        .doc(businessId)
        .set(markerData, { merge: true });

      // Also update the business location
      await this.updateBusiness(businessId, {
        location: {
          latitude,
          longitude,
          address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        } as Location,
      });
    } catch (error) {
      console.error('Error saving business marker:', error);
      throw error;
    }
  }

  /**
   * Get business marker
   */
  async getBusinessMarker(businessId: string): Promise<BusinessMarker | null> {
    try {
      const doc = await firestore()
        .collection(this.markerCollection)
        .doc(businessId)
        .get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as BusinessMarker;
    } catch (error) {
      console.error('Error getting business marker:', error);
      throw error;
    }
  }

  /**
   * Get all markers for map display
   */
  async getAllMarkers(): Promise<BusinessMarker[]> {
    try {
      const snapshot = await firestore()
        .collection(this.markerCollection)
        .get();

      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      })) as BusinessMarker[];
    } catch (error) {
      console.error('Error getting all markers:', error);
      throw error;
    }
  }

  /**
   * Get nearby businesses based on location
   */
  async getNearbyBusinesses(
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<Business[]> {
    try {
      // Note: Firestore doesn't support geoqueries natively
      // This is a simple implementation. For production, consider using GeoFirestore
      const allBusinesses = await this.getAllBusinesses({ isActive: true });

      // Filter by distance (simple calculation)
      return allBusinesses.filter(business => {
        if (!business.location) return false;

        const distance = this.calculateDistance(
          latitude,
          longitude,
          business.location.latitude,
          business.location.longitude
        );

        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Error getting nearby businesses:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Delete business
   */
  async deleteBusiness(businessId: string): Promise<void> {
    try {
      // Delete marker first
      await firestore()
        .collection(this.markerCollection)
        .doc(businessId)
        .delete();

      // Then delete business
      await firestore()
        .collection(this.businessCollection)
        .doc(businessId)
        .delete();
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  }

  /**
   * Toggle business active status
   */
  async toggleBusinessStatus(businessId: string, isActive: boolean): Promise<void> {
    try {
      await this.updateBusiness(businessId, { isActive });
    } catch (error) {
      console.error('Error toggling business status:', error);
      throw error;
    }
  }
}

export const firestoreBusinessService = new FirestoreBusinessService();
