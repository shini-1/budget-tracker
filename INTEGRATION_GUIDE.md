# Integration Guide - Enhanced User Interface

## Overview
This guide explains how to integrate the newly created enhanced UI components into the existing navigation structure.

## Navigation Setup Required

### 1. Update Navigation Types

Add the new routes to your navigation types in `src/types/index.ts`:

```typescript
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
  Comparison: undefined; // NEW
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  RestaurantDetail: { businessId: string }; // NEW
  Settings: undefined; // NEW
  BusinessDetail: { businessId: string };
  UserProfile: undefined;
  BusinessProfile: undefined;
  AdminDashboard: undefined;
};
```

### 2. Update Main Tab Navigator

In your main tab navigator file (e.g., `src/navigation/MainTabNavigator.tsx`):

```typescript
import { HomeScreen } from '../screens/user/HomeScreen';
import { EnhancedFavoritesScreen } from '../screens/user/EnhancedFavoritesScreen';
import { ComparisonScreen } from '../screens/user/ComparisonScreen';
import { SettingsScreen } from '../screens/user/SettingsScreen';

// In your Tab.Navigator:
<Tab.Screen 
  name="Home" 
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color }) => <Text>🏠</Text>,
    tabBarLabel: 'Home',
  }}
/>

<Tab.Screen 
  name="Favorites" 
  component={EnhancedFavoritesScreen}
  options={{
    tabBarIcon: ({ color }) => <Text>❤️</Text>,
    tabBarLabel: 'Favorites',
  }}
/>

<Tab.Screen 
  name="Comparison" 
  component={ComparisonScreen}
  options={{
    tabBarIcon: ({ color }) => <Text>⚖️</Text>,
    tabBarLabel: 'Compare',
  }}
/>

<Tab.Screen 
  name="Settings" 
  component={SettingsScreen}
  options={{
    tabBarIcon: ({ color }) => <Text>⚙️</Text>,
    tabBarLabel: 'Settings',
  }}
/>
```

### 3. Update Stack Navigator

In your stack navigator file (e.g., `src/navigation/RootNavigator.tsx`):

```typescript
import { RestaurantDetailScreen } from '../screens/user/RestaurantDetailScreen';

// In your Stack.Navigator:
<Stack.Screen 
  name="RestaurantDetail" 
  component={RestaurantDetailScreen}
  options={{
    title: 'Restaurant Details',
    headerShown: true,
  }}
/>
```

## Component Usage Examples

### 1. Using Category Filter

The CategoryFilter is already integrated in HomeScreen. To use it elsewhere:

```typescript
import { CategoryFilter } from '../components/filters/CategoryFilter';
import { BusinessCategory } from '../types';

const [selectedCategories, setSelectedCategories] = useState<BusinessCategory[]>([]);

const handleCategoryToggle = (category: BusinessCategory) => {
  if (selectedCategories.includes(category)) {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  } else {
    setSelectedCategories([...selectedCategories, category]);
  }
};

<CategoryFilter
  selectedCategories={selectedCategories}
  onCategoryToggle={handleCategoryToggle}
/>
```

### 2. Using Advanced Filters

```typescript
import { AdvancedFilters } from '../components/filters/AdvancedFilters';
import { PriceRange } from '../types';

const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
const [minRating, setMinRating] = useState(0);
const [maxDistance, setMaxDistance] = useState(25);

<AdvancedFilters
  selectedPriceRanges={selectedPriceRanges}
  minRating={minRating}
  maxDistance={maxDistance}
  onPriceRangeToggle={(price) => {
    if (selectedPriceRanges.includes(price)) {
      setSelectedPriceRanges(selectedPriceRanges.filter((p) => p !== price));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, price]);
    }
  }}
  onRatingChange={setMinRating}
  onDistanceChange={setMaxDistance}
  onReset={() => {
    setSelectedPriceRanges([]);
    setMinRating(0);
    setMaxDistance(25);
  }}
/>
```

### 3. Navigating to Restaurant Detail

From any component:

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to restaurant detail
navigation.navigate('RestaurantDetail', { businessId: 'restaurant-id-123' });
```

### 4. Managing Favorites

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import { RootState } from '../store';

const dispatch = useDispatch();
const { favorites } = useSelector((state: RootState) => state.favorites);

// Check if restaurant is favorite
const isFavorite = favorites.some((fav) => fav.id === restaurant.id);

// Toggle favorite
const handleToggleFavorite = () => {
  if (isFavorite) {
    dispatch(removeFavorite(restaurant.id));
  } else {
    dispatch(addFavorite(restaurant));
  }
};
```

## Redux Store Integration

The favorites slice is already integrated in `src/store/index.ts`. Make sure your Redux Provider wraps your app:

```typescript
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      {/* Your app components */}
    </Provider>
  );
}
```

## Styling Customization

All components use the centralized constants from `src/constants/index.ts`. To customize:

1. **Colors:** Modify `COLORS` object in constants
2. **Typography:** Modify `TYPOGRAPHY` object
3. **Spacing:** Modify `SPACING` object

Example:
```typescript
// In src/constants/index.ts
export const COLORS = {
  primary: '#FF6B35', // Change this to your brand color
  // ... other colors
};
```

## Testing the Integration

### 1. Test Category Filters
- Open HomeScreen
- Tap on different category chips
- Verify restaurants filter correctly
- Check map markers update

### 2. Test Restaurant Details
- Tap on a restaurant from map or list
- Verify all tabs work (Overview, Menu, Reviews)
- Test action buttons (Call, Directions, Website)
- Test favorite button

### 3. Test Favorites
- Add restaurants to favorites
- Navigate to Favorites screen
- Test sorting options
- Remove favorites
- Verify empty state

### 4. Test Comparison
- Navigate to Comparison screen
- Select 2-3 restaurants
- Tap Compare button
- Verify comparison table displays correctly
- Test reset functionality

### 5. Test Settings
- Navigate to Settings screen
- Toggle various switches
- Test logout confirmation
- Verify user info displays

## Common Issues & Solutions

### Issue: Navigation not working
**Solution:** Ensure navigation types are properly defined and screens are registered in navigators.

### Issue: Favorites not persisting
**Solution:** Implement Redux persistence using `redux-persist` or AsyncStorage.

### Issue: Images not loading
**Solution:** Ensure image URLs are valid. For development, use placeholder images.

### Issue: TypeScript errors
**Solution:** Run `npm run tsc` to check for type errors. Ensure all imports are correct.

## Next Steps

1. **Add Persistence:** Implement AsyncStorage for favorites
2. **Connect Backend:** Replace mock data with real API calls
3. **Add Animations:** Use React Native Reanimated for smooth transitions
4. **Implement Reviews:** Add review submission and display functionality
5. **Add Menu Items:** Implement menu display in restaurant details
6. **Enable Dark Mode:** Implement theme switching functionality

## Support

For questions or issues:
- Check `ENHANCED_UI_SUMMARY.md` for feature details
- Review component source code for implementation details
- Refer to React Navigation docs for navigation issues

---

**Last Updated:** October 18, 2025  
**Developer:** Code Blooded
