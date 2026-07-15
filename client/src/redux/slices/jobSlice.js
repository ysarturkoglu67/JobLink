import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {

    fetchStart(state){
      state.loading=true;
      state.error=null;
    },

    fetchSuccess(state,action){
      state.loading=false;
      state.jobs=action.payload;
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
  fetchFail
}=jobSlice.actions;

export default jobSlice.reducer;