// Core Types and Interfaces for Foodventurer App

// User Role Types
export type UserRole = 'user' | 'business_owner' | 'admin';

// Authentication Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// Restaurant/Business Types
export interface Business {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  location: Location;
  phoneNumber: string;
  email: string;
  website?: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  hours: BusinessHours;
  amenities: string[];
  isVerified: boolean;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type BusinessCategory = 
  | 'restaurant'
  | 'cafe'
  | 'fast_food'
  | 'fine_dining'
  | 'bar'
  | 'food_truck'
  | 'bakery'
  | 'pizzeria'
  | 'sushi'
  | 'mexican'
  | 'italian'
  | 'chinese'
  | 'indian'
  | 'thai'
  | 'other';

export type PriceRange = '$' | '$$' | '$$$' | '$$$$';

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime?: string; // Format: "HH:MM"
  closeTime?: string; // Format: "HH:MM"
}

// Menu Types
export interface Menu {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  items: MenuItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  isAvailable: boolean;
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

// Review Types
export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

// Search and Filter Types
export interface SearchFilters {
  category?: BusinessCategory[];
  priceRange?: PriceRange[];
  rating?: number;
  distance?: number; // in miles/km
  amenities?: string[];
  isOpenNow?: boolean;
  hasDelivery?: boolean;
  hasTakeout?: boolean;
}

export interface SearchParams {
  query?: string;
  location: Location;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
}

export type SortOption = 
  | 'distance'
  | 'rating'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'newest'
  | 'most_reviewed';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  BusinessDetail: { businessId: string };
  UserProfile: undefined;
  BusinessProfile: undefined;
  AdminDashboard: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RoleSelection: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type BusinessTabParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Reviews: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Users: undefined;
  Businesses: undefined;
  Reviews: undefined;
  Analytics: undefined;
  Settings: undefined;
};

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  role: UserRole;
}

export interface BusinessForm {
  name: string;
  description: string;
  category: BusinessCategory;
  phoneNumber: string;
  email: string;
  website?: string;
  location: Location;
  hours: BusinessHours;
  amenities: string[];
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Analytics Types
export interface BusinessAnalytics {
  businessId: string;
  views: number;
  clicks: number;
  calls: number;
  directions: number;
  reviews: number;
  averageRating: number;
  revenue?: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dateRange: {
    start: string;
    end: string;
  };
}

export interface AppAnalytics {
  totalUsers: number;
  totalBusinesses: number;
  totalReviews: number;
  averageRating: number;
  activeUsers: number;
  newRegistrations: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dateRange: {
    start: string;
    end: string;
  };
}
