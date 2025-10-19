// Restaurant Detail Screen with Google Maps

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, TYPOGRAPHY, SPACING, AMENITIES } from '../../constants';
import { mockBusinessService } from '../../services/mockBusinessService';
import { firestoreBusinessService } from '../../services/firestoreBusinessService';
import { Business } from '../../types';

const { width, height } = Dimensions.get('window');

export const RestaurantDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurantId } = route.params as { restaurantId: string };
  
  const [restaurant, setRestaurant] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [markerLocation, setMarkerLocation] = useState<{latitude: number; longitude: number} | null>(null);

  useEffect(() => {
    loadRestaurant();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      setIsLoading(true);
      const data = await mockBusinessService.getBusinessById(restaurantId);
      setRestaurant(data);
      
      // Try to load custom marker from Firestore (optional - fails gracefully if Firestore not configured)
      try {
        const marker = await firestoreBusinessService.getBusinessMarker(restaurantId);
        if (marker) {
          setMarkerLocation({
            latitude: marker.latitude,
            longitude: marker.longitude,
          });
        }
      } catch (markerError) {
        // Firestore not configured or marker doesn't exist - use business location
        console.log('No custom marker found, using business location');
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = () => {
    if (restaurant.phoneNumber) {
      Linking.openURL(`tel:${restaurant.phoneNumber}`);
    }
  };

  const handleWebsite = () => {
    if (restaurant.website) {
      Linking.openURL(restaurant.website);
    }
  };

  const handleDirections = () => {
    const { latitude, longitude } = restaurant.location;
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = restaurant.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const getDayName = (): 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' => {
    const days: ('sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday')[] = 
      ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const todayHours = restaurant.hours?.[getDayName()];
  const isOpenNow = todayHours?.isOpen || false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {restaurant.name}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <Image
            source={{
              uri: restaurant.images?.[selectedImageIndex] || 'https://via.placeholder.com/400x300',
            }}
            style={styles.mainImage}
          />
          {restaurant.images && restaurant.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailScroll}
            >
              {restaurant.images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                >
                  <Image
                    source={{ uri: img }}
                    style={[
                      styles.thumbnail,
                      selectedImageIndex === index && styles.thumbnailActive,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>⭐ {restaurant.rating?.toFixed(1)}</Text>
              <Text style={styles.reviewText}>({restaurant.reviewCount} reviews)</Text>
            </View>
            <Text style={styles.priceText}>{restaurant.priceRange}</Text>
            <View style={[styles.statusBadge, isOpenNow ? styles.openBadge : styles.closedBadge]}>
              <Text style={styles.statusText}>{isOpenNow ? 'Open' : 'Closed'}</Text>
            </View>
          </View>

          <Text style={styles.description}>{restaurant.description}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionIcon}>📞</Text>
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDirections}>
            <Text style={styles.actionIcon}>🧭</Text>
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
            <Text style={styles.actionIcon}>🌐</Text>
            <Text style={styles.actionText}>Website</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowMap(!showMap)}
          >
            <Text style={styles.actionIcon}>🗺️</Text>
            <Text style={styles.actionText}>{showMap ? 'Hide' : 'Show'} Map</Text>
          </TouchableOpacity>
        </View>

        {/* Google Maps Toggle */}
        {showMap && (
          <View style={styles.mapSection}>
            <Text style={styles.sectionTitle}>📍 Location</Text>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: markerLocation?.latitude || restaurant.location.latitude,
                longitude: markerLocation?.longitude || restaurant.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: markerLocation?.latitude || restaurant.location.latitude,
                  longitude: markerLocation?.longitude || restaurant.location.longitude,
                }}
                title={restaurant.name}
                description={markerLocation ? '📍 Owner-placed marker' : restaurant.location.address}
                pinColor={COLORS.primary}
              />
            </MapView>
            {markerLocation && (
              <View style={styles.markerBadge}>
                <Text style={styles.markerBadgeText}>✓ Owner-verified location</Text>
              </View>
            )}
            <View style={styles.addressBox}>
              <Text style={styles.addressText}>📍 {restaurant.location.address}</Text>
            </View>
          </View>
        )}

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>Phone:</Text>
            <Text style={styles.contactValue}>{restaurant.phoneNumber}</Text>
          </View>
          {restaurant.email && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>{restaurant.email}</Text>
            </View>
          )}
          {restaurant.website && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Website:</Text>
              <Text style={styles.contactValue}>{restaurant.website}</Text>
            </View>
          )}
        </View>

        {/* Opening Hours */}
        {restaurant.hours && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕐 Opening Hours</Text>
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
        )}

        {/* Amenities */}
        {restaurant.amenities && restaurant.amenities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {restaurant.amenities.map((amenity) => {
                const amenityInfo = AMENITIES.find((a) => a.value === amenity);
                return (
                  <View key={amenity} style={styles.amenityChip}>
                    <Text style={styles.amenityIcon}>{amenityInfo?.icon || '•'}</Text>
                    <Text style={styles.amenityText}>{amenityInfo?.label || amenity}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackText: {
    fontSize: 28,
    color: COLORS.text.onPrimary,
  },
  headerTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageGallery: {
    backgroundColor: COLORS.surface,
  },
  mainImage: {
    width: width,
    height: 250,
    backgroundColor: COLORS.surfaceVariant,
  },
  thumbnailScroll: {
    padding: SPACING.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: COLORS.primary,
  },
  infoSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  restaurantName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  verifiedBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  verifiedText: {
    color: COLORS.text.onSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  reviewText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: COLORS.success,
  },
  closedBadge: {
    backgroundColor: COLORS.error,
  },
  statusText: {
    color: COLORS.text.onPrimary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  actionButton: {
    alignItems: 'center',
    minWidth: 70,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  mapSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginTop: SPACING.md,
  },
  addressBox: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 8,
  },
  addressText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  section: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  contactLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.secondary,
    width: 80,
  },
  contactValue: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  dayText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '500',
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  amenityText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  footer: {
    height: SPACING.xl,
  },
  markerBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  markerBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: 'bold',
    color: COLORS.text.onSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.text.onPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
});
