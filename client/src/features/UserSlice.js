// src/features/UserSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
 
const API = "https://ontheway10.onrender.com";
 
// =====================

// ✅ Login

// =====================

export const getUser = createAsyncThunk("users/login", async (udata, thunkAPI) => {

  try {

    const res = await axios.post(`${API}/login`, udata);
 
    if (!res.data?.user) {

      return thunkAPI.rejectWithValue({

        message: res.data?.message || "Login failed",

      });

    }
 
    return res.data; // { user, message }

  } catch (err) {

    return thunkAPI.rejectWithValue(err.response?.data || { message: "Login failed" });

  }

});
 
// =====================

// ✅ Register

// =====================

export const addUser = createAsyncThunk("users/register", async (udata, thunkAPI) => {

  try {

    const res = await axios.post(`${API}/register`, udata);

    return res.data; // { message }

  } catch (err) {

    return thunkAPI.rejectWithValue(err.response?.data || { message: "Register failed" });

  }

});
 
// =====================

// ✅ Get ALL Users

// ✅ /getUsers بدون token وبدون parameters

// =====================

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, thunkAPI) => {

  try {

    const res = await axios.get(`${API}/getUsers`);

    return res.data; // { users }

  } catch (err) {

    return thunkAPI.rejectWithValue(err.response?.data || { message: "Fetch users failed" });

  }

});
 
// =====================

// ✅ Initial State

// =====================

const initVal = {

  // current logged in user

  user: JSON.parse(localStorage.getItem("user") || "null"),
 
  // all users list

  users: [],
 
  message: "",

  isLoading: false,

  isSuccess: false,

  isError: false,

};
 
// =====================

// ✅ Slice

// =====================

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

    // ✅ لو تحب تضبط current user يدويًا (اختياري)

    setCurrentUser: (state, action) => {

      state.user = action.payload || null;

      if (state.user) localStorage.setItem("user", JSON.stringify(state.user));

      else localStorage.removeItem("user");

    },

  },

  extraReducers: (builder) => {

    builder

      // =====================

      // ✅ login

      // =====================

      .addCase(getUser.pending, (s) => {

        s.isLoading = true;

        s.isError = false;

        s.isSuccess = false;

        s.message = "";

      })

      .addCase(getUser.fulfilled, (s, a) => {

        s.isLoading = false;

        s.isSuccess = true;

        s.user = a.payload.user;

        s.message = a.payload.message || "Success";

        localStorage.setItem("user", JSON.stringify(s.user));

      })

      .addCase(getUser.rejected, (s, a) => {

        s.isLoading = false;

        s.isError = true;

        s.user = null;

        s.message = a.payload?.message || "Login failed";

      })
 
      // =====================

      // ✅ register

      // =====================

      .addCase(addUser.pending, (s) => {

        s.isLoading = true;

        s.isError = false;

        s.isSuccess = false;

        s.message = "";

      })

      .addCase(addUser.fulfilled, (s, a) => {

        s.isLoading = false;

        s.isSuccess = true;

        s.message = a.payload?.message || "Registered successfully";

      })

      .addCase(addUser.rejected, (s, a) => {

        s.isLoading = false;

        s.isError = true;

        s.message = a.payload?.message || "Register failed";

      })
 
      // =====================

      // ✅ fetch all users

      // =====================

      .addCase(fetchUsers.pending, (s) => {

        s.isLoading = true;

        s.isError = false;

        s.isSuccess = false;

        s.message = "";

      })

      .addCase(fetchUsers.fulfilled, (s, a) => {

        s.isLoading = false;

        s.isSuccess = true;

        s.users = a.payload?.users || [];

      })

      .addCase(fetchUsers.rejected, (s, a) => {

        s.isLoading = false;

        s.isError = true;

        s.message = a.payload?.message || "Fetch users failed";

      });

  },

});
 
export const { logout, clearMessage, setCurrentUser } = UserSlice.actions;

export default UserSlice.reducer;

 
