import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  selectedLead: null,
  interactions: [],
  page: 1,
  pageSize: 10,
  total: 0,
  search: '',
};

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload.leads;
      state.total = action.payload.total;
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    setInteractions: (state, action) => {
      state.interactions = action.payload;
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

export const { setLeads, setSelectedLead, setInteractions, setPage, setSearch } = leadsSlice.actions;
export default leadsSlice.reducer;