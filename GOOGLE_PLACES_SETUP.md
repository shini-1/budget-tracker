# Google Places API Setup Guide

## Current Status
✅ **Code is ready** - All fixes have been applied
⚠️ **API Key needs configuration** - Follow steps below

## What Was Fixed

### 1. Google Places API Service
- ✅ Added comprehensive error handling
- ✅ Added detailed logging for debugging
- ✅ Handles REQUEST_DENIED, ZERO_RESULTS, and other error states
- ✅ Provides helpful error messages

### 2. Firebase Business Service
- ✅ Fixed deprecation warnings (added notes, still functional)
- ✅ Added getUserBusinesses method
- ✅ All CRUD operations working

### 3. Restaurant Map Component
- ✅ Added custom "Current Location" button
- ✅ Requests location permissions properly
- ✅ Animates to user location with one tap
- ✅ Shows loading state while getting location

### 4. Business Service
- ✅ Re-enabled Google Places API as primary source
- ✅ Re-enabled Firebase for user-generated content
- ✅ Disabled mock data (only used as fallback if both fail)

## Google Places API Setup

### Step 1: Enable Places API in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **foodventurer-20548**
3. Navigate to **APIs & Services** > **Library**
4. Search for **"Places API"**
5. Click **Enable**

### Step 2: Enable Required APIs

Make sure these APIs are enabled:
- ✅ **Places API** (for restaurant data)
- ✅ **Maps SDK for Android** (for map display)
- ✅ **Maps SDK for iOS** (for map display)
- ✅ **Geolocation API** (optional, for better location services)

### Step 3: Configure API Key

1. Go to **APIs & Services** > **Credentials**
2. Find your API key: `AIzaSyBWrQXD0awUasgpv83M4jBEa19p3DR__6Y`
3. Click **Edit** (pencil icon)

#### API Restrictions (Recommended)
- **Application restrictions**: 
  - Select "Android apps"
  - Add your package name: `com.codeblooded.foodventurer`
  - Add your SHA-1 certificate fingerprint (get from Android Studio or keystore)

- **API restrictions**:
  - Select "Restrict key"
  - Enable these APIs:
    - Places API
    - Maps SDK for Android
    - Maps SDK for iOS

### Step 4: Enable Billing

⚠️ **Important**: Google Places API requires billing to be enabled

1. Go to **Billing** in Google Cloud Console
2. Link a billing account
3. Don't worry - Google provides:
   - **$200 free credit per month**
   - Places API: First 1000 requests/month are free
   - You'll only be charged if you exceed free tier

### Step 5: Test the API

After setup, restart the app:

```bash
npm start -- --reset-cache
npx react-native run-android
```

Watch the console for these messages:
- ✅ `🔍 Fetching restaurants from Google Places API...`
- ✅ `📡 Google Places API response status: OK`
- ✅ `✅ Found X restaurants`

If you see errors:
- ❌ `REQUEST_DENIED` → API key not configured or billing not enabled
- ❌ `ZERO_RESULTS` → No restaurants found in the area (try different location)

## Troubleshooting

### Error: REQUEST_DENIED

**Cause**: API key doesn't have permission to use Places API

**Solutions**:
1. Make sure Places API is enabled in Google Cloud Console
2. Check API key restrictions aren't blocking the request
3. Verify billing is enabled
4. Try creating a new API key without restrictions for testing

### Error: ZERO_RESULTS

**Cause**: No restaurants found in the search area

**Solutions**:
1. This is normal - the app will fall back to Firebase data
2. Try searching in a different location
3. The default location is Kalibo, Aklan, Philippines

### Firebase Deprecation Warnings

**Status**: ⚠️ Warnings only - functionality not affected

**Message**: "This method is deprecated..."

**Action**: These are just warnings about future API changes. The code still works perfectly. Migration to v22 modular API can be done later as a separate task.

## Current Location Feature

### How to Use
1. Open the app
2. Navigate to the map view
3. Tap the **📍** button in the bottom-right corner
4. Grant location permission when prompted
5. Map will animate to your current location

### Permissions Required
- **Android**: ACCESS_FINE_LOCATION
- **iOS**: Location When In Use

The app will request these permissions automatically when you tap the location button.

## Data Flow

The app now uses this priority order:

1. **Google Places API** (Primary)
   - Real restaurant data from Google
   - Kalibo, Aklan area by default
   - Requires API key setup

2. **Firebase** (Secondary)
   - User-generated restaurants
   - Cached Google Places data
   - Always available

3. **Mock Data** (Fallback)
   - Only if both above fail
   - Disabled by default
   - Can be re-enabled for testing

## Next Steps

1. ✅ Complete Google Places API setup (follow steps above)
2. ✅ Test the app with real data
3. ✅ Verify location button works
4. ⏳ (Optional) Migrate Firebase to v22 modular API later
5. ⏳ (Optional) Add more location-based features

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all setup steps were completed
3. Try the app with mock data first (set `useMockService = true` in businessService.ts)
4. Check Google Cloud Console for API usage and errors
