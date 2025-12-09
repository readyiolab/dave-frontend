import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload.appointments;
      state.total = action.payload.total;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setAppointments, setPage } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;