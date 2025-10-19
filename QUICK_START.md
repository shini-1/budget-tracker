# 🚀 Quick Start Guide

## FoodVenturer - Business Owner Features

---

## ⚡ **5-Minute Setup**

### 1. Install Dependencies (Already Done ✅)
```bash
npm install @react-native-community/geolocation
```

### 2. Run the App
```bash
# Start Metro
npx react-native start --reset-cache

# Run on Android
npx react-native run-android

# Or run on iOS
npx react-native run-ios
```

### 3. Test Features
- Open app
- Go to Profile tab
- If business owner: See "Business Dashboard" button
- Tap to access owner features

---

## 🎯 **Key Features**

### For Customers:
1. **Browse** - 10 Kalibo restaurants on home
2. **Filter** - By category, price, distance
3. **View** - Detail pages with Google Maps
4. **Navigate** - Get directions to restaurants

### For Business Owners:
1. **Dashboard** - Manage your business
2. **Add Marker** - Pin exact GPS location
3. **Edit Info** - Update business details
4. **View Stats** - See ratings and reviews

---

## 📍 **How to Add a Marker**

1. Profile → Business Dashboard
2. Tap "Add/Update Location Marker"
3. Map loads with your location
4. **Tap** anywhere to place marker
5. **Drag** marker to adjust
6. Tap "Use Current Location" for GPS
7. Tap "Save Marker"
8. Done! ✅

---

## 🗄️ **Firestore Collections**

### `businesses`
- All restaurant data
- Owner info
- Location, hours, amenities

### `businessMarkers`
- Custom GPS markers
- Owner-placed locations
- Override default coordinates

---

## 🔐 **Security Rules**

```bash
# Deploy rules to Firebase
firebase deploy --only firestore:rules
```

Rules ensure:
- Only owners can edit their businesses
- Only owners can place markers
- Anyone can view active businesses

---

## 📱 **User Roles**

### Regular User
- Browse and search
- View details
- Save favorites

### Business Owner
- All user features
- Business dashboard
- Add/edit business
- Place markers

---

## 🧪 **Quick Test**

### Test Marker Placement:
```typescript
// 1. Login as business owner
// 2. Navigate to dashboard
// 3. Tap "Add Location Marker"
// 4. Place marker on map
// 5. Save to Firestore
// 6. Check Firebase Console → businessMarkers
```

### Test Owner-Verified Badge:
```typescript
// 1. Add marker for a restaurant
// 2. Go to Home screen
// 3. Tap that restaurant
// 4. See "✓ Owner-verified location" badge
// 5. Map shows custom marker
```

---

## 📚 **Documentation**

- **Features**: `BUSINESS_OWNER_FEATURES.md`
- **Database**: `FIRESTORE_SCHEMA.md`
- **Integration**: `FIRESTORE_INTEGRATION_COMPLETE.md`
- **Deployment**: `DEPLOYMENT_READY.md`

---

## ✅ **Checklist**

- [x] Dependencies installed
- [x] Permissions configured
- [x] Navigation routes added
- [x] Firestore service integrated
- [x] Security rules defined
- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Rules deployed
- [ ] Test on device

---

## 🎉 **You're Ready!**

Everything is set up and ready to use. Just:
1. Create Firebase project (if needed)
2. Enable Firestore
3. Deploy security rules
4. Start testing!

**Happy coding!** 🚀
