// Mock Authentication Service for Development

import { User, LoginForm, RegisterForm, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@foodventurer.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'owner@foodventurer.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'business_owner',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@foodventurer.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'user@foodventurer.com': 'password123',
  'owner@foodventurer.com': 'password123',
  'admin@foodventurer.com': 'password123',
};

class MockAuthService {
  private generateToken(): string {
    return 'mock_jwt_token_' + Math.random().toString(36).substr(2, 9);
  }

  private generateRefreshToken(): string {
    return 'mock_refresh_token_' + Math.random().toString(36).substr(2, 9);
  }

  async login(credentials: LoginForm): Promise<{ user: User; token: string; refreshToken: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === credentials.email);
    const password = mockPasswords[credentials.email];

    if (!user || password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken();
    const refreshToken = this.generateRefreshToken();

    return {
      user,
      token,
      refreshToken,
    };
  }

  async register(userData: RegisterForm): Promise<{ user: User; token: string; refreshToken: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);
    mockPasswords[userData.email] = userData.password;

    const token = this.generateToken();
    const refreshToken = this.generateRefreshToken();

    return {
      user: newUser,
      token,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!refreshToken.startsWith('mock_refresh_token_')) {
      throw new Error('Invalid refresh token');
    }

    return {
      token: this.generateToken(),
      refreshToken: this.generateRefreshToken(),
    };
  }

  async logout(token: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, you would invalidate the token on the server
    console.log('Logged out with token:', token);
  }

  async forgotPassword(email: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you would send an email
    console.log('Password reset email sent to:', email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!token.startsWith('reset_token_')) {
      throw new Error('Invalid reset token');
    }

    // In a real app, you would update the password in the database
    console.log('Password reset for token:', token);
  }

  // Helper method to get user by token (for development)
  async getUserByToken(token: string): Promise<User | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!token.startsWith('mock_jwt_token_')) {
      return null;
    }

    // In a real app, you would decode the JWT and get user info
    // For now, return the first user as an example
    return mockUsers[0];
  }
}

export const mockAuthService = new MockAuthService();
