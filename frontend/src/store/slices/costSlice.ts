import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CostState {
  currentMonthCost: number;
  historicalCosts: any[];
  serviceDistribution: any[];
  loading: boolean;
  error: string | null;
}

const initialState: CostState = {
  currentMonthCost: 0,
  historicalCosts: [],
  serviceDistribution: [],
  loading: false,
  error: null,
};

export const fetchCostData = createAsyncThunk(
  'costs/fetchCostData',
  async () => {
    const response = await axios.get('/api/v1/costs/current');
    return response.data;
  }
);

export const fetchHistoricalCosts = createAsyncThunk(
  'costs/fetchHistoricalCosts',
  async (days: number) => {
    const response = await axios.get(`/api/v1/costs/historical?days=${days}`);
    return response.data;
  }
);

const costSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCostData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCostData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMonthCost = action.payload.total_cost;
        state.serviceDistribution = action.payload.breakdown_by_service;
      })
      .addCase(fetchCostData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cost data';
      })
      .addCase(fetchHistoricalCosts.fulfilled, (state, action) => {
        state.historicalCosts = action.payload;
      });
  },
});

export default costSlice.reducer;
