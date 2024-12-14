import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Resource {
  id: string;
  type: string;
  name: string;
  status: string;
  cost: number;
  region: string;
  utilization: number;
}

interface ResourcesState {
  items: Resource[];
  loading: boolean;
  error: string | null;
  totalCost: number;
  totalCount: number;
  activeCount: number;
}

const initialState: ResourcesState = {
  items: [],
  loading: false,
  error: null,
  totalCost: 0,
  totalCount: 0,
  activeCount: 0,
};

export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async () => {
    const response = await axios.get('/api/v1/resources');
    return response.data;
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalCount = action.payload.length;
        state.activeCount = action.payload.filter(
          (resource: Resource) => resource.status === 'Running'
        ).length;
        state.totalCost = action.payload.reduce(
          (sum: number, resource: Resource) => sum + resource.cost,
          0
        );
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch resources';
      });
  },
});

export default resourcesSlice.reducer;
