// Restaurant Information Management Screen

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { BusinessCategory, PriceRange, Business, BusinessHours } from '../../types';
import { firebaseBusinessService } from '../../services/firebaseBusinessService';
import LinearGradient from 'react-native-linear-gradient';

export const RestaurantInfoScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('restaurant');
  const [priceRange, setPriceRange] = useState<PriceRange>('$$');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const categories: BusinessCategory[] = [
    'restaurant', 'cafe', 'fast_food', 'fine_dining', 'bar',
    'food_truck', 'bakery', 'pizzeria', 'sushi', 'mexican',
    'italian', 'chinese', 'indian', 'thai', 'other'
  ];

  const priceRanges: PriceRange[] = ['$', '$$', '$$$', '$$$$'];

  useEffect(() => {
    loadMyBusiness();
  }, [user]);

  const loadMyBusiness = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;
      
      const businesses = await firebaseBusinessService.getUserBusinesses(user.id);
      if (businesses.length > 0) {
        const business = businesses[0];
        setMyBusiness(business);
        
        // Populate form fields
        setRestaurantName(business.name);
        setDescription(business.description);
        setCategory(business.category);
        setPriceRange(business.priceRange);
        setPhoneNumber(business.phoneNumber);
        setEmail(business.email);
        setWebsite(business.website || '');
        setAddress(business.location.address || '');
        setCity(business.location.city || '');
        setState(business.location.state || '');
        setPostalCode(business.location.postalCode || '');
      }
    } catch (error) {
      console.error('Error loading business:', error);
      Alert.alert('Error', 'Failed to load business information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!myBusiness?.id) {
      Alert.alert('Error', 'No business found to update');
      return;
    }

    if (!restaurantName.trim()) {
      Alert.alert('Error', 'Please enter restaurant name');
      return;
    }

    setIsSaving(true);

    try {
      const updates = {
        name: restaurantName.trim(),
        description: description.trim(),
        category,
        priceRange,
        phoneNumber: phoneNumber.trim(),
        email: email.trim(),
        website: website.trim(),
        location: {
          ...myBusiness.location,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
        },
      };

      await firebaseBusinessService.updateBusiness(myBusiness.id, updates);
      Alert.alert('Success', 'Restaurant information updated successfully!');
      loadMyBusiness(); // Reload data
    } catch (error: any) {
      console.error('Error updating business:', error);
      Alert.alert('Error', error.message || 'Failed to update restaurant information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9370DB" />
        <Text style={styles.loadingText}>Loading restaurant info...</Text>
      </View>
    );
  }

  if (!myBusiness) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noBusinessText}>No business found. Please create one first.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#9370DB', '#98FB98']} // Purple to Green gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>🏪 Restaurant Information</Text>
        <Text style={styles.headerSubtitle}>Update your business details</Text>
      </LinearGradient>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>Restaurant Name *</Text>
        <TextInput
          style={styles.input}
          value={restaurantName}
          onChangeText={setRestaurantName}
          placeholder="Enter restaurant name"
          placeholderTextColor={COLORS.text.hint}
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your restaurant"
          placeholderTextColor={COLORS.text.hint}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
                {cat.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Price Range *</Text>
        <View style={styles.priceRangeContainer}>
          {priceRanges.map((price) => (
            <TouchableOpacity
              key={price}
              style={[styles.priceChip, priceRange === price && styles.chipSelected]}
              onPress={() => setPriceRange(price)}
            >
              <Text style={[styles.chipText, priceRange === price && styles.chipTextSelected]}>
                {price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1 234 567 8900"
          placeholderTextColor={COLORS.text.hint}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="contact@restaurant.com"
          placeholderTextColor={COLORS.text.hint}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input}
          value={website}
          onChangeText={setWebsite}
          placeholder="www.restaurant.com"
          placeholderTextColor={COLORS.text.hint}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        
        <Text style={styles.label}>Street Address *</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="123 Main Street"
          placeholderTextColor={COLORS.text.hint}
        />

        <Text style={styles.label}>City *</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="San Francisco"
          placeholderTextColor={COLORS.text.hint}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>State *</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="CA"
              placeholderTextColor={COLORS.text.hint}
              maxLength={2}
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Postal Code *</Text>
            <TextInput
              style={styles.input}
              value={postalCode}
              onChangeText={setPostalCode}
              placeholder="94102"
              placeholderTextColor={COLORS.text.hint}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} 
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>-Code Blooded</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0E68C', // Khaki background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0E68C',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  noBusinessText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  headerGradient: {
    padding: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  section: {
    padding: SPACING.md,
    backgroundColor: '#E6E6FA', // Pastel lavender
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: '#6A5ACD', // Slate blue
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    marginRight: SPACING.sm,
  },
  chipSelected: {
    backgroundColor: '#98FB98', // Pastel green
    borderColor: '#98FB98',
  },
  chipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  priceChip: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    backgroundColor: '#FFFACD', // Pastel lemon chiffon
    borderWidth: 1,
    borderColor: '#DDA0DD', // Pastel plum
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  saveButton: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: '#98FB98', // Pastel green
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.text.disabled,
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: '#9370DB', // Medium purple
    fontWeight: '600',
  },
});
