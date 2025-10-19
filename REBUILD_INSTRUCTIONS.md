# 🔧 Rebuild Instructions - Fix Geolocation Error

## Error: Geolocation package not linked

---

## ⚡ Quick Fix

The `@react-native-community/geolocation` package needs to be linked by rebuilding the app.

### Steps:

```bash
# 1. Stop Metro bundler (Ctrl+C)

# 2. Clean build
cd android && ./gradlew clean && cd ..

# 3. Rebuild and install
npx react-native run-android

# 4. Wait for app to install and open
```

---

## 🔍 What Was Changed

### Temporary Fixes Applied:

1. **AddBusinessMarker screen** - Commented out temporarily
2. **Navigation route** - Disabled until rebuild
3. **Dashboard button** - Shows rebuild message instead

### After Rebuild:

1. Uncomment `AddBusinessMarker` import in `MainNavigator.tsx`
2. Uncomment the screen route
3. Update `handleAddMarker` in `BusinessOwnerDashboard.tsx`

---

## 📝 Files Modified (Temporary)

### `src/navigation/MainNavigator.tsx`
```typescript
// Commented out:
// import { AddBusinessMarker } from '../screens/owner/AddBusinessMarker';

// And the route:
// <Stack.Screen name="AddBusinessMarker" component={AddBusinessMarker} />
```

### `src/screens/owner/BusinessOwnerDashboard.tsx`
```typescript
// Shows alert instead of navigating:
Alert.alert('Rebuild Required', '...');
```

---

## ✅ After Rebuild

Once the app rebuilds successfully:

1. **Uncomment in MainNavigator.tsx**:
```typescript
import { AddBusinessMarker } from '../screens/owner/AddBusinessMarker';

<Stack.Screen 
  name="AddBusinessMarker" 
  component={AddBusinessMarker}
  options={{ headerShown: false }}
/>
```

2. **Update in BusinessOwnerDashboard.tsx**:
```typescript
const handleAddMarker = () => {
  if (myBusiness) {
    navigation.navigate('AddBusinessMarker', { businessId: myBusiness.id });
  } else {
    Alert.alert('No Business', 'Please create a business first before adding a marker.');
  }
};
```

---

## 🎯 What Will Work After Rebuild

✅ Geolocation package linked  
✅ AddBusinessMarker screen accessible  
✅ GPS positioning working  
✅ Marker placement functional  
✅ All business owner features enabled  

---

## 🚀 Full Rebuild Command

```bash
# Complete rebuild process:
npx react-native start --reset-cache

# In another terminal:
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

---

## ⚠️ Current Status

**What Works Now**:
- ✅ Home screen
- ✅ Search and filters
- ✅ Restaurant details
- ✅ Business Owner Dashboard
- ✅ All navigation (except AddBusinessMarker)

**What Needs Rebuild**:
- ⏳ AddBusinessMarker screen
- ⏳ GPS positioning
- ⏳ Marker placement

---

## 📱 Testing After Rebuild

1. Open app
2. Go to Profile → Business Dashboard
3. Tap "Add/Update Location Marker"
4. Should open map screen (not alert)
5. Map should load with GPS location
6. Place marker and save

---

**Status**: Temporary fix applied, rebuild required for full functionality
