import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  loading: false,
  error: null,

  page: 1,
  totalPages: 1,
  totalJobs: 0,
};

const jobSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {
    changePage(state, action) {
    state.page = action.payload;
  },

    fetchStart(state){
      state.loading=true;
      state.error=null;
    },

    fetchSuccess(state, action) {
    state.loading = false;
    state.jobs = action.payload.jobs;
    state.page = action.payload.page;
    state.totalPages = action.payload.totalPages;
    state.totalJobs = action.payload.totalJobs;
   },

    fetchFail(state,action){
      state.loading=false;
      state.error=action.payload;
    }

  }

});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  changePage,
}=jobSlice.actions;

export default jobSlice.reducer;