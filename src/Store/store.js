// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import performanceReducer from '../features/performance/performanceSlice';

export const store = configureStore({
  reducer: {
    performance: performanceReducer,
  },
});

export default store;
