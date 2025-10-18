// Home Screen Component with Map Integration

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBusinesses, searchBusinesses } from '../../store/slices/businessSlice';
import { RestaurantMap } from '../../components/maps/RestaurantMap';
import { MapSearchBar } from '../../components/maps/MapSearchBar';
import { MapControls } from '../../components/maps/MapControls';
import { RestaurantList } from '../../components/maps/RestaurantList';
import { CategoryFilter } from '../../components/filters/CategoryFilter';
import { Business, Location, BusinessCategory, PriceRange } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, MAPS_CONFIG } from '../../constants';
import { useLocation } from '../../hooks/useLocation';

const { height } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { location, isLoading: locationLoading } = useLocation();
  const { businesses, isLoading, error } = useSelector((state: RootState) => state.business);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Business | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [showList, setShowList] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<BusinessCategory[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load nearby restaurants when location is available
    if (location) {
      dispatch(fetchBusinesses({ page: 1, limit: 20 }));
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() && location) {
      dispatch(searchBusinesses({
        query: query.trim(),
        location,
        filters: {},
        sortBy: 'distance',
        page: 1,
        limit: 20,
      }));
    } else if (location) {
      dispatch(fetchBusinesses({ page: 1, limit: 20 }));
    }
  };

  const handleRestaurantSelect = (restaurant: Business) => {
    setSelectedRestaurant(restaurant);
    setShowList(false);
  };

  const handleCenterOnUser = () => {
    if (location) {
      // In a real app, you would animate the map to user location
      Alert.alert('Location', `Centering on: ${location.latitude}, ${location.longitude}`);
    }
  };

  const handleToggleMapType = () => {
    const types: ('standard' | 'satellite' | 'hybrid')[] = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryToggle = (category: BusinessCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Filter businesses based on selected categories
  const filteredBusinesses = selectedCategories.length > 0
    ? businesses.filter((b) => selectedCategories.includes(b.category))
    : businesses;

  const handleToggleList = () => {
    setShowList(!showList);
  };

  if (locationLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Map Search Bar */}
      <MapSearchBar
        onSearch={handleSearch}
        suggestions={businesses}
        onSuggestionSelect={handleRestaurantSelect}
        style={styles.searchBar}
      />

      {/* Map Controls */}
      <MapControls
        onCenterOnUser={handleCenterOnUser}
        onToggleMapType={handleToggleMapType}
        onShowFilters={handleShowFilters}
        userLocation={location || undefined}
        mapType={mapType}
        style={styles.mapControls}
      />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
        style={styles.categoryFilter}
      />

      {/* Restaurant Map */}
      <RestaurantMap
        restaurants={filteredBusinesses}
        onRestaurantSelect={handleRestaurantSelect}
        initialLocation={location || undefined}
        style={styles.map}
      />

      {/* Toggle List Button */}
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleButton} onPress={handleToggleList}>
          {showList ? 'Hide List' : `Show List (${filteredBusinesses.length})`}
        </Text>
      </View>

      {/* Restaurant List */}
      {showList && (
        <RestaurantList
          restaurants={filteredBusinesses}
          onRestaurantSelect={handleRestaurantSelect}
          userLocation={location || undefined}
          style={styles.restaurantList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xxxl,
  },
  searchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  categoryFilter: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  mapControls: {
    position: 'absolute',
    right: SPACING.md,
    top: 180,
    zIndex: 1000,
  },
  map: {
    flex: 1,
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 20,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 1000,
  },
  toggleButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
  restaurantList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    zIndex: 1000,
  },
});
