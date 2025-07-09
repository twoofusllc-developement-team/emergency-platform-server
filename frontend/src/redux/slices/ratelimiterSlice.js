import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const rateLimitSlice = createSlice({
  name: "rateLimit",
  initialState,
  reducers: {
    setRateLimit: (state, action) => {
      const { key, attempts, windowStart } = action.payload;
      state[key] = { attempts, windowStart };
    },
    resetRateLimit: (state, action) => {
      delete state[action.payload];
    },
  },
});

export const { setRateLimit, resetRateLimit } = rateLimitSlice.actions;
export const rateLimitReducer = rateLimitSlice.reducer; 