// Favorites Redux Slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Business } from '../../types';

interface FavoritesState {
  favorites: Business[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Business>) => {
      const exists = state.favorites.find((fav) => fav.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((fav) => fav.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    setFavorites: (state, action: PayloadAction<Business[]>) => {
      state.favorites = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites, setFavorites } =
  favoritesSlice.actions;
export { favoritesSlice };
