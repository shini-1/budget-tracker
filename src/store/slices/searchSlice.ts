// Search Redux Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchFilters, Location } from '../../types';

interface SearchState {
  query: string;
  location: Location | null;
  filters: SearchFilters;
  searchHistory: string[];
  recentSearches: string[];
}

const initialState: SearchState = {
  query: '',
  location: null,
  filters: {},
  searchHistory: [],
  recentSearches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setLocation: (state, action: PayloadAction<Location>) => {
      state.location = action.payload;
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        state.searchHistory = state.searchHistory.slice(0, 10); // Keep only 10 recent searches
      }
    },
    clearHistory: (state) => {
      state.searchHistory = [];
    },
    clearSearch: (state) => {
      state.query = '';
      state.filters = {};
    },
  },
});

export const {
  setQuery,
  setLocation,
  setFilters,
  addToHistory,
  clearHistory,
  clearSearch,
} = searchSlice.actions;

export { searchSlice };
