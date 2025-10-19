// Modern Food Explorer Home Screen - Fixed Version

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BUSINESS_CATEGORIES } from '../../constants';
import { mockBusinessService } from '../../services/mockBusinessService';
import { Business } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    try {
      setIsLoading(true);
      const response = await mockBusinessService.searchBusinesses({
        location: {
          latitude: 11.6894,
          longitude: 122.3670,
          address: 'Kalibo, Aklan, Philippines',
          city: 'Kalibo',
          state: 'Aklan',
          country: 'Philippines',
        },
        filters: {},
        sortBy: 'rating',
        page: 1,
        limit: 50,
      });
      setBusinesses(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get featured restaurants (high ratings >= 4.5)
  const featuredRestaurants = businesses
    .filter((b) => b.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Get popular restaurants (most reviews)
  const popularRestaurants = businesses
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 10);

  const handleSearchPress = () => {
    // @ts-ignore
    navigation.navigate('EnhancedSearch');
  };

  const handleRestaurantPress = (restaurant: Business) => {
    // @ts-ignore
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const handleCategoryPress = (category: string) => {
    // @ts-ignore
    navigation.navigate('EnhancedSearch', { category });
  };

  const renderFeaturedCard = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/300x200' }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.featuredMeta}>
          <Text style={styles.featuredRating}>
            ⭐ {item.rating?.toFixed(1)}
          </Text>
          <Text style={styles.featuredDot}>•</Text>
          <Text style={styles.featuredCategory} numberOfLines={1}>
            {BUSINESS_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
          </Text>
          <Text style={styles.featuredDot}>•</Text>
          <Text style={styles.featuredPrice}>{item.priceRange || '$$'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPopularCard = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.popularCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/100' }}
        style={styles.popularImage}
        resizeMode="cover"
      />
      <View style={styles.popularInfo}>
        <Text style={styles.popularName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.popularCategory} numberOfLines={1}>
          {BUSINESS_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
        </Text>
        <View style={styles.popularMeta}>
          <Text style={styles.popularRating}>⭐ {item.rating?.toFixed(1)}</Text>
          <Text style={styles.popularReviews}>({item.reviewCount} reviews)</Text>
        </View>
      </View>
      <View style={styles.popularArrow}>
        <Text style={styles.popularArrowText}>→</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: typeof BUSINESS_CATEGORIES[0], index: number) => (
    <TouchableOpacity
      key={category.value}
      style={styles.categoryChip}
      onPress={() => handleCategoryPress(category.value)}
      activeOpacity={0.7}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text style={styles.categoryLabel} numberOfLines={1}>{category.label}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.subtitle}>Discover amazing food near you</Text>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search restaurants, cuisines...</Text>
          <View style={styles.filterIcon}>
            <Text style={styles.filterIconText}>🎛️</Text>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {BUSINESS_CATEGORIES.slice(0, 8).map((cat, index) => renderCategoryChip(cat, index))}
          </ScrollView>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⭐ Featured</Text>
            <TouchableOpacity onPress={handleSearchPress}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>
          {featuredRestaurants.length > 0 ? (
            <FlatList
              horizontal
              data={featuredRestaurants}
              renderItem={renderFeaturedCard}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
              snapToInterval={CARD_WIDTH + SPACING.md}
              decelerationRate="fast"
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No featured restaurants yet</Text>
            </View>
          )}
        </View>

        {/* Popular Restaurants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Popular</Text>
            <TouchableOpacity onPress={handleSearchPress}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>
          {popularRestaurants.length > 0 ? (
            <View style={styles.popularList}>
              {popularRestaurants.slice(0, 5).map((item) => (
                <View key={item.id}>{renderPopularCard({ item })}</View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No restaurants available</Text>
            </View>
          )}
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Explore Kalibo</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{businesses.length}</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{featuredRestaurants.length}</Text>
              <Text style={styles.statLabel}>Featured</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(businesses.map(r => r.category)).size}
              </Text>
              <Text style={styles.statLabel}>Categories</Text>
            </View>
          </View>
        </View>

        {/* Footer Spacing */}
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    width: '100%',
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.onPrimary,
    opacity: 0.9,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: -24,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.hint,
  },
  filterIcon: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconText: {
    fontSize: 18,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  seeAllText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
    paddingRight: SPACING.lg,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  featuredList: {
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
  },
  featuredCard: {
    width: CARD_WIDTH,
    marginRight: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.surfaceVariant,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: COLORS.text.onSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  featuredInfo: {
    padding: SPACING.md,
  },
  featuredName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  featuredRating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  featuredDot: {
    marginHorizontal: SPACING.xs,
    color: COLORS.text.disabled,
  },
  featuredCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    flex: 1,
  },
  featuredPrice: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  popularList: {
    paddingHorizontal: SPACING.lg,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  popularImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  popularInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },
  popularName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  popularCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  popularMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularRating: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  popularReviews: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  popularArrow: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularArrowText: {
    fontSize: 16,
    color: COLORS.text.onAccent,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  footer: {
    height: SPACING.xl,
  },
});
