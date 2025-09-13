// src/lib/redux/slices/languageSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLanguage: "en",
  isRTL: false,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      state.isRTL = action.payload === "ar";
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;