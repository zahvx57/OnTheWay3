import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "ontheway_favorites_v1";

const readLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLS = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
};

const FavoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    list: readLS(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const item = action.payload || {};
      const id = item.id ?? item._id ?? item.favId;
      if (id == null) return;

      const exists = state.list.some((f) => (f.id ?? f._id ?? f.favId) === id);
      if (!exists) {
        state.list.push({ ...item, id });
        writeLS(state.list);
      }
    },
    removeFavorite: (state, action) => {
      const id = action.payload;
      state.list = state.list.filter((f) => (f.id ?? f._id ?? f.favId) !== id);
      writeLS(state.list);
    },
    clearFavorites: (state) => {
      state.list = [];
      writeLS(state.list);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = FavoriteSlice.actions;
export default FavoriteSlice.reducer;
