import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "", // id is optional
  accessToken: "",
  _initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.id = action.payload.id;
      state.accessToken = action.payload.accessToken;
      state._initialized = action.payload._initialized ?? state._initialized;
    },
    clearCredentials: (state) => {
      state.id = "";
      state.accessToken = "";
    },
    setInitialized: (state) => {
      state._initialized = true;
    },
  },
});

export const { setCredentials, clearCredentials, setInitialized } = authSlice.actions;
export const authReducer = authSlice.reducer; 