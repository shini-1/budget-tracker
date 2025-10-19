// Add Restaurant Location Screen for Business Owners

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { useLocation } from '../../hooks/useLocation';
import { Business, Location } from '../../types';

export const AddRestaurantScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { location: currentLocation, isLoading: locationLoading, error: locationError, getCurrentLocation } = useLocation();

  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user email if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setSelectedLocation(location);
        Alert.alert('Success', `Location set to: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to get location');
    }
  };

  const handleSelectLocationOnMap = () => {
    // TODO: Implement map location picker
    Alert.alert('Coming Soon', 'Map location picker will be available soon!');
  };

  const handleSubmit = async () => {
    if (!restaurantName.trim()) {
      Alert.alert('Error', 'Please enter restaurant name');
      return;
    }

    if (!selectedLocation) {
      Alert.alert('Error', 'Please set restaurant location');
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const restaurantData = {
        name: restaurantName.trim(),
        description: description.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        location: selectedLocation,
        category: 'restaurant' as const,
        rating: 0,
        reviewCount: 0,
        priceRange: '$$' as const,
        images: [],
        amenities: [],
        isVerified: false,
        isActive: true,
        ownerId: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // TODO: Implement API call to save restaurant
      console.log('Restaurant data to save:', restaurantData);

      Alert.alert(
        'Success!',
        'Your restaurant location has been added! It will be reviewed and approved soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setRestaurantName('');
              setDescription('');
              setPhoneNumber('');
              setSelectedLocation(null);
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🏪 Add Restaurant Location</Text>
        <Text style={styles.subtitle}>
          Add your restaurant to the Foodventurer map
        </Text>
      </View>

      <View style={styles.form}>
        {/* Restaurant Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Restaurant Name *</Text>
          <TextInput
            style={styles.input}
            value={restaurantName}
            onChangeText={setRestaurantName}
            placeholder="Enter restaurant name"
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your restaurant..."
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+63 XXX XXX XXXX"
            keyboardType="phone-pad"
            maxLength={20}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="restaurant@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={100}
          />
        </View>

        {/* Location Section */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>📍 Restaurant Location *</Text>

          {selectedLocation ? (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity
                style={styles.changeLocationButton}
                onPress={() => setSelectedLocation(null)}
              >
                <Text style={styles.changeLocationText}>Change Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.locationButtons}>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleGetCurrentLocation}
                disabled={locationLoading}
              >
                <Text style={styles.locationButtonText}>
                  📍 Use Current Location
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.locationButton, styles.mapButton]}
                onPress={handleSelectLocationOnMap}
              >
                <Text style={styles.locationButtonText}>
                  🗺️ Pick on Map
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Adding Restaurant...' : '📍 Add Restaurant Location'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          * Required fields{'\n'}
          Your restaurant will be reviewed before appearing on the map.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  locationButtons: {
    gap: SPACING.md,
  },
  locationButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: COLORS.secondary,
  },
  locationButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  changeLocationButton: {
    alignSelf: 'flex-start',
  },
  changeLocationText: {
    color: COLORS.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.success,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  submitButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
  },
  note: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: TYPOGRAPHY.lineHeight.md,
  },
});
