import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Recommendation {
  id: number;
  resourceType: string;
  resourceId: string;
  currentConfig: string;
  recommendedConfig: string;
  potentialSavings: number;
  priority: string;
  status: string;
}

interface RecommendationsState {
  items: Recommendation[];
  loading: boolean;
  error: string | null;
  totalPotentialSavings: number;
}

const initialState: RecommendationsState = {
  items: [],
  loading: false,
  error: null,
  totalPotentialSavings: 0,
};

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetchRecommendations',
  async () => {
    const response = await axios.get('/api/v1/optimization/recommendations');
    return response.data;
  }
);

export const applyRecommendation = createAsyncThunk(
  'recommendations/applyRecommendation',
  async (recommendationId: number) => {
    const response = await axios.post(`/api/v1/optimization/apply/${recommendationId}`);
    return response.data;
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalPotentialSavings = action.payload.reduce(
          (sum: number, item: Recommendation) => sum + item.potentialSavings,
          0
        );
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
      })
      .addCase(applyRecommendation.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default recommendationsSlice.reducer;
