// Restaurant Comparison Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Business } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

export const ComparisonScreen: React.FC = () => {
  const { businesses } = useSelector((state: RootState) => state.business);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Business[]>([]);
  const [showSelector, setShowSelector] = useState(true);

  const handleSelectRestaurant = (restaurant: Business) => {
    if (selectedRestaurants.find((r) => r.id === restaurant.id)) {
      setSelectedRestaurants(selectedRestaurants.filter((r) => r.id !== restaurant.id));
    } else if (selectedRestaurants.length < 3) {
      setSelectedRestaurants([...selectedRestaurants, restaurant]);
    }
  };

  const handleCompare = () => {
    if (selectedRestaurants.length >= 2) {
      setShowSelector(false);
    }
  };

  const handleReset = () => {
    setSelectedRestaurants([]);
    setShowSelector(true);
  };

  const renderComparisonRow = (label: string, values: (string | number)[]) => (
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonLabel}>{label}</Text>
      <View style={styles.comparisonValues}>
        {values.map((value, index) => (
          <View key={index} style={styles.comparisonValueCell}>
            <Text style={styles.comparisonValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (showSelector) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Restaurants to Compare</Text>
          <Text style={styles.subtitle}>
            Choose 2-3 restaurants ({selectedRestaurants.length}/3 selected)
          </Text>
        </View>

        <ScrollView style={styles.selectorList}>
          {businesses.map((restaurant) => {
            const isSelected = selectedRestaurants.find((r) => r.id === restaurant.id);
            return (
              <TouchableOpacity
                key={restaurant.id}
                style={[styles.selectorCard, isSelected && styles.selectorCardSelected]}
                onPress={() => handleSelectRestaurant(restaurant)}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: restaurant.images[0] }}
                  style={styles.selectorImage}
                  resizeMode="cover"
                />
                <View style={styles.selectorContent}>
                  <Text style={styles.selectorName}>{restaurant.name}</Text>
                  <Text style={styles.selectorMeta}>
                    {restaurant.category} • {restaurant.priceRange} • ⭐{' '}
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedRestaurants.length >= 2 && (
          <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
            <Text style={styles.compareButtonText}>
              Compare {selectedRestaurants.length} Restaurants
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant Comparison</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetButton}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.comparisonTable}>
          {/* Restaurant Headers */}
          <View style={styles.headerRow}>
            <View style={styles.labelColumn} />
            {selectedRestaurants.map((restaurant) => (
              <View key={restaurant.id} style={styles.restaurantColumn}>
                <Image
                  source={{ uri: restaurant.images[0] }}
                  style={styles.comparisonImage}
                  resizeMode="cover"
                />
                <Text style={styles.comparisonName} numberOfLines={2}>
                  {restaurant.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Comparison Rows */}
          <ScrollView style={styles.comparisonContent}>
            {renderComparisonRow(
              'Rating',
              selectedRestaurants.map((r) => `⭐ ${r.rating.toFixed(1)}`)
            )}
            {renderComparisonRow(
              'Reviews',
              selectedRestaurants.map((r) => `${r.reviewCount} reviews`)
            )}
            {renderComparisonRow(
              'Category',
              selectedRestaurants.map((r) => r.category)
            )}
            {renderComparisonRow(
              'Price Range',
              selectedRestaurants.map((r) => r.priceRange)
            )}
            {renderComparisonRow(
              'Verified',
              selectedRestaurants.map((r) => (r.isVerified ? '✓ Yes' : '✗ No'))
            )}
            {renderComparisonRow(
              'Location',
              selectedRestaurants.map((r) => r.location.city || 'N/A')
            )}
            {renderComparisonRow(
              'Phone',
              selectedRestaurants.map((r) => r.phoneNumber)
            )}
            {renderComparisonRow(
              'Amenities',
              selectedRestaurants.map((r) => `${r.amenities.length} amenities`)
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  resetButton: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectorList: {
    flex: 1,
    padding: SPACING.md,
  },
  selectorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectorCardSelected: {
    borderColor: COLORS.primary,
  },
  selectorImage: {
    width: 80,
    height: 80,
  },
  selectorContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  selectorName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  selectorMeta: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  checkmark: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  checkmarkText: {
    fontSize: 24,
    color: COLORS.surface,
  },
  compareButton: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  compareButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
  comparisonTable: {
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  labelColumn: {
    width: 120,
  },
  restaurantColumn: {
    width: 150,
    marginLeft: SPACING.md,
    alignItems: 'center',
  },
  comparisonImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  comparisonName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  comparisonContent: {
    flex: 1,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  comparisonLabel: {
    width: 120,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  comparisonValues: {
    flexDirection: 'row',
  },
  comparisonValueCell: {
    width: 150,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  comparisonValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
});
