import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blogs: [],
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
};

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload.blogs;
      state.total = action.payload.total;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },
  },
});

export const { setBlogs, setPage, setSearch } = blogsSlice.actions;
export default blogsSlice.reducer;