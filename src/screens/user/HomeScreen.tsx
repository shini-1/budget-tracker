// Production Home Screen - Final Version

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { fetchBusinesses } from '../../store/slices/businessSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { useLocation } from '../../hooks/useLocation';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { RestaurantMap } from '../../components/maps/RestaurantMap';

// Kalibo, Aklan coordinates
const KALIBO_LOCATION = {
  latitude: 11.6894,
  longitude: 122.3670,
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { businesses, isLoading, error } = useSelector((state: RootState) => state.business);
  const [useGPS, setUseGPS] = useState(false);

  // Enable GPS when toggle is on
  const { location: currentLocation, error: locationError } = useGPS
    ? useLocation(true)
    : { location: KALIBO_LOCATION, error: null };
  const [businessesLoaded, setBusinessesLoaded] = useState(false);

  useEffect(() => {
    if (!businessesLoaded) {
      dispatch(fetchBusinesses({ page: 1, limit: 20 }));
      setBusinessesLoaded(true);
    }
  }, [businessesLoaded, dispatch]);

  const handleRestaurantPress = (restaurant: any) => {
    Alert.alert(
      restaurant.name,
      `${restaurant.description}\n\n⭐ ${restaurant.rating} (${restaurant.reviewCount} reviews)\n📍 ${restaurant.location?.address || 'Kalibo, Aklan'}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'View Details', onPress: () => {
          console.log('Navigate to restaurant details:', restaurant.id);
        }}
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchBusinesses({ page: 1, limit: 20 }));
  };

  const displayLocation = currentLocation || KALIBO_LOCATION;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcome}>🍽️ Foodventurer</Text>
        <Text style={styles.location}>
          Discover restaurants in Kalibo, Aklan
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            🔄 Refresh
          </Text>
        </TouchableOpacity>

        {user?.role === 'business_owner' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.addButton]}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('AddRestaurant');
            }}
          >
            <Text style={styles.actionButtonText}>
              ➕ Add Restaurant
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Location Status */}
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>📍 Your Location</Text>
        <Text style={styles.statusText}>
          GPS: {useGPS ? 'Enabled' : 'Disabled (Mock)'}
        </Text>
        <Text style={styles.statusText}>
          {displayLocation.latitude.toFixed(4)}, {displayLocation.longitude.toFixed(4)}
        </Text>
        {locationError && (
          <Text style={styles.errorText}>{locationError}</Text>
        )}
        <Text style={styles.statusSubtext}>
          {useGPS ? 'Using real GPS location' : 'Using Kalibo mock location'}
        </Text>
      </View>

      {/* Restaurant Map */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>🗺️ Restaurant Map</Text>
        <Text style={styles.mapDescription}>
          {businesses.length} restaurants found near you
        </Text>

        <ErrorBoundary
          fallback={
            <View style={[styles.mapContainer, styles.mapFallback]}>
              <Text style={styles.mapFallbackText}>
                🗺️ Map temporarily unavailable{'\n'}
                An error occurred while loading the map{'\n'}
                Please try again later
              </Text>
            </View>
          }
        >
          <RestaurantMap
            restaurants={businesses}
            onRestaurantSelect={handleRestaurantPress}
            initialLocation={displayLocation}
            style={styles.mapContainer}
          />
        </ErrorBoundary>
      </View>

      {/* Restaurant Stats */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Restaurant Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{businesses.length}</Text>
            <Text style={styles.statLabel}>Total Restaurants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {businesses.filter(r => r.rating >= 4.5).length}
            </Text>
            <Text style={styles.statLabel}>Highly Rated</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {new Set(businesses.map(r => r.category)).size}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Enjoy discovering local cuisine! 🇵🇭
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  welcome: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  location: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  scrollContent: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    width: '100%',
  },
  actionButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: COLORS.success,
  },
  gpsActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  gpsInactive: {
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: COLORS.text.disabled,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.divider,
    width: '100%',
  },
  statusTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  statusSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  errorText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  mapSection: {
    marginBottom: SPACING.xl,
    width: '100%',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  mapDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  mapFallback: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapFallbackText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.divider,
    width: '100%',
  },
  statsTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.primary,
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
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
});
