// Category Filter Component - Integrated in Main Panel

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { BusinessCategory } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

interface CategoryFilterProps {
  selectedCategories: BusinessCategory[];
  onCategoryToggle: (category: BusinessCategory) => void;
  style?: any;
}

const CATEGORIES: { value: BusinessCategory; label: string; emoji: string }[] = [
  { value: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { value: 'cafe', label: 'Café', emoji: '☕' },
  { value: 'fast_food', label: 'Fast Food', emoji: '🍔' },
  { value: 'fine_dining', label: 'Fine Dining', emoji: '🍷' },
  { value: 'bar', label: 'Bar', emoji: '🍺' },
  { value: 'food_truck', label: 'Food Truck', emoji: '🚚' },
  { value: 'bakery', label: 'Bakery', emoji: '🥐' },
  { value: 'pizzeria', label: 'Pizzeria', emoji: '🍕' },
  { value: 'sushi', label: 'Sushi', emoji: '🍣' },
  { value: 'mexican', label: 'Mexican', emoji: '🌮' },
  { value: 'italian', label: 'Italian', emoji: '🍝' },
  { value: 'chinese', label: 'Chinese', emoji: '🥡' },
  { value: 'indian', label: 'Indian', emoji: '🍛' },
  { value: 'thai', label: 'Thai', emoji: '🍜' },
  { value: 'other', label: 'Other', emoji: '🍴' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  onCategoryToggle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.value);
          return (
            <TouchableOpacity
              key={category.value}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => onCategoryToggle(category.value)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  emoji: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
});
