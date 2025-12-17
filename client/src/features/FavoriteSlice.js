import { createSlice } from "@reduxjs/toolkit";

const FavoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    list: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.list.find((f) => f.id === action.payload.id);
      if (!exists) {
        state.list.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.list = state.list.filter((f) => f.id !== action.payload);
    },
    clearFavorites: (state) => {
      state.list = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  FavoriteSlice.actions;

export default FavoriteSlice.reducer;
