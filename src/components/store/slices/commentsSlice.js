import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comments: [],
  page: 1,
  pageSize: 10,
  total: 0,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      state.comments = action.payload.comments;
      state.total = action.payload.total;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const { setComments, setPage } = commentsSlice.actions;
export default commentsSlice.reducer;