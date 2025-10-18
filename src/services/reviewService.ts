// Review Service

import { API_CONFIG } from '../constants';
import { Review, ApiResponse } from '../types';
import { apiClient } from './apiClient';

class ReviewService {
  async getBusinessReviews(businessId: string): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>(
      API_CONFIG.ENDPOINTS.BUSINESS.REVIEWS.replace(':id', businessId)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch reviews');
    }
    
    return response.data.data;
  }

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      API_CONFIG.ENDPOINTS.REVIEW.CREATE,
      reviewData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create review');
    }
    
    return response.data.data;
  }

  async updateReview(id: string, data: Partial<Review>): Promise<Review> {
    const response = await apiClient.put<ApiResponse<Review>>(
      API_CONFIG.ENDPOINTS.REVIEW.UPDATE.replace(':id', id),
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update review');
    }
    
    return response.data.data;
  }

  async deleteReview(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.REVIEW.DELETE.replace(':id', id)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete review');
    }
  }
}

export const reviewService = new ReviewService();
