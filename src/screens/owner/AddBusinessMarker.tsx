// Add Business Marker Screen - Allow owners to pin their location

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { firestoreBusinessService } from '../../services/firestoreBusinessService';

interface MarkerData {
  latitude: number;
  longitude: number;
  address?: string;
  placedAt: string;
}

export const AddBusinessMarker: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { businessId } = route.params as { businessId: string };

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 11.6894,
    longitude: 122.3670,
  });
  const [markerPosition, setMarkerPosition] = useState(currentLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadExistingMarker();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setMarkerPosition({ latitude, longitude });
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert(
          'Location Error',
          'Could not get your current location. Using default location.'
        );
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const loadExistingMarker = async () => {
    try {
      const marker = await firestoreBusinessService.getBusinessMarker(businessId);
      if (marker) {
        setMarkerPosition({
          latitude: marker.latitude,
          longitude: marker.longitude,
        });
      }
    } catch (error) {
      console.error('Error loading marker:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const handleUseCurrentLocation = () => {
    setMarkerPosition(currentLocation);
    Alert.alert('Location Updated', 'Marker moved to your current location');
  };

  const handleSaveMarker = async () => {
    try {
      setIsSaving(true);

      const address = `${markerPosition.latitude.toFixed(6)}, ${markerPosition.longitude.toFixed(6)}`;

      // Save to Firestore using service
      await firestoreBusinessService.saveBusinessMarker(
        businessId,
        markerPosition.latitude,
        markerPosition.longitude,
        address
      );

      Alert.alert(
        'Success!',
        'Your business location marker has been saved successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving marker:', error);
      Alert.alert('Error', 'Failed to save marker. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Location Marker</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>📍 Pin Your Location</Text>
        <Text style={styles.instructionsText}>
          Tap anywhere on the map to place your marker, or use the button below to use your current location.
        </Text>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: markerPosition.latitude,
          longitude: markerPosition.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={markerPosition}
          draggable
          onDragEnd={(e) => setMarkerPosition(e.nativeEvent.coordinate)}
          pinColor={COLORS.primary}
        >
          <View style={styles.customMarker}>
            <View style={styles.markerPin}>
              <Text style={styles.markerIcon}>📍</Text>
            </View>
            <View style={styles.markerShadow} />
          </View>
        </Marker>
      </MapView>

      {/* Coordinates Display */}
      <View style={styles.coordinatesCard}>
        <Text style={styles.coordinatesLabel}>Selected Location:</Text>
        <Text style={styles.coordinatesText}>
          Lat: {markerPosition.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Lng: {markerPosition.longitude.toFixed(6)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.currentLocationIcon}>🎯</Text>
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSaveMarker}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.text.onPrimary} />
          ) : (
            <>
              <Text style={styles.saveButtonIcon}>✓</Text>
              <Text style={styles.saveButtonText}>Save Marker</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text.onPrimary,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  instructionsCard: {
    backgroundColor: COLORS.accent,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.text.onAccent,
    marginBottom: SPACING.xs,
  },
  instructionsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.onAccent,
    lineHeight: 20,
  },
  map: {
    flex: 1,
    marginTop: SPACING.md,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerIcon: {
    fontSize: 20,
  },
  markerShadow: {
    width: 20,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginTop: 2,
  },
  coordinatesCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  coordinatesLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  coordinatesText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionsContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentLocationIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  currentLocationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.onSecondary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
    color: COLORS.text.onPrimary,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: 'bold',
    color: COLORS.text.onPrimary,
  },
});
