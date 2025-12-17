import { createSlice } from "@reduxjs/toolkit";

const SelectedDelegateSlice = createSlice({
  name: "selectedDelegate",
  initialState: {
    delegate: null,
  },
  reducers: {
    setSelectedDelegate: (state, action) => {
      state.delegate = action.payload;
    },
    clearSelectedDelegate: (state) => {
      state.delegate = null;
    },
  },
});

export const { setSelectedDelegate, clearSelectedDelegate } =
  SelectedDelegateSlice.actions;

export default SelectedDelegateSlice.reducer;
