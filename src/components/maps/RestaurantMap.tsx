// Restaurant Map Component with Google Maps Integration

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
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
  // Remove useLocation hook - use provided initialLocation instead
  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || MAPS_CONFIG.DEFAULT_CENTER.latitude,
    longitude: initialLocation?.longitude || MAPS_CONFIG.DEFAULT_CENTER.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Update region when initialLocation changes
  useEffect(() => {
    if (initialLocation && mapReady) {
      const newRegion = {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      // Animate to location if map is ready
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  }, [initialLocation, mapReady]);

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

  const handleMapReady = () => {
    setMapReady(true);
    console.log('🗺️ Map is ready');
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Foodventurer needs access to your location to show nearby restaurants',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const centerOnUserLocation = async () => {
    setLoadingLocation(true);
    
    try {
      const hasPermission = await requestLocationPermission();
      
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location. Please enable it in settings.'
        );
        setLoadingLocation(false);
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newUserLocation: Location = {
            latitude,
            longitude,
          };
          
          setUserLocation(newUserLocation);
          
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          
          setRegion(newRegion);
          
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
          
          setLoadingLocation(false);
          console.log('📍 Centered on user location:', latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          Alert.alert(
            'Location Error',
            'Unable to get your current location. Please make sure location services are enabled.'
          );
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } catch (error) {
      console.error('Error getting location:', error);
      setLoadingLocation(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showUserLocation && (
        <TouchableOpacity
          style={styles.locationButton}
          onPress={centerOnUserLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.locationButtonText}>
            {loadingLocation ? '⏳' : '📍'}
          </Text>
        </TouchableOpacity>
      )}
      
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        onMapReady={handleMapReady}
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
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  locationButtonText: {
    fontSize: 28,
  },
});
