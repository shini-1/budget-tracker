# Firebase Database Setup Guide

## Database Structure

### Collections

#### 1. **users** Collection
Stores user profile information.

```javascript
{
  userId: string (document ID),
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  role: 'user' | 'business_owner' | 'admin',
  profileImage: string (URL),
  isVerified: boolean,
  preferences: {
    favoriteCategories: string[],
    dietaryRestrictions: string[],
    notifications: boolean
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- `email` (ascending)
- `role` (ascending)
- `createdAt` (descending)

---

#### 2. **businesses** Collection
Stores restaurant/business information.

```javascript
{
  businessId: string (document ID),
  name: string,
  description: string,
  category: 'restaurant' | 'cafe' | 'fast_food' | 'fine_dining' | 'bar' | 'food_truck' | 'bakery' | 'pizzeria' | 'sushi' | 'mexican' | 'italian' | 'chinese' | 'indian' | 'thai' | 'other',
  location: {
    latitude: number,
    longitude: number,
    address: string,
    city: string,
    state: string,
    country: string,
    postalCode: string
  },
  phoneNumber: string,
  email: string,
  website: string,
  images: string[] (URLs),
  rating: number (0-5),
  reviewCount: number,
  priceRange: '$' | '$$' | '$$$' | '$$$$',
  hours: {
    monday: { isOpen: boolean, openTime: string, closeTime: string },
    tuesday: { isOpen: boolean, openTime: string, closeTime: string },
    wednesday: { isOpen: boolean, openTime: string, closeTime: string },
    thursday: { isOpen: boolean, openTime: string, closeTime: string },
    friday: { isOpen: boolean, openTime: string, closeTime: string },
    saturday: { isOpen: boolean, openTime: string, closeTime: string },
    sunday: { isOpen: boolean, openTime: string, closeTime: string }
  },
  amenities: string[],
  isVerified: boolean,
  isActive: boolean,
  ownerId: string (reference to users collection),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- `category` (ascending)
- `isActive` (ascending)
- `rating` (descending)
- `createdAt` (descending)
- Composite: `isActive` (ascending) + `category` (ascending)
- Composite: `isActive` (ascending) + `rating` (descending)

---

#### 3. **reviews** Collection
Stores user reviews for businesses.

```javascript
{
  reviewId: string (document ID),
  businessId: string (reference to businesses),
  userId: string (reference to users),
  userName: string,
  userAvatar: string (URL),
  rating: number (1-5),
  title: string,
  comment: string,
  images: string[] (URLs),
  isVerified: boolean,
  helpfulCount: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- `businessId` (ascending) + `createdAt` (descending)
- `userId` (ascending) + `createdAt` (descending)
- `rating` (descending)

---

#### 4. **menus** Collection
Stores menu information for businesses.

```javascript
{
  menuId: string (document ID),
  businessId: string (reference to businesses),
  name: string,
  description: string,
  items: [
    {
      id: string,
      name: string,
      description: string,
      price: number,
      category: string,
      images: string[],
      isAvailable: boolean,
      allergens: string[],
      nutritionInfo: {
        calories: number,
        protein: number,
        carbs: number,
        fat: number
      }
    }
  ],
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- `businessId` (ascending)
- `isActive` (ascending)

---

#### 5. **favorites** Collection
Stores user's favorite businesses.

```javascript
{
  favoriteId: string (document ID),
  userId: string (reference to users),
  businessId: string (reference to businesses),
  createdAt: timestamp
}
```

**Indexes:**
- Composite: `userId` (ascending) + `businessId` (ascending) - UNIQUE
- `userId` (ascending) + `createdAt` (descending)

---

#### 6. **notifications** Collection
Stores user notifications.

```javascript
{
  notificationId: string (document ID),
  userId: string (reference to users),
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error',
  isRead: boolean,
  actionUrl: string,
  createdAt: timestamp
}
```

**Indexes:**
- `userId` (ascending) + `isRead` (ascending) + `createdAt` (descending)

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isBusinessOwner() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'business_owner';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isOwner(userId) || isAdmin();
    }
    
    // Businesses collection
    match /businesses/{businessId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated() && (isBusinessOwner() || isAdmin());
      allow update: if isAuthenticated() && 
                      (resource.data.ownerId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && 
                      (resource.data.ownerId == request.auth.uid || isAdmin());
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Menus collection
    match /menus/{menuId} {
      allow read: if true; // Public read
      allow create: if isAuthenticated() && (isBusinessOwner() || isAdmin());
      allow update: if isAuthenticated() && 
                      (get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && 
                      (get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId == request.auth.uid || isAdmin());
    }
    
    // Favorites collection
    match /favorites/{favoriteId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAdmin();
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
```

---

## Setup Instructions

### 1. Create Collections

Go to Firebase Console → Firestore Database → Start collection

Create each collection listed above.

### 2. Add Indexes

Go to Firebase Console → Firestore Database → Indexes

Add the composite indexes listed for each collection.

### 3. Set Security Rules

Go to Firebase Console → Firestore Database → Rules

Copy and paste the security rules above.

### 4. Seed Sample Data

Run the seed script (see `scripts/seedFirebase.js`) to populate with sample data:

```bash
node scripts/seedFirebase.js
```

---

## Sample Data

### Sample User
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+63 912 345 6789",
  role: "user",
  profileImage: "",
  isVerified: true,
  preferences: {
    favoriteCategories: ["restaurant", "cafe"],
    dietaryRestrictions: [],
    notifications: true
  },
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Sample Business
```javascript
{
  name: "The Golden Spoon",
  description: "Fine dining restaurant serving contemporary Filipino cuisine with a modern twist.",
  category: "fine_dining",
  location: {
    latitude: 11.6894,
    longitude: 122.3670,
    address: "123 Roxas Avenue",
    city: "Kalibo",
    state: "Aklan",
    country: "Philippines",
    postalCode: "5600"
  },
  phoneNumber: "+63 36 268 1234",
  email: "info@goldenspoon.ph",
  website: "https://goldenspoon.ph",
  images: [],
  rating: 4.5,
  reviewCount: 0,
  priceRange: "$$$",
  hours: {
    monday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    tuesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    wednesday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    thursday: { isOpen: true, openTime: "11:00", closeTime: "22:00" },
    friday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
    saturday: { isOpen: true, openTime: "11:00", closeTime: "23:00" },
    sunday: { isOpen: true, openTime: "11:00", closeTime: "22:00" }
  },
  amenities: ["wifi", "parking", "reservations", "outdoor_seating", "alcohol"],
  isVerified: true,
  isActive: true,
  ownerId: "user_id_here",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

---

## Next Steps

1. ✅ Create all collections in Firebase Console
2. ✅ Add indexes for better query performance
3. ✅ Set security rules
4. ✅ Run seed script to add sample data
5. ✅ Test CRUD operations from the app
