// Custom Hook for Location Services

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, check, RESULTS } from 'react-native-permissions';
import { Location as LocationType } from '../types';

type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked';

interface LocationState {
  location: LocationType | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: PermissionStatus;
  isInitialized: boolean;
}

const MOCK_LOCATION: LocationType = {
  latitude: 11.6894,  // Kalibo, Aklan
  longitude: 122.3670,
};

// Safe Geolocation wrapper
const safeGeolocation = {
  getCurrentPosition: (success: any, error: any, options: any) => {
    try {
      if (!Geolocation || !Geolocation.getCurrentPosition) {
        error({ code: 0, message: 'Geolocation not available' });
        return;
      }
      Geolocation.getCurrentPosition(success, error, options);
    } catch (err: any) {
      error({ code: 0, message: err.message || 'Geolocation error' });
    }
  },
  watchPosition: (success: any, error: any, options: any) => {
    try {
      if (!Geolocation || !Geolocation.watchPosition) {
        error({ code: 0, message: 'Geolocation not available' });
        return -1;
      }
      return Geolocation.watchPosition(success, error, options);
    } catch (err: any) {
      error({ code: 0, message: err.message || 'Geolocation error' });
      return -1;
    }
  },
  clearWatch: (watchId: number) => {
    try {
      if (Geolocation && Geolocation.clearWatch) {
        Geolocation.clearWatch(watchId);
      }
    } catch (err) {
      console.warn('Error clearing watch:', err);
    }
  },
};

export const useLocation = (autoStart: boolean = false) => {
  const [state, setState] = useState<LocationState>({
    location: autoStart ? null : MOCK_LOCATION, // Start with mock if not auto-starting
    isLoading: false,
    error: null,
    permissionStatus: 'undetermined',
    isInitialized: false,
  });

  const updateState = useCallback((updates: Partial<LocationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      updateState({ isLoading: true, error: null });

      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      if (!permission) {
        updateState({
          error: 'Platform not supported',
          isLoading: false
        });
        return false;
      }

      const result = await request(permission);
      const granted = result === RESULTS.GRANTED;
      const status: PermissionStatus = granted ? 'granted' : 'denied';

      updateState({
        permissionStatus: status,
        isLoading: false
      });

      return granted;
    } catch (err: any) {
      updateState({
        error: err.message || 'Failed to request location permission',
        isLoading: false
      });
      return false;
    }
  }, [updateState]);

  const getCurrentLocation = useCallback(async (useFallback: boolean = true): Promise<LocationType | null> => {
    updateState({ isLoading: true, error: null });

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        updateState({
          error: 'Location permission denied',
          isLoading: false
        });
        return useFallback ? MOCK_LOCATION : null;
      }

      return new Promise<LocationType | null>((resolve) => {
        const timeoutId = setTimeout(() => {
          updateState({
            error: 'Location request timed out - using fallback location',
            isLoading: false
          });
          resolve(useFallback ? MOCK_LOCATION : null);
        }, 10000);

        safeGeolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            try {
              const locationData: LocationType = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              updateState({
                location: locationData,
                isLoading: false,
                error: null,
                isInitialized: true
              });
              resolve(locationData);
            } catch (parseError) {
              clearTimeout(timeoutId);
              updateState({
                error: 'Failed to parse location data',
                isLoading: false
              });
              resolve(useFallback ? MOCK_LOCATION : null);
            }
          },
          (err) => {
            clearTimeout(timeoutId);
            console.warn('Geolocation error:', err);

            let errorMessage = 'Failed to get current location';
            let fallbackLocation = useFallback ? MOCK_LOCATION : null;

            if (err.code) {
              switch (err.code) {
                case 1:
                  errorMessage = 'Location permission denied';
                  fallbackLocation = useFallback ? MOCK_LOCATION : null;
                  break;
                case 2:
                  errorMessage = 'Location unavailable - GPS disabled';
                  fallbackLocation = useFallback ? MOCK_LOCATION : null;
                  break;
                case 3:
                  errorMessage = 'Location request timed out';
                  fallbackLocation = useFallback ? MOCK_LOCATION : null;
                  break;
                default:
                  errorMessage = err.message || 'Unknown location error';
              }
            } else {
              errorMessage = err.message || errorMessage;
            }

            updateState({
              error: errorMessage,
              location: fallbackLocation,
              isLoading: false,
              isInitialized: true
            });
            resolve(fallbackLocation);
          },
          {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 10000,
            distanceFilter: 10,
          }
        );
      });
    } catch (error: any) {
      updateState({
        error: error.message || 'Location service error',
        location: useFallback ? MOCK_LOCATION : null,
        isLoading: false,
        isInitialized: true
      });
      return useFallback ? MOCK_LOCATION : null;
    }
  }, [requestPermission, updateState]);

  const watchLocation = useCallback(() => {
    let watchId: number = -1;

    const startWatching = async () => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          updateState({ error: 'Location permission denied for watching' });
          return;
        }

        watchId = safeGeolocation.watchPosition(
          (position) => {
            try {
              const locationData: LocationType = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              updateState({
                location: locationData,
                error: null
              });
            } catch (parseError) {
              updateState({ error: 'Failed to parse watch location data' });
            }
          },
          (err) => {
            console.warn('Location watch error:', err);
            updateState({
              error: err.message || 'Location watch failed',
              location: MOCK_LOCATION // Fallback when watching fails
            });
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 10,
            interval: 5000,
          }
        );
      } catch (error: any) {
        updateState({ error: error.message || 'Failed to start location watching' });
      }
    };

    startWatching();

    return {
      remove: () => {
        if (watchId !== -1) {
          safeGeolocation.clearWatch(watchId);
        }
      },
    };
  }, [requestPermission, updateState]);

  // Initialize on mount if autoStart is enabled
  useEffect(() => {
    if (autoStart && !state.isInitialized) {
      getCurrentLocation(true);
    } else if (!autoStart && !state.isInitialized) {
      // Mark as initialized with mock data
      updateState({ isInitialized: true });
    }
  }, [autoStart, state.isInitialized, getCurrentLocation, updateState]);

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      if (permission) {
        try {
          const result = await check(permission);
          const status: PermissionStatus =
            result === RESULTS.GRANTED ? 'granted' :
            result === RESULTS.DENIED ? 'denied' :
            result === RESULTS.BLOCKED ? 'blocked' :
            'undetermined';
          updateState({ permissionStatus: status });
        } catch (err) {
          console.warn('Error checking permission:', err);
        }
      }
    };

    checkPermission();
  }, [updateState]);

  return {
    location: state.location,
    isLoading: state.isLoading,
    error: state.error,
    permissionStatus: state.permissionStatus,
    isInitialized: state.isInitialized,
    getCurrentLocation,
    watchLocation,
    requestPermission,
  };
};
