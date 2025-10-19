// Restaurant List Component for Map View

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Business } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { formatDistance, formatRating, formatReviewCount } from '../../utils';

interface RestaurantListProps {
  restaurants: Business[];
  onRestaurantSelect: (restaurant: Business) => void;
  userLocation?: { latitude: number; longitude: number };
  style?: any;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onRestaurantSelect,
  userLocation,
  style,
}) => {
  const renderRestaurantItem = ({ item }: { item: Business }) => {
    const distance = userLocation 
      ? formatDistance(
          calculateDistance(
            userLocation,
            { latitude: item.location.latitude, longitude: item.location.longitude }
          )
        )
      : null;

    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() => onRestaurantSelect(item)}
      >
        <View style={styles.imageContainer}>
          {item.images && item.images.length > 0 ? (
            <Image
              source={{ uri: item.images[0] }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Ionicons name="restaurant" size={32} color={COLORS.text.secondary} />
            </View>
          )}
        </View>

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.name}
          </Text>
          
          <Text style={styles.restaurantCategory} numberOfLines={1}>
            {item.category.replace('_', ' ').toUpperCase()}
          </Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.ratingText}>
              {formatRating(item.rating)} ({formatReviewCount(item.reviewCount)})
            </Text>
          </View>

          {distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={14} color={COLORS.text.secondary} />
              <Text style={styles.distanceText}>{distance}</Text>
            </View>
          )}

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{item.priceRange}</Text>
            {item.isOpen && (
              <View style={styles.openIndicator}>
                <Text style={styles.openText}>Open</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  if (restaurants.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Ionicons name="restaurant-outline" size={48} color={COLORS.text.secondary} />
        <Text style={styles.emptyTitle}>No restaurants found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search or location
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </Text>
      </View>
      
      <FlatList
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

// Helper function to calculate distance
const calculateDistance = (
  location1: { latitude: number; longitude: number },
  location2: { latitude: number; longitude: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(location2.latitude - location1.latitude);
  const dLon = toRadians(location2.longitude - location1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(location1.latitude)) *
      Math.cos(toRadians(location2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  restaurantCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  restaurantCategory: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  openIndicator: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  openText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.surface,
    fontWeight: '600',
  },
  arrowContainer: {
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
