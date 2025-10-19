// Map Controls Component

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Location } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

interface MapControlsProps {
  onCenterOnUser: () => void;
  onToggleMapType: () => void;
  onShowFilters: () => void;
  userLocation?: Location;
  mapType: 'standard' | 'satellite' | 'hybrid';
  style?: any;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onCenterOnUser,
  onToggleMapType,
  onShowFilters,
  userLocation,
  mapType,
  style,
}) => {
  const getMapTypeIcon = (): string => {
    switch (mapType) {
      case 'satellite':
        return 'globe';
      case 'hybrid':
        return 'layers';
      default:
        return 'map';
    }
  };

  const getMapTypeLabel = (): string => {
    switch (mapType) {
      case 'satellite':
        return 'Satellite';
      case 'hybrid':
        return 'Hybrid';
      default:
        return 'Standard';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Center on User Button */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          !userLocation && styles.controlButtonDisabled
        ]}
        onPress={onCenterOnUser}
        disabled={!userLocation}
      >
        <Ionicons
          name="locate"
          size={24}
          color={userLocation ? COLORS.primary : COLORS.text.disabled}
        />
      </TouchableOpacity>

      {/* Map Type Toggle */}
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onToggleMapType}
      >
        <Ionicons
          name={getMapTypeIcon()}
          size={24}
          color={COLORS.primary}
        />
        <Text style={styles.controlLabel}>{getMapTypeLabel()}</Text>
      </TouchableOpacity>

      {/* Filters Button */}
      <TouchableOpacity
        style={styles.controlButton}
        onPress={onShowFilters}
      >
        <Ionicons
          name="options"
          size={24}
          color={COLORS.primary}
        />
        <Text style={styles.controlLabel}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.xl,
    zIndex: 1000,
  },
  controlButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.divider,
    minWidth: 60,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
});
