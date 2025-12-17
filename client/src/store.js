import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/UserSlice";
import favoriteReducer from "./features/FavoriteSlice";
import selectedDelegateReducer from "./features/SelectedDelegateSlice";
import themeReducer from "./features/ThemeSlice"; // ✅ أضف هذا

export const store = configureStore({
  reducer: {
    users: userReducer,
    favorites: favoriteReducer,
    selectedDelegate: selectedDelegateReducer,
    theme: themeReducer, // ✅ أضف هذا
  },
});
