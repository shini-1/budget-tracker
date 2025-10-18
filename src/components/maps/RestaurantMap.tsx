// Restaurant Map Component with Google Maps Integration

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../../hooks/useLocation';
import { Business, Location } from '../../types';
import { COLORS, MAPS_CONFIG } from '../../constants';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface RestaurantMapProps {
  restaurants: Business[];
  onRestaurantSelect?: (restaurant: Business) => void;
  initialLocation?: Location;
  showUserLocation?: boolean;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  onRestaurantSelect,
  initialLocation,
  showUserLocation = true,
  style,
}) => {
  const mapRef = useRef<MapView>(null);
  const { location, isLoading: locationLoading, error: locationError } = useLocation();
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || MAPS_CONFIG.DEFAULT_CENTER.latitude,
    longitude: initialLocation?.longitude || MAPS_CONFIG.DEFAULT_CENTER.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    if (location && !initialLocation) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [location, initialLocation]);

  useEffect(() => {
    if (locationError) {
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location permissions.',
        [{ text: 'OK' }]
      );
    }
  }, [locationError]);

  const handleMarkerPress = (restaurant: Business) => {
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant);
    }
  };

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const getMarkerColor = (restaurant: Business): string => {
    if (restaurant.rating >= 4.5) return COLORS.success;
    if (restaurant.rating >= 4.0) return COLORS.warning;
    if (restaurant.rating >= 3.0) return COLORS.info;
    return COLORS.text.secondary;
  };

  const getMarkerIcon = (restaurant: Business): string => {
    switch (restaurant.category) {
      case 'restaurant':
        return '🍽️';
      case 'cafe':
        return '☕';
      case 'fast_food':
        return '🍔';
      case 'fine_dining':
        return '🍷';
      case 'bar':
        return '🍺';
      case 'food_truck':
        return '🚚';
      case 'bakery':
        return '🥖';
      case 'pizzeria':
        return '🍕';
      case 'sushi':
        return '🍣';
      case 'mexican':
        return '🌮';
      case 'italian':
        return '🍝';
      case 'chinese':
        return '🥢';
      case 'indian':
        return '🍛';
      case 'thai':
        return '🌶️';
      default:
        return '🍴';
    }
  };

  if (locationLoading) {
    return (
      <View style={[styles.container, style]}>
        <LoadingSpinner text="Loading map..." />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showUserLocation}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        mapType="standard"
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        followsUserLocation={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
        loadingBackgroundColor={COLORS.background}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude,
            }}
            title={restaurant.name}
            description={`${restaurant.category} • ⭐ ${restaurant.rating.toFixed(1)} (${restaurant.reviewCount} reviews)`}
            pinColor={getMarkerColor(restaurant)}
            onPress={() => handleMarkerPress(restaurant)}
            tracksViewChanges={false}
          >
            <View style={styles.customMarker}>
              <View style={[styles.markerIcon, { backgroundColor: getMarkerColor(restaurant) }]}>
                <Text style={styles.markerEmoji}>{getMarkerIcon(restaurant)}</Text>
              </View>
              <View style={[styles.markerTail, { borderTopColor: getMarkerColor(restaurant) }]} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  customMarker: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 20,
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
