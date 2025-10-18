// Advanced Filters Component - Price, Rating, Distance

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PriceRange } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

interface AdvancedFiltersProps {
  selectedPriceRanges: PriceRange[];
  minRating: number;
  maxDistance: number;
  onPriceRangeToggle: (priceRange: PriceRange) => void;
  onRatingChange: (rating: number) => void;
  onDistanceChange: (distance: number) => void;
  onReset: () => void;
  style?: any;
}

const PRICE_RANGES: PriceRange[] = ['$', '$$', '$$$', '$$$$'];
const RATINGS = [1, 2, 3, 4, 5];
const DISTANCES = [1, 3, 5, 10, 25]; // in miles

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  selectedPriceRanges,
  minRating,
  maxDistance,
  onPriceRangeToggle,
  onRatingChange,
  onDistanceChange,
  onReset,
  style,
}) => {
  return (
    <ScrollView style={[styles.container, style]}>
      {/* Price Range Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.optionsRow}>
          {PRICE_RANGES.map((price) => {
            const isSelected = selectedPriceRanges.includes(price);
            return (
              <TouchableOpacity
                key={price}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                ]}
                onPress={() => onPriceRangeToggle(price)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Rating Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minimum Rating</Text>
        <View style={styles.optionsRow}>
          {RATINGS.map((rating) => {
            const isSelected = minRating === rating;
            return (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                ]}
                onPress={() => onRatingChange(rating)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {rating}⭐
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Distance Filter */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Maximum Distance</Text>
        <View style={styles.optionsRow}>
          {DISTANCES.map((distance) => {
            const isSelected = maxDistance === distance;
            return (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                ]}
                onPress={() => onDistanceChange(distance)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {distance} mi
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onReset}
        activeOpacity={0.7}
      >
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  section: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  resetButton: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
  },
});
