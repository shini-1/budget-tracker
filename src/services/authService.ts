// Authentication Service

import { API_CONFIG } from '../constants';
import { LoginForm, RegisterForm, User, ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { mockAuthService } from './mockAuthService';
import { firebaseAuthService } from './firebaseAuthService';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  private useMockService = false; // Set to true for development without Firebase
  private useFirebase = true; // Set to false to use REST API

  async login(credentials: LoginForm): Promise<AuthResponse> {
    if (this.useMockService) {
      return mockAuthService.login(credentials);
    }

    if (this.useFirebase) {
      const user = await firebaseAuthService.signIn(credentials.email, credentials.password);
      const token = await firebaseAuthService.getIdToken();
      
      if (!token) {
        throw new Error('Failed to get authentication token');
      }

      return {
        user,
        token,
        refreshToken: token, // Firebase handles refresh automatically
      };
    }

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
    if (this.useMockService) {
      return mockAuthService.register(userData);
    }

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
    if (this.useMockService) {
      return mockAuthService.refreshToken(refreshToken);
    }

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
    if (this.useMockService) {
      return mockAuthService.logout(token);
    }

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
    if (this.useMockService) {
      return mockAuthService.forgotPassword(email);
    }

    const response = await apiClient.post<ApiResponse<void>>(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Password reset failed');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (this.useMockService) {
      return mockAuthService.resetPassword(token, newPassword);
    }

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
