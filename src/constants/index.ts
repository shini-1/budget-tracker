// App Constants and Configuration

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://api.foodventurer.com',
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '10000'),
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      DELETE_ACCOUNT: '/user/account',
    },
    BUSINESS: {
      LIST: '/businesses',
      DETAIL: '/businesses/:id',
      CREATE: '/businesses',
      UPDATE: '/businesses/:id',
      DELETE: '/businesses/:id',
      SEARCH: '/businesses/search',
      NEARBY: '/businesses/nearby',
      REVIEWS: '/businesses/:id/reviews',
      MENU: '/businesses/:id/menu',
      ANALYTICS: '/businesses/:id/analytics',
    },
    REVIEW: {
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      DELETE: '/reviews/:id',
      LIST: '/reviews',
    },
    ADMIN: {
      USERS: '/admin/users',
      BUSINESSES: '/admin/businesses',
      ANALYTICS: '/admin/analytics',
      SETTINGS: '/admin/settings',
    },
  },
};

// Google Maps Configuration
export const MAPS_CONFIG = {
  API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  DEFAULT_ZOOM: 15,
  DEFAULT_CENTER: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  SEARCH_RADIUS: 5000, // 5km in meters
  CLUSTER_SIZE: 50,
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Foodventurer',
  VERSION: '1.0.0',
  DEBUG: process.env.DEBUG_MODE === 'true',
  SUPPORTED_LANGUAGES: ['en', 'es', 'fr'],
  DEFAULT_LANGUAGE: 'en',
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'foodventurer_auth_token',
  REFRESH_TOKEN: 'foodventurer_refresh_token',
  USER_DATA: 'foodventurer_user_data',
  LOCATION_DATA: 'foodventurer_location_data',
  SEARCH_HISTORY: 'foodventurer_search_history',
  FAVORITES: 'foodventurer_favorites',
  SETTINGS: 'foodventurer_settings',
};

// Business Categories
export const BUSINESS_CATEGORIES = [
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'cafe', label: 'Café', icon: '☕' },
  { value: 'fast_food', label: 'Fast Food', icon: '🍔' },
  { value: 'fine_dining', label: 'Fine Dining', icon: '🍷' },
  { value: 'bar', label: 'Bar', icon: '🍺' },
  { value: 'food_truck', label: 'Food Truck', icon: '🚚' },
  { value: 'bakery', label: 'Bakery', icon: '🥖' },
  { value: 'pizzeria', label: 'Pizzeria', icon: '🍕' },
  { value: 'sushi', label: 'Sushi', icon: '🍣' },
  { value: 'mexican', label: 'Mexican', icon: '🌮' },
  { value: 'italian', label: 'Italian', icon: '🍝' },
  { value: 'chinese', label: 'Chinese', icon: '🥢' },
  { value: 'indian', label: 'Indian', icon: '🍛' },
  { value: 'thai', label: 'Thai', icon: '🌶️' },
  { value: 'other', label: 'Other', icon: '🍴' },
] as const;

// Price Ranges
export const PRICE_RANGES = [
  { value: '$', label: '$ (Under $10)', description: 'Budget-friendly' },
  { value: '$$', label: '$$ ($10-25)', description: 'Moderate' },
  { value: '$$$', label: '$$$ ($25-50)', description: 'Upscale' },
  { value: '$$$$', label: '$$$$ ($50+)', description: 'Fine dining' },
] as const;

// Amenities
export const AMENITIES = [
  { value: 'wifi', label: 'Free WiFi', icon: '📶' },
  { value: 'parking', label: 'Parking', icon: '🅿️' },
  { value: 'delivery', label: 'Delivery', icon: '🚚' },
  { value: 'takeout', label: 'Takeout', icon: '🥡' },
  { value: 'outdoor_seating', label: 'Outdoor Seating', icon: '🌳' },
  { value: 'wheelchair_accessible', label: 'Wheelchair Accessible', icon: '♿' },
  { value: 'pet_friendly', label: 'Pet Friendly', icon: '🐕' },
  { value: 'live_music', label: 'Live Music', icon: '🎵' },
  { value: 'happy_hour', label: 'Happy Hour', icon: '🍻' },
  { value: 'kids_menu', label: 'Kids Menu', icon: '👶' },
  { value: 'vegetarian', label: 'Vegetarian Options', icon: '🥬' },
  { value: 'vegan', label: 'Vegan Options', icon: '🌱' },
  { value: 'gluten_free', label: 'Gluten-Free Options', icon: '🌾' },
  { value: 'alcohol', label: 'Alcohol Served', icon: '🍷' },
  { value: 'reservations', label: 'Reservations', icon: '📞' },
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: 'distance', label: 'Distance', icon: '📍' },
  { value: 'rating', label: 'Rating', icon: '⭐' },
  { value: 'price_low_to_high', label: 'Price: Low to High', icon: '💰' },
  { value: 'price_high_to_low', label: 'Price: High to Low', icon: '💎' },
  { value: 'newest', label: 'Newest', icon: '🆕' },
  { value: 'most_reviewed', label: 'Most Reviewed', icon: '💬' },
] as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  BUSINESS_OWNER: 'business_owner',
  ADMIN: 'admin',
} as const;

// Theme Colors
export const COLORS = {
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A65',
  secondary: '#2E7D32',
  secondaryDark: '#1B5E20',
  secondaryLight: '#4CAF50',
  accent: '#FFC107',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  error: '#F44336',
  warning: '#FF9800',
  success: '#4CAF50',
  info: '#2196F3',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
  },
  border: '#E0E0E0',
  divider: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
} as const;

// Animation Durations
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
} as const;

// Validation Rules
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  businessName: {
    minLength: 2,
    maxLength: 100,
  },
  description: {
    maxLength: 500,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  USER_NOT_FOUND: 'User not found.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  WEAK_PASSWORD: 'Password is too weak. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.',
  LOCATION_PERMISSION_DENIED: 'Location permission is required to find nearby restaurants.',
  CAMERA_PERMISSION_DENIED: 'Camera permission is required to take photos.',
  STORAGE_PERMISSION_DENIED: 'Storage permission is required to save images.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  BUSINESS_NOT_FOUND: 'Restaurant not found.',
  REVIEW_NOT_FOUND: 'Review not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BUSINESS_CREATED: 'Restaurant added successfully!',
  BUSINESS_UPDATED: 'Restaurant updated successfully!',
  REVIEW_CREATED: 'Review submitted successfully!',
  REVIEW_UPDATED: 'Review updated successfully!',
  REVIEW_DELETED: 'Review deleted successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  EMAIL_VERIFIED: 'Email verified successfully!',
} as const;

// Default Values
export const DEFAULTS = {
  SEARCH_RADIUS: 5, // km
  PAGE_SIZE: 20,
  MAX_IMAGES: 10,
  MAX_REVIEW_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 500,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  LOCATION_TIMEOUT: 10000, // 10 seconds
  IMAGE_QUALITY: 0.8,
  IMAGE_MAX_WIDTH: 1200,
  IMAGE_MAX_HEIGHT: 1200,
} as const;
