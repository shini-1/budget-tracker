// Redux Store Configuration for Foodventurer App

import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { businessSlice } from './slices/businessSlice';
import { userSlice } from './slices/userSlice';
import { searchSlice } from './slices/searchSlice';
import { reviewSlice } from './slices/reviewSlice';
import { notificationSlice } from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    business: businessSlice.reducer,
    user: userSlice.reducer,
    search: searchSlice.reducer,
    review: reviewSlice.reducer,
    notification: notificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export action creators
export const authActions = authSlice.actions;
export const businessActions = businessSlice.actions;
export const userActions = userSlice.actions;
export const searchActions = searchSlice.actions;
export const reviewActions = reviewSlice.actions;
export const notificationActions = notificationSlice.actions;
