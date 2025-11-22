// src/features/performance/performanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to load JSON from /data.json
export const fetchPerformanceData = createAsyncThunk(
  'performance/fetchPerformanceData',
  async () => {
    const res = await fetch('/data.json');
    if (!res.ok) {
      throw new Error('Failed to load data.json');
    }
    const data = await res.json();
    return data;
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    region: 'All',
    channel: 'All',
  },
  sort: {
    field: 'spend', // 'spend' | 'conversions' | 'ctr' | etc.
    direction: 'desc', // 'asc' | 'desc'
  },
  pagination: {
    page: 1,
    pageSize: 25,
  },
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setRegionFilter(state, action) {
      state.filters.region = action.payload;
      state.pagination.page = 1;
    },
    setChannelFilter(state, action) {
      state.filters.channel = action.payload;
      state.pagination.page = 1;
    },
    setSort(state, action) {
      const { field } = action.payload;
      if (state.sort.field === field) {
        // toggle direction
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = field;
        state.sort.direction = 'desc';
      }
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action) {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPerformanceData.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  setRegionFilter,
  setChannelFilter,
  setSort,
  setPage,
  setPageSize,
} = performanceSlice.actions;

export default performanceSlice.reducer;
