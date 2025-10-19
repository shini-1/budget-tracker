// Enhanced Search Screen with Filters

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBusinesses } from '../../store/slices/businessSlice';
import { COLORS, TYPOGRAPHY, SPACING, BUSINESS_CATEGORIES, PRICE_RANGES } from '../../constants';

interface FilterState {
  category: string;
  priceRange: string;
  distance: number;
  isOpen: boolean;
}

export const EnhancedSearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { businesses, isLoading } = useSelector((state: RootState) => state.business);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    distance: 10,
    isOpen: false,
  });

  useEffect(() => {
    dispatch(fetchBusinesses({ page: 1, limit: 50 }));
  }, [dispatch]);

  const filteredBusinesses = businesses.filter((business) => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = filters.category === 'all' || business.category === filters.category;

    // Price range filter
    const matchesPrice = filters.priceRange === 'all' || business.priceRange === filters.priceRange;

    // Open now filter
    const matchesOpen = !filters.isOpen || business.isActive;

    return matchesSearch && matchesCategory && matchesPrice && matchesOpen;
  });

  const handleRestaurantPress = (restaurant: any) => {
    // @ts-ignore
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      distance: 10,
      isOpen: false,
    });
    setSearchQuery('');
  };

  const renderRestaurantCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/150' }}
        style={styles.restaurantImage}
      />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCategory} numberOfLines={1}>
          {BUSINESS_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
        </Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating?.toFixed(1) || 'N/A'}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount || 0})</Text>
          </View>
          <Text style={styles.priceRange}>{item.priceRange || '$$'}</Text>
        </View>
        {item.location?.address && (
          <Text style={styles.address} numberOfLines={1}>
            📍 {item.location.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor={COLORS.text.hint}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Toggle */}
      <View style={styles.filterHeader}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>
            🎛️ Filters {showFilters ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearFilters}>
          <Text style={styles.clearFiltersText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <ScrollView 
          style={styles.filtersPanel} 
          horizontal={false}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.category === 'all' && styles.filterChipActive,
                ]}
                onPress={() => setFilters({ ...filters, category: 'all' })}
              >
                <Text style={[
                  styles.filterChipText,
                  filters.category === 'all' && styles.filterChipTextActive,
                ]}>
                  All
                </Text>
              </TouchableOpacity>
              {BUSINESS_CATEGORIES.slice(0, 8).map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.filterChip,
                    filters.category === cat.value && styles.filterChipActive,
                  ]}
                  onPress={() => setFilters({ ...filters, category: cat.value })}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.category === cat.value && styles.filterChipTextActive,
                  ]}>
                    {cat.icon} {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  filters.priceRange === 'all' && styles.filterChipActive,
                ]}
                onPress={() => setFilters({ ...filters, priceRange: 'all' })}
              >
                <Text style={[
                  styles.filterChipText,
                  filters.priceRange === 'all' && styles.filterChipTextActive,
                ]}>
                  All
                </Text>
              </TouchableOpacity>
              {PRICE_RANGES.map((price) => (
                <TouchableOpacity
                  key={price.value}
                  style={[
                    styles.filterChip,
                    filters.priceRange === price.value && styles.filterChipActive,
                  ]}
                  onPress={() => setFilters({ ...filters, priceRange: price.value })}
                >
                  <Text style={[
                    styles.filterChipText,
                    filters.priceRange === price.value && styles.filterChipTextActive,
                  ]}>
                    {price.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Distance Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Distance: {filters.distance} km</Text>
            <View style={styles.distanceButtons}>
              {[5, 10, 15, 20].map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[
                    styles.distanceButton,
                    filters.distance === dist && styles.distanceButtonActive,
                  ]}
                  onPress={() => setFilters({ ...filters, distance: dist })}
                >
                  <Text style={[
                    styles.distanceButtonText,
                    filters.distance === dist && styles.distanceButtonTextActive,
                  ]}>
                    {dist} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Open Now Filter */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={styles.openNowToggle}
              onPress={() => setFilters({ ...filters, isOpen: !filters.isOpen })}
            >
              <View style={[
                styles.checkbox,
                filters.isOpen && styles.checkboxActive,
              ]}>
                {filters.isOpen && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.openNowText}>Open Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredBusinesses.length} restaurant{filteredBusinesses.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Restaurant List */}
      <FlatList
        data={filteredBusinesses}
        renderItem={renderRestaurantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>🔍</Text>
            <Text style={styles.emptyStateTitle}>No restaurants found</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try adjusting your filters or search query
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  clearIcon: {
    fontSize: 20,
    color: COLORS.text.secondary,
    padding: SPACING.xs,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  filterButtonText: {
    color: COLORS.text.onAccent,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  clearFiltersText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  filtersPanel: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    flexGrow: 0,
    flexShrink: 0,
  },
  filterSection: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  filterTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  filterChip: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  filterChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  filterChipTextActive: {
    color: COLORS.text.onSecondary,
    fontWeight: '600',
  },
  distanceButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  distanceButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  distanceButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  distanceButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  distanceButtonTextActive: {
    color: COLORS.text.onPrimary,
    fontWeight: '600',
  },
  openNowToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  checkmark: {
    color: COLORS.text.onSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  openNowText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  resultsHeader: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  resultsCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  restaurantCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.surfaceVariant,
  },
  restaurantInfo: {
    padding: SPACING.md,
  },
  restaurantName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  restaurantCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  reviewCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  priceRange: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  address: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
