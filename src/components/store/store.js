import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import blogsReducer from './slices/blogsSlice';
import commentsReducer from './slices/commentsSlice';
import newslettersReducer from './slices/newslettersSlice';
import appointmentsReducer from './slices/appointmentsSlice';
import metricsReducer from './slices/metricsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    blogs: blogsReducer,
    comments: commentsReducer,
    newsletters: newslettersReducer,
    appointments: appointmentsReducer,
    metrics: metricsReducer,
  },
});

export default store;