# Firestore Database Schema

## Collections Overview

This document describes the Firestore collections and document structures for the FoodVenturer app.

---

## 1. `businesses` Collection

Stores all business/restaurant information.

### Document Structure

```typescript
{
  id: string;                    // Auto-generated document ID
  name: string;                  // Business name
  description: string;           // Business description
  category: BusinessCategory;    // 'restaurant' | 'cafe' | 'fast_food' | etc.
  
  // Location Information
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  
  // Contact Information
  phoneNumber?: string;
  email?: string;
  website?: string;
  
  // Media
  images: string[];              // Array of image URLs
  
  // Business Details
  rating: number;                // Average rating (0-5)
  reviewCount: number;           // Total number of reviews
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  
  // Operating Hours
  hours: {
    monday: { isOpen: boolean; openTime: string; closeTime: string; };
    tuesday: { isOpen: boolean; openTime: string; closeTime: string; };
    wednesday: { isOpen: boolean; openTime: string; closeTime: string; };
    thursday: { isOpen: boolean; openTime: string; closeTime: string; };
    friday: { isOpen: boolean; openTime: string; closeTime: string; };
    saturday: { isOpen: boolean; openTime: string; closeTime: string; };
    sunday: { isOpen: boolean; openTime: string; closeTime: string; };
  };
  
  // Features
  amenities: string[];           // ['wifi', 'parking', 'delivery', etc.]
  
  // Status
  isVerified: boolean;           // Verified by admin
  isActive: boolean;             // Currently active/visible
  
  // Ownership
  ownerId: string;               // Reference to user who owns this business
  
  // Timestamps
  createdAt: string;             // ISO 8601 format
  updatedAt: string;             // ISO 8601 format
}
```

### Indexes Required

- `ownerId` (for querying businesses by owner)
- `category` (for filtering by category)
- `isActive` (for showing only active businesses)
- `rating` (for sorting by rating)
- Composite: `category` + `isActive` + `rating`

### Example Document

```json
{
  "id": "abc123",
  "name": "Ati-Atihan Restaurant",
  "description": "Authentic Aklanon cuisine",
  "category": "restaurant",
  "location": {
    "latitude": 11.6900,
    "longitude": 122.3675,
    "address": "Poblacion, Kalibo, Aklan",
    "city": "Kalibo",
    "state": "Aklan",
    "country": "Philippines",
    "postalCode": "5600"
  },
  "phoneNumber": "+63 917 123 4567",
  "email": "info@atiatihanrestaurant.com",
  "website": "https://atiatihanrestaurant.com",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "rating": 4.6,
  "reviewCount": 187,
  "priceRange": "$$",
  "hours": {
    "monday": { "isOpen": true, "openTime": "07:00", "closeTime": "21:00" }
  },
  "amenities": ["wifi", "parking", "delivery"],
  "isVerified": true,
  "isActive": true,
  "ownerId": "user123",
  "createdAt": "2023-01-15T10:00:00Z",
  "updatedAt": "2023-12-01T15:30:00Z"
}
```

---

## 2. `businessMarkers` Collection

Stores GPS markers for businesses on Google Maps.

### Document Structure

```typescript
{
  id: string;                    // Same as businessId (document ID)
  businessId: string;            // Reference to business document
  latitude: number;              // GPS latitude
  longitude: number;             // GPS longitude
  address?: string;              // Optional address string
  placedAt: string;              // When marker was first placed (ISO 8601)
  updatedAt: string;             // Last update timestamp (ISO 8601)
}
```

### Purpose

- Allows business owners to manually place/update their location marker
- Provides fallback when Google Places API doesn't have the location
- Enables precise location control by owners
- Can be different from business.location if owner updates it

### Indexes Required

- `businessId` (for quick lookup)
- Geohash (for proximity queries - if using GeoFirestore)

### Example Document

```json
{
  "id": "abc123",
  "businessId": "abc123",
  "latitude": 11.6900,
  "longitude": 122.3675,
  "address": "Exact location at Poblacion, Kalibo",
  "placedAt": "2023-06-15T14:30:00Z",
  "updatedAt": "2023-12-01T10:15:00Z"
}
```

---

## 3. `users` Collection

Stores user profile information (existing collection).

### Additional Fields for Business Owners

```typescript
{
  // ... existing user fields ...
  
  // Business Owner Fields
  isBusinessOwner: boolean;      // Flag indicating business owner
  businessIds: string[];         // Array of owned business IDs
  ownerProfile?: {
    businessName: string;        // Primary business name
    contactPhone: string;        // Owner contact
    verificationStatus: 'pending' | 'verified' | 'rejected';
    verifiedAt?: string;
  };
}
```

---

## 4. `reviews` Collection (Future)

For customer reviews of businesses.

### Document Structure

```typescript
{
  id: string;
  businessId: string;            // Reference to business
  userId: string;                // Reference to user who wrote review
  rating: number;                // 1-5 stars
  comment: string;
  images?: string[];             // Optional review images
  createdAt: string;
  updatedAt: string;
}
```

---

## Security Rules

### Firestore Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Businesses Collection
    match /businesses/{businessId} {
      // Anyone can read active businesses
      allow read: if resource.data.isActive == true;
      
      // Only authenticated users can create
      allow create: if request.auth != null;
      
      // Only owner can update/delete
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.ownerId;
    }
    
    // Business Markers Collection
    match /businessMarkers/{markerId} {
      // Anyone can read markers
      allow read: if true;
      
      // Only business owner can write markers
      allow write: if request.auth != null 
        && exists(/databases/$(database)/documents/businesses/$(markerId))
        && get(/databases/$(database)/documents/businesses/$(markerId)).data.ownerId == request.auth.uid;
    }
    
    // Users Collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own data
      allow update: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Data Migration

### Migrating Mock Data to Firestore

To populate Firestore with the existing mock data:

```typescript
// migration script
import { mockBusinessService } from './services/mockBusinessService';
import { firestoreBusinessService } from './services/firestoreBusinessService';

async function migrateMockData() {
  const mockData = await mockBusinessService.searchBusinesses({
    location: { /* ... */ },
    filters: {},
    sortBy: 'rating',
    page: 1,
    limit: 100,
  });
  
  for (const business of mockData.data) {
    // Create business in Firestore
    const businessId = await firestoreBusinessService.createBusiness(
      business,
      business.ownerId
    );
    
    // Add marker
    await firestoreBusinessService.saveBusinessMarker(
      businessId,
      business.location.latitude,
      business.location.longitude,
      business.location.address
    );
  }
}
```

---

## API Integration Strategy

### Hybrid Approach: Firestore + Google Places API

1. **Primary Source**: Firestore database
   - All business data stored here
   - Markers placed by owners
   - Fast queries and filtering

2. **Fallback/Enhancement**: Google Places API
   - Used for additional information
   - Verification of addresses
   - Additional photos/reviews

3. **Marker Priority**:
   ```
   1. businessMarkers collection (owner-placed)
   2. businesses.location (from business document)
   3. Google Places API (if available)
   ```

---

## Query Examples

### Get All Active Restaurants

```typescript
const restaurants = await firestoreBusinessService.getAllBusinesses({
  category: 'restaurant',
  isActive: true,
});
```

### Get Businesses by Owner

```typescript
const myBusinesses = await firestoreBusinessService.getBusinessesByOwner(userId);
```

### Get Nearby Businesses

```typescript
const nearby = await firestoreBusinessService.getNearbyBusinesses(
  11.6894,  // latitude
  122.3670, // longitude
  5         // radius in km
);
```

### Get Business Marker

```typescript
const marker = await firestoreBusinessService.getBusinessMarker(businessId);
```

---

## Backup and Sync

### Automatic Backups

- Enable Firestore automatic backups in Firebase Console
- Schedule: Daily at 2:00 AM UTC
- Retention: 30 days

### Data Export

```bash
# Export all collections
gcloud firestore export gs://[BUCKET_NAME] --collection-ids=businesses,businessMarkers,users
```

---

## Performance Optimization

1. **Composite Indexes**: Create for common query patterns
2. **Pagination**: Use `limit()` and `startAfter()` for large datasets
3. **Caching**: Implement local caching for frequently accessed data
4. **Denormalization**: Store computed values (rating, reviewCount) in business document

---

## Monitoring

### Key Metrics to Track

- Read/Write operations per day
- Query performance
- Storage usage
- Failed operations
- Marker placement frequency

### Alerts

- Set up alerts for:
  - High read/write costs
  - Failed security rule violations
  - Unusual activity patterns

---

**Last Updated**: October 19, 2025
