import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 
const API = "https://ontheway8.onrender.com";
 
// ✅ Login
export const getUser = createAsyncThunk("users/login", async (udata, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/login`, udata);
    if (!res.data?.user) {
      return thunkAPI.rejectWithValue({ message: res.data?.message || "Login failed" });
    }
    return res.data; // { user, message }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Login failed" });
  }
});
 
// ✅ Get user from /getUser (بدون أي باراميتر)
export const fetchUser = createAsyncThunk("users/fetchUser", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/getUser`);
    return res.data; // { user }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Fetch user failed" });
  }
});
 
// ✅ Register
export const addUser = createAsyncThunk("users/register", async (udata, thunkAPI) => {
  try {
    const res = await axios.post(`${API}/register`, udata);
    return res.data; // { message }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Register failed" });
  }
});
 
const initVal = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
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
      // login
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
 
      // fetchUser (/getUser)
      .addCase(fetchUser.pending, (s) => {
        s.isLoading = true;
        s.isError = false;
        s.isSuccess = false;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.isLoading = false;
        s.isSuccess = true;
        s.user = a.payload.user;
        localStorage.setItem("user", JSON.stringify(s.user));
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.isLoading = false;
        s.isError = true;
        s.message = a.payload?.message || "Fetch user failed";
      });
  },
});
 
export const { logout, clearMessage } = UserSlice.actions;
export default UserSlice.reducer;
