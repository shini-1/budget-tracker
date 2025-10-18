// User Service

import { API_CONFIG } from '../constants';
import { User, ApiResponse } from '../types';
import { apiClient } from './apiClient';

class UserService {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USER.PROFILE
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch profile');
    }
    
    return response.data.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(
      API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
      data
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to update profile');
    }
    
    return response.data.data;
  }

  async deleteAccount(): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete account');
    }
  }
}

export const userService = new UserService();
