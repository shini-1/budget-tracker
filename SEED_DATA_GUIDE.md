# 🌱 Seed Firestore Data Guide

## Why You Don't See businessMarkers Collection

Firestore collections are **created automatically** when the first document is added. Since no markers have been created yet, the collection doesn't exist in your Firebase Console.

---

## ✅ Solution Implemented

I've added a **"Seed Sample Data"** button to your Business Owner Dashboard that will:

1. Create 3 sample businesses in the `businesses` collection
2. Create 3 corresponding markers in the `businessMarkers` collection
3. Use real Kalibo, Aklan locations

---

## 🚀 How to Use

### Step 1: Open the App
```bash
# App should already be running
# If not, run: npx react-native run-android
```

### Step 2: Navigate to Business Dashboard
1. Open app
2. Go to **Profile** tab
3. Tap **"🏪 Business Dashboard"** button

### Step 3: Seed the Data
1. Scroll down to find **"🌱 Seed Sample Data"** button
2. Tap the button
3. Confirm the dialog
4. Wait for success message

### Step 4: Verify in Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to your project
3. Click **Firestore Database**
4. You should now see:
   - ✅ `businesses` collection (3 documents)
   - ✅ `businessMarkers` collection (3 documents)

---

## 📊 Sample Data Created

### Businesses:
1. **Ati-Atihan Restaurant**
   - Category: restaurant
   - Location: 11.6894, 122.3670
   - Rating: 4.6 ⭐
   - Price: $$

2. **Pansi Restaurant**
   - Category: restaurant
   - Location: 11.6900, 122.3675
   - Rating: 4.3 ⭐
   - Price: $

3. **Boracay Breeze Café**
   - Category: cafe
   - Location: 11.6885, 122.3680
   - Rating: 4.7 ⭐
   - Price: $$

### Markers:
Each business gets a corresponding marker with:
- Exact GPS coordinates
- Custom address
- Server timestamps

---

## 🔍 What Happens

### The Seed Function:
```typescript
// Located at: src/utils/seedFirestore.ts
export const seedFirestoreData = async () => {
  // Creates 3 businesses
  for (const business of businesses) {
    await firestore()
      .collection('businesses')
      .doc(business.id)
      .set(business);
  }
  
  // Creates 3 markers
  for (const marker of markers) {
    await firestore()
      .collection('businessMarkers')
      .doc(marker.businessId)
      .set(marker);
  }
};
```

---

## ✨ After Seeding

### You Can Now:
1. **View in Firebase Console**
   - See both collections
   - Inspect document data
   - Verify timestamps

2. **Test in App**
   - Restaurant detail pages will load markers
   - "Owner-verified location" badges will show
   - Maps will display custom marker locations

3. **Query the Data**
   - Use `firestoreBusinessService.getAllBusinesses()`
   - Use `firestoreBusinessService.getAllMarkers()`
   - Test search and filters

---

## 🧪 Testing After Seed

### Test 1: View Businesses
```typescript
import { firestoreBusinessService } from './services/firestoreBusinessService';

const businesses = await firestoreBusinessService.getAllBusinesses();
console.log('Businesses:', businesses.length); // Should be 3
```

### Test 2: View Markers
```typescript
const markers = await firestoreBusinessService.getAllMarkers();
console.log('Markers:', markers.length); // Should be 3
```

### Test 3: Get Specific Marker
```typescript
const marker = await firestoreBusinessService.getBusinessMarker('1');
console.log('Marker:', marker); // Ati-Atihan Restaurant marker
```

---

## 🎯 Expected Results

### Firebase Console:
```
Firestore Database
├── businesses (3 documents)
│   ├── 1 (Ati-Atihan Restaurant)
│   ├── 2 (Pansi Restaurant)
│   └── 3 (Boracay Breeze Café)
└── businessMarkers (3 documents)
    ├── 1 (11.6894, 122.3670)
    ├── 2 (11.6900, 122.3675)
    └── 3 (11.6885, 122.3680)
```

### App Behavior:
- ✅ Restaurant detail pages show custom markers
- ✅ "Owner-verified location" badges appear
- ✅ Maps use marker coordinates
- ✅ Search returns Firestore data

---

## 🔄 Re-seeding

If you need to seed again:
1. Delete collections in Firebase Console
2. Tap "Seed Sample Data" button again
3. New data will be created

---

## 🐛 Troubleshooting

### Issue: Button doesn't appear
**Solution**: Make sure you're on the Business Owner Dashboard screen

### Issue: "Permission denied" error
**Solution**: Deploy Firestore security rules:
```bash
firebase deploy --only firestore:rules
```

### Issue: Data not appearing in Firebase
**Solution**: 
1. Check internet connection
2. Verify Firebase project is configured
3. Check console for errors

### Issue: "Firestore is not initialized"
**Solution**: Ensure `google-services.json` is in `android/app/`

---

## 📝 Files Created

1. **`src/utils/seedFirestore.ts`**
   - Seed function implementation
   - Sample data definitions
   - Firestore write operations

2. **`src/screens/owner/BusinessOwnerDashboard.tsx`**
   - Added seed button
   - Added handler function
   - Added success/error alerts

---

## ✅ Summary

**Problem**: `businessMarkers` collection doesn't exist  
**Reason**: No documents have been created yet  
**Solution**: Use "Seed Sample Data" button  
**Result**: Both collections created with sample data  

**Ready to test!** 🚀

---

**Last Updated**: October 19, 2025
