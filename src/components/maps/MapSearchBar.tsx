// Map Search Bar Component

import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Business, Location } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { debounce } from '../../utils';

interface MapSearchBarProps {
  onSearch: (query: string) => void;
  onLocationSelect?: (location: Location) => void;
  suggestions?: Business[];
  onSuggestionSelect?: (business: Business) => void;
  placeholder?: string;
  style?: any;
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSearch,
  onLocationSelect,
  suggestions = [],
  onSuggestionSelect,
  placeholder = "Search restaurants...",
  style,
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setShowSuggestions(text.length > 0);
    debouncedSearch(text);
  };

  const handleSuggestionPress = (business: Business) => {
    setQuery(business.name);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(business);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onSearch('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const renderSuggestion = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <View style={styles.suggestionIcon}>
        <Ionicons name="restaurant" size={20} color={COLORS.primary} />
      </View>
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.suggestionSubtitle} numberOfLines={1}>
          {item.category} • ⭐ {item.rating.toFixed(1)} • {item.location.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused
      ]}>
        <Ionicons
          name="search"
          size={20}
          color={isFocused ? COLORS.primary : COLORS.text.secondary}
          style={styles.searchIcon}
        />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text.hint}
          value={query}
          onChangeText={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: SPACING.sm,
    padding: 2,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    maxHeight: 200,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  suggestionSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
});
