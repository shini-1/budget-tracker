// Enhanced Favorites Screen with Restaurant Cards

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store';
import { removeFavorite } from '../../store/slices/favoritesSlice';
import { Business } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';

export const EnhancedFavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'recent'>('recent');

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return 0;
    }
  });

  const handleRemoveFavorite = (id: string) => {
    dispatch(removeFavorite(id));
  };

  const handleRestaurantPress = (businessId: string) => {
    navigation.navigate('RestaurantDetail' as never, { businessId } as never);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const renderFavoriteCard = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleRestaurantPress(item.id)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.name}
          </Text>
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item.id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeIcon}>❤️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(item.rating))}
          </View>
          <Text style={styles.ratingText}>
            {item.rating.toFixed(1)} ({item.reviewCount})
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.metaDivider}>•</Text>
          <Text style={styles.priceText}>{item.priceRange}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💔</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Start exploring and save your favorite restaurants here!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'recent' && styles.sortButtonActive]}
            onPress={() => setSortBy('recent')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'recent' && styles.sortButtonTextActive,
              ]}
            >
              Recent
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => setSortBy('name')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'name' && styles.sortButtonTextActive,
              ]}
            >
              Name
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
            onPress={() => setSortBy('rating')}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.sortButtonTextActive,
              ]}
            >
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Favorites List */}
      <FlatList
        data={sortedFavorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sortLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginRight: SPACING.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  sortButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sortButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  restaurantName: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  removeIcon: {
    fontSize: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  star: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  metaDivider: {
    marginHorizontal: SPACING.sm,
    color: COLORS.text.secondary,
  },
  priceText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});
