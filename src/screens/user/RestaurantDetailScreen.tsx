// Enhanced Restaurant Detail Screen with Photos, Reviews, and Menu

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { Business, Review } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { addFavorite, removeFavorite } from '../../store/slices/favoritesSlice';

const { width } = Dimensions.get('window');

type RouteParams = {
  RestaurantDetail: {
    businessId: string;
  };
};

export const RestaurantDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'RestaurantDetail'>>();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  
  const { businessId } = route.params;
  const { businesses } = useSelector((state: RootState) => state.business);
  const { favorites } = useSelector((state: RootState) => state.favorites);
  
  const [restaurant, setRestaurant] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'reviews'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const found = businesses.find((b) => b.id === businessId);
    if (found) {
      setRestaurant(found);
    }
  }, [businessId, businesses]);

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Restaurant not found</Text>
      </View>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === restaurant.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(restaurant.id));
    } else {
      dispatch(addFavorite(restaurant));
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${restaurant.phoneNumber}`);
  };

  const handleWebsite = () => {
    if (restaurant.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const handleDirections = () => {
    const { latitude, longitude } = restaurant.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageGallery}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / width
            );
            setSelectedImageIndex(index);
          }}
        >
          {restaurant.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        <View style={styles.imagePagination}>
          {restaurant.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === selectedImageIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoSection}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        
        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(restaurant.rating))}
          </View>
          <Text style={styles.ratingText}>
            {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{restaurant.category}</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.metaText}>{restaurant.priceRange}</Text>
          {restaurant.isVerified && (
            <>
              <Text style={styles.metaDivider}>•</Text>
              <Text style={styles.verifiedBadge}>✓ Verified</Text>
            </>
          )}
        </View>

        <Text style={styles.description}>{restaurant.description}</Text>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>📞</Text>
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDirections}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🗺️</Text>
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>

          {restaurant.website && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWebsite}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonIcon}>🌐</Text>
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'overview' && styles.tabTextActive,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'menu' && styles.tabActive]}
          onPress={() => setActiveTab('menu')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'menu' && styles.tabTextActive,
            ]}
          >
            Menu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'reviews' && styles.tabActive]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'reviews' && styles.tabTextActive,
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        {activeTab === 'overview' && (
          <View>
            {/* Hours */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hours</Text>
              {Object.entries(restaurant.hours).map(([day, hours]) => (
                <View key={day} style={styles.hoursRow}>
                  <Text style={styles.dayText}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Text>
                  <Text style={styles.hoursText}>
                    {hours.isOpen
                      ? `${hours.openTime} - ${hours.closeTime}`
                      : 'Closed'}
                  </Text>
                </View>
              ))}
            </View>

            {/* Amenities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {restaurant.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <Text style={styles.addressText}>
                {restaurant.location.address}
              </Text>
              <Text style={styles.addressText}>
                {restaurant.location.city}, {restaurant.location.state}{' '}
                {restaurant.location.postalCode}
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'menu' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <Text style={styles.comingSoonText}>
              Menu items will be displayed here
            </Text>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.comingSoonText}>
              Customer reviews will be displayed here
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xxxl,
  },
  imageGallery: {
    height: 300,
    position: 'relative',
  },
  restaurantImage: {
    width: width,
    height: 300,
  },
  imagePagination: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    backgroundColor: COLORS.surface,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  infoSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  restaurantName: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  star: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metaText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  metaDivider: {
    marginHorizontal: SPACING.sm,
    color: COLORS.text.secondary,
  },
  verifiedBadge: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: COLORS.surface,
  },
  section: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  dayText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  amenityChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  addressText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
