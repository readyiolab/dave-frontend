import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newsletters: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

const newslettersSlice = createSlice({
  name: 'newsletters',
  initialState,
  reducers: {
    setNewsletters: (state, action) => {
      state.newsletters = action.payload.newsletters;
      state.total = action.payload.total;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setNewsletters, setPage } = newslettersSlice.actions;
export default newslettersSlice.reducer;