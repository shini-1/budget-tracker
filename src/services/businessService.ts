// Business Service

import { API_CONFIG } from '../constants';
import { Business, BusinessForm, SearchParams, PaginatedResponse, ApiResponse } from '../types';
import { apiClient } from './apiClient';

class BusinessService {
  async getBusinesses(params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<Business>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Business>>>(
      API_CONFIG.ENDPOINTS.BUSINESS.LIST,
      { params }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch businesses');
    }
    
    return response.data.data;
  }

  async getBusinessById(id: string): Promise<Business> {
    const response = await apiClient.get<ApiResponse<Business>>(
      API_CONFIG.ENDPOINTS.BUSINESS.DETAIL.replace(':id', id)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch business');
    }
    
    return response.data.data;
  }

  async searchBusinesses(searchParams: SearchParams): Promise<PaginatedResponse<Business>> {
    const response = await apiClient.post<ApiResponse<PaginatedResponse<Business>>>(
      API_CONFIG.ENDPOINTS.BUSINESS.SEARCH,
      searchParams
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Search failed');
    }
    
    return response.data.data;
  }

  async createBusiness(businessData: BusinessForm): Promise<Business> {
    const response = await apiClient.post<ApiResponse<Business>>(
      API_CONFIG.ENDPOINTS.BUSINESS.CREATE,
      businessData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create business');
    }
    
    return response.data.data;
  }

  async updateBusiness(id: string, data: Partial<BusinessForm>): Promise<Business> {
    const response = await apiClient.put<ApiResponse<Business>>(
      API_CONFIG.ENDPOINTS.BUSINESS.UPDATE.replace(':id', id),
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update business');
    }
    
    return response.data.data;
  }

  async deleteBusiness(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.BUSINESS.DELETE.replace(':id', id)
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete business');
    }
  }

  async getUserBusinesses(): Promise<Business[]> {
    const response = await apiClient.get<ApiResponse<Business[]>>(
      API_CONFIG.ENDPOINTS.BUSINESS.LIST
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch user businesses');
    }
    
    return response.data.data;
  }
}

export const businessService = new BusinessService();
