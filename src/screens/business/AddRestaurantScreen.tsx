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
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { useLocation } from '../../hooks/useLocation';
import { Business, Location, BusinessHours } from '../../types';
import { firebaseBusinessService } from '../../services/firebaseBusinessService';
import LinearGradient from 'react-native-linear-gradient';

export const AddRestaurantScreen: React.FC = () => {
  const navigation = useNavigation();
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
      console.log('Getting current location...');
      const location = await getCurrentLocation(true); // Use fallback
      console.log('Location received:', location);
      
      if (location) {
        setSelectedLocation(location);
        Alert.alert('Success', `Location set to: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      } else {
        Alert.alert('Error', 'Could not get location. Please try again.');
      }
    } catch (error: any) {
      console.error('Location error:', error);
      // Don't crash - show user-friendly error
      Alert.alert(
        'Location Error',
        error?.message || 'Failed to get location. Please check your location permissions and try again.',
        [
          { text: 'OK', style: 'default' }
        ]
      );
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

    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to add a restaurant');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create default business hours
      const defaultHours: BusinessHours = {
        monday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
        tuesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
        wednesday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
        thursday: { isOpen: true, openTime: '09:00', closeTime: '21:00' },
        friday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        saturday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
        sunday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
      };

      const businessFormData = {
        name: restaurantName.trim(),
        description: description.trim() || 'A wonderful dining experience',
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        location: selectedLocation,
        category: 'restaurant' as const,
        hours: defaultHours,
        amenities: [],
      };

      console.log('Creating business with data:', businessFormData);

      // Save to Firebase
      const newBusiness = await firebaseBusinessService.createBusiness(
        businessFormData,
        user.id
      );

      console.log('Business created successfully:', newBusiness);

      Alert.alert(
        'Success!',
        'Your restaurant has been added successfully! It will be reviewed and approved soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setRestaurantName('');
              setDescription('');
              setPhoneNumber('');
              setSelectedLocation(null);
              // Navigate back to dashboard
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Error creating business:', error);
      Alert.alert('Error', error.message || 'Failed to add restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#9370DB', '#98FB98']} // Purple to Green gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.title}>🏪 Add Restaurant Location</Text>
        <Text style={styles.subtitle}>
          Add your restaurant to the Foodventurer map
        </Text>
      </LinearGradient>

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
                {locationLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.locationButtonText}>
                    📍 Use Current Location
                  </Text>
                )}
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
    backgroundColor: '#F0E68C', // Khaki background
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#FFFFFF',
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
    borderColor: '#DDA0DD', // Pastel plum border
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    color: COLORS.text.primary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  locationSection: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: '#E6E6FA', // Pastel lavender
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: '#6A5ACD', // Slate blue
    marginBottom: SPACING.md,
  },
  locationButtons: {
    gap: SPACING.md,
  },
  locationButton: {
    backgroundColor: '#98FB98', // Pastel green
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: '#DDA0DD', // Pastel plum
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
  locationInfo: {
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#98FB98', // Pastel green
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#228B22', // Forest green
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  changeLocationButton: {
    alignSelf: 'flex-start',
  },
  changeLocationText: {
    color: '#9370DB', // Medium purple
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginTop: SPACING.sm,
  },
  submitButton: {
    backgroundColor: '#98FB98', // Pastel green
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  submitButtonText: {
    color: '#FFFFFF',
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
