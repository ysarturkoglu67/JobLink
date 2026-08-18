import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  loading: false,
  error: null,

  page: 1,
  totalPages: 1,
  totalJobs: 0,
  limit: 6,
};

const jobSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    changePage(state, action) {
      state.page = action.payload;
    },

    resetPage(state) {
      state.page = 1;
    },

    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },

    fetchSuccess(state, action) {
      state.loading = false;
      state.error = null;

      state.jobs = action.payload.jobs || [];

      state.page = action.payload.page || 1;

      state.totalPages =
        action.payload.totalPages || 1;

      state.totalJobs =
        action.payload.totalJobs || 0;
    },

    fetchFail(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.jobs = [];
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  changePage,
  resetPage,
} = jobSlice.actions;

export default jobSlice.reducer;