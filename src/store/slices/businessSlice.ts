// Business Redux Slice

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Business, BusinessForm, SearchParams, SearchFilters } from '../../types';
import { businessService } from '../../services/businessService';

// Initial state
interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  userBusinesses: Business[];
  searchResults: Business[];
  filters: SearchFilters;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  userBusinesses: [],
  searchResults: [],
  filters: {},
  isLoading: false,
  isSearching: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await businessService.getBusinesses(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch businesses');
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  'business/fetchBusinessById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await businessService.getBusinessById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch business');
    }
  }
);

export const searchBusinesses = createAsyncThunk(
  'business/searchBusinesses',
  async (searchParams: SearchParams, { rejectWithValue }) => {
    try {
      const response = await businessService.searchBusinesses(searchParams);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Search failed');
    }
  }
);

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (businessData: BusinessForm, { rejectWithValue }) => {
    try {
      const response = await businessService.createBusiness(businessData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create business');
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, data }: { id: string; data: Partial<BusinessForm> }, { rejectWithValue }) => {
    try {
      const response = await businessService.updateBusiness(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update business');
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  'business/deleteBusiness',
  async (id: string, { rejectWithValue }) => {
    try {
      await businessService.deleteBusiness(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete business');
    }
  }
);

export const fetchUserBusinesses = createAsyncThunk(
  'business/fetchUserBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await businessService.getUserBusinesses();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user businesses');
    }
  }
);

// Business slice
const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        hasNext: false,
        hasPrev: false,
      };
    },
    setFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    updateBusinessInList: (state, action: PayloadAction<Business>) => {
      const index = state.businesses.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.businesses[index] = action.payload;
      }
      
      const searchIndex = state.searchResults.findIndex(b => b.id === action.payload.id);
      if (searchIndex !== -1) {
        state.searchResults[searchIndex] = action.payload;
      }
      
      const userIndex = state.userBusinesses.findIndex(b => b.id === action.payload.id);
      if (userIndex !== -1) {
        state.userBusinesses[userIndex] = action.payload;
      }
      
      if (state.currentBusiness?.id === action.payload.id) {
        state.currentBusiness = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch businesses
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch business by ID
    builder
      .addCase(fetchBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search businesses
    builder
      .addCase(searchBusinesses.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      });

    // Create business
    builder
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userBusinesses.push(action.payload);
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update business
    builder
      .addCase(updateBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Update in all relevant arrays
        const index = state.userBusinesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.userBusinesses[index] = action.payload;
        }
        
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete business
    builder
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.userBusinesses = state.userBusinesses.filter(b => b.id !== action.payload);
        if (state.currentBusiness?.id === action.payload) {
          state.currentBusiness = null;
        }
      });

    // Fetch user businesses
    builder
      .addCase(fetchUserBusinesses.fulfilled, (state, action) => {
        state.userBusinesses = action.payload;
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  setFilters,
  clearFilters,
  setCurrentBusiness,
  updateBusinessInList,
} = businessSlice.actions;

export { businessSlice };
