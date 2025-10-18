// Custom Hook for Location Services

import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      return status === 'granted';
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      const locationData: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setLocation(locationData);
      return locationData;
    } catch (err: any) {
      setError(err.message || 'Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [requestPermission]);

  const watchLocation = useCallback(() => {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        const locationData: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(locationData);
      }
    );
  }, []);

  useEffect(() => {
    // Check permission status on mount
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setPermissionStatus(status);
    });
  }, []);

  return {
    location,
    isLoading,
    error,
    permissionStatus,
    getCurrentLocation,
    watchLocation,
    requestPermission,
  };
};
