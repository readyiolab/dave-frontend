import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: {},
};

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setMetrics: (state, action) => {
      state.metrics = action.payload;
    },
  },
});

export const { setMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;