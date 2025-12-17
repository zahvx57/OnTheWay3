// src/features/UserSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
 
const API = "https://ontheway8.onrender.com";
 
// ✅ Login

export const getUser = createAsyncThunk("users/login", async (udata, thunkAPI) => {

  try {

    const res = await axios.post(`${API}/login`, udata);

    // لازم يكون فيه user

    if (!res.data?.user) {

      return thunkAPI.rejectWithValue({ message: res.data?.message || "Login failed" });

    }

    return res.data; // { user, message }

  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data || { message: "Login failed" });

  }

});
 
// ✅ Register

export const addUser = createAsyncThunk("users/register", async (udata, thunkAPI) => {

  try {

    const res = await axios.post(`${API}/register`, udata);

    return res.data; // { message }

  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data || { message: "Register failed" });

  }

});
 
export const updateProfile = createAsyncThunk("users/updateProfile", async (payload, thunkAPI) => {

  try {

    const res = await axios.put(`${API}/user/profile`, payload);

    return res.data; // { message, user }

  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data || { message: "Update profile failed" });

  }

});
 
export const changePassword = createAsyncThunk("users/changePassword", async (payload, thunkAPI) => {

  try {

    const res = await axios.put(`${API}/user/password`, payload);

    return res.data; // { message }

  } catch (error) {

    return thunkAPI.rejectWithValue(error.response?.data || { message: "Change password failed" });

  }

});
 
const initVal = {

  user: JSON.parse(localStorage.getItem("user") || "null"), // null أفضل من {}

  message: "",

  isLoading: false,

  isSuccess: false,

  isError: false,

};
 
const UserSlice = createSlice({

  name: "users",

  initialState: initVal,

  reducers: {

    logout: (state) => {

      state.user = null;

      state.message = "";

      state.isLoading = false;

      state.isSuccess = false;

      state.isError = false;

      localStorage.removeItem("user");

    },

    clearMessage: (state) => {

      state.message = "";

      state.isSuccess = false;

      state.isError = false;

    },

  },

  extraReducers: (builder) => {

    builder

      // register

      .addCase(addUser.pending, (state) => {

        state.isLoading = true;

        state.isSuccess = false;

        state.isError = false;

        state.message = "";

      })

      .addCase(addUser.fulfilled, (state, action) => {

        state.isLoading = false;

        state.isSuccess = true;

        state.message = action.payload?.message || "Registered ✅";

      })

      .addCase(addUser.rejected, (state, action) => {

        state.isLoading = false;

        state.isError = true;

        state.message = action.payload?.message || "Register failed";

      })
 
      // login

      .addCase(getUser.pending, (state) => {

        state.isLoading = true;

        state.isSuccess = false;

        state.isError = false;

        state.message = "";

      })

      .addCase(getUser.fulfilled, (state, action) => {

        state.isLoading = false;

        state.isSuccess = true;

        state.isError = false;

        state.message = action.payload?.message || "Success";

        state.user = action.payload?.user || null;

        localStorage.setItem("user", JSON.stringify(state.user));

      })

      .addCase(getUser.rejected, (state, action) => {

        state.isLoading = false;

        state.isSuccess = false;

        state.isError = true;

        state.user = null;

        state.message = action.payload?.message || "Login failed";

      })
 
      // updateProfile

      .addCase(updateProfile.pending, (state) => {

        state.isLoading = true;

        state.isSuccess = false;

        state.isError = false;

      })

      .addCase(updateProfile.fulfilled, (state, action) => {

        state.isLoading = false;

        state.isSuccess = true;

        state.message = action.payload?.message || "Profile updated ✅";

        state.user = action.payload?.user || state.user;

        localStorage.setItem("user", JSON.stringify(state.user));

      })

      .addCase(updateProfile.rejected, (state, action) => {

        state.isLoading = false;

        state.isError = true;

        state.message = action.payload?.message || "Update failed";

      })
 
      // changePassword

      .addCase(changePassword.pending, (state) => {

        state.isLoading = true;

        state.isSuccess = false;

        state.isError = false;

      })

      .addCase(changePassword.fulfilled, (state, action) => {

        state.isLoading = false;

        state.isSuccess = true;

        state.message = action.payload?.message || "Password changed ✅";

      })

      .addCase(changePassword.rejected, (state, action) => {

        state.isLoading = false;

        state.isError = true;

        state.message = action.payload?.message || "Password change failed";

      });

  },

});
 
export const { logout, clearMessage } = UserSlice.actions;

export default UserSlice.reducer;

 
