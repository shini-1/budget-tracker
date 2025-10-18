// Authentication Service

import { API_CONFIG } from '../constants';
import { LoginForm, RegisterForm, User, ApiResponse } from '../types';
import { apiClient } from './apiClient';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Login failed');
    }
    
    return response.data.data;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      userData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    
    return response.data.data;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string; refreshToken: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Token refresh failed');
    }
    
    return response.data.data;
  }

  async logout(token: string): Promise<void> {
    try {
      await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Logout should not fail even if the server request fails
      console.warn('Logout request failed:', error);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, newPassword }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset failed');
    }
  }
}

export const authService = new AuthService();
