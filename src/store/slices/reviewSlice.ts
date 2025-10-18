// Review Redux Slice

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review } from '../../types';
import { reviewService } from '../../services/reviewService';

interface ReviewState {
  reviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  userReviews: [],
  isLoading: false,
  error: null,
};

export const fetchBusinessReviews = createAsyncThunk(
  'review/fetchBusinessReviews',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await reviewService.getBusinessReviews(businessId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'review/createReview',
  async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await reviewService.createReview(reviewData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessReviews.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      });
  },
});

export const { clearError, setReviews } = reviewSlice.actions;
export { reviewSlice };
