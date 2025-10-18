// Firebase Business Service

import firestore from '@react-native-firebase/firestore';
import { Business, BusinessForm, SearchParams, PaginatedResponse, Location } from '../types';
import { COLLECTIONS } from '../config/firebase';

class FirebaseBusinessService {
  // Get all businesses with pagination
  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    try {
      const page = params.page || 1;
      const limit = params.limit || 20;
      const offset = (page - 1) * limit;

      const query = firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset);

      const snapshot = await query.get();
      const businesses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Business[];

      // Get total count
      const totalSnapshot = await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('isActive', '==', true)
        .get();

      const total = totalSnapshot.size;

      return {
        data: businesses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error: any) {
      throw new Error('Failed to fetch businesses');
    }
  }

  // Get business by ID
  async getBusinessById(id: string): Promise<Business> {
    try {
      const doc = await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .doc(id)
        .get();

      if (!doc.exists) {
        throw new Error('Business not found');
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as Business;
    } catch (error: any) {
      throw new Error('Failed to fetch business');
    }
  }

  // Search businesses
  async searchBusinesses(searchParams: SearchParams): Promise<PaginatedResponse<Business>> {
    try {
      const page = searchParams.page || 1;
      const limit = searchParams.limit || 20;
      const offset = (page - 1) * limit;

      let query = firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('isActive', '==', true);

      // Apply filters
      if (searchParams.filters.category && searchParams.filters.category.length > 0) {
        query = query.where('category', 'in', searchParams.filters.category);
      }

      if (searchParams.filters.priceRange && searchParams.filters.priceRange.length > 0) {
        query = query.where('priceRange', 'in', searchParams.filters.priceRange);
      }

      if (searchParams.filters.rating) {
        query = query.where('rating', '>=', searchParams.filters.rating);
      }

      // Apply sorting
      switch (searchParams.sortBy) {
        case 'rating':
          query = query.orderBy('rating', 'desc');
          break;
        case 'most_reviewed':
          query = query.orderBy('reviewCount', 'desc');
          break;
        case 'newest':
          query = query.orderBy('createdAt', 'desc');
          break;
        default:
          query = query.orderBy('createdAt', 'desc');
      }

      query = query.limit(limit).offset(offset);

      const snapshot = await query.get();
      let businesses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Business[];

      // Apply text search filter (Firestore doesn't support full-text search)
      if (searchParams.query) {
        const queryLower = searchParams.query.toLowerCase();
        businesses = businesses.filter(business =>
          business.name.toLowerCase().includes(queryLower) ||
          business.description.toLowerCase().includes(queryLower) ||
          business.category.toLowerCase().includes(queryLower)
        );
      }

      // Get total count for pagination
      const totalSnapshot = await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('isActive', '==', true)
        .get();

      const total = totalSnapshot.size;

      return {
        data: businesses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: offset + limit < total,
          hasPrev: page > 1,
        },
      };
    } catch (error: any) {
      throw new Error('Failed to search businesses');
    }
  }

  // Get nearby businesses
  async getNearbyRestaurants(location: Location, radius: number = 5): Promise<Business[]> {
    try {
      // Note: Firestore doesn't support geospatial queries natively
      // This is a simplified implementation. In production, you would use
      // a geospatial database or implement a more sophisticated solution
      
      const query = firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('isActive', '==', true)
        .limit(50); // Get more results to filter by distance

      const snapshot = await query.get();
      const businesses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Business[];

      // Filter by distance (simplified calculation)
      const nearbyBusinesses = businesses.filter(business => {
        const distance = this.calculateDistance(
          location,
          business.location
        );
        return distance <= radius;
      });

      return nearbyBusinesses;
    } catch (error: any) {
      throw new Error('Failed to get nearby restaurants');
    }
  }

  // Create new business
  async createBusiness(businessData: BusinessForm, ownerId: string): Promise<Business> {
    try {
      const businessRef = firestore().collection(COLLECTIONS.BUSINESSES).doc();
      
      const newBusiness: Business = {
        id: businessRef.id,
        ...businessData,
        rating: 0,
        reviewCount: 0,
        isVerified: false,
        isActive: true,
        ownerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await businessRef.set({
        ...newBusiness,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      return newBusiness;
    } catch (error: any) {
      throw new Error('Failed to create business');
    }
  }

  // Update business
  async updateBusiness(id: string, updates: Partial<Business>): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .doc(id)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      throw new Error('Failed to update business');
    }
  }

  // Delete business
  async deleteBusiness(id: string): Promise<void> {
    try {
      await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .doc(id)
        .update({
          isActive: false,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error: any) {
      throw new Error('Failed to delete business');
    }
  }

  // Get businesses by owner
  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    try {
      const snapshot = await firestore()
        .collection(COLLECTIONS.BUSINESSES)
        .where('ownerId', '==', ownerId)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Business[];
    } catch (error: any) {
      throw new Error('Failed to fetch owner businesses');
    }
  }

  // Helper function to calculate distance between two points
  private calculateDistance(location1: Location, location2: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(location2.latitude - location1.latitude);
    const dLon = this.toRadians(location2.longitude - location1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(location1.latitude)) *
        Math.cos(this.toRadians(location2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const firebaseBusinessService = new FirebaseBusinessService();
