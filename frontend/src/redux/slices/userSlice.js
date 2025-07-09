import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  role: "",
};

const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPersonData: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
    clearPersonData: (state) => {
      state.email = "";
      state.role = "";
    },
  },
});

export const { setPersonData, clearPersonData } = personSlice.actions;
export const personReducer = personSlice.reducer; 