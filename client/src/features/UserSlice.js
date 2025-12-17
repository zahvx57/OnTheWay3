import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Login
export const getUser = createAsyncThunk(
  "users/getUser",
  async (udata, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:5000/login", udata);
      return response.data; // { user, message }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

// ✅ Register
export const addUser = createAsyncThunk(
  "users/addUser",
  async (udata, thunkAPI) => {
    try {
      const response = await axios.post("http://localhost:5000/register", udata);
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Register failed" }
      );
    }
  }
);

// ✅ Update profile (يستخدم endpoint الموجود عندك)
export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async (payload, thunkAPI) => {
    try {
      // payload: { currentEmail, uname, pic }
      const res = await axios.put("http://localhost:5000/user/profile", payload);
      return res.data; // { message, user }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Update profile failed" }
      );
    }
  }
);

// ✅ Change password (يستخدم endpoint الموجود عندك)
export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (payload, thunkAPI) => {
    try {
      // payload: { email, currentPassword, newPassword }
      const res = await axios.put("http://localhost:5000/user/password", payload);
      return res.data; // { message }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Change password failed" }
      );
    }
  }
);

const initVal = {
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const UserSlice = createSlice({
  name: "users",
  initialState: initVal,
  reducers: {
    logout: (state) => {
      state.user = {};
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
      // addUser
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Register failed";
      })

      // getUser
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "";
        state.user = action.payload?.user || {};
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
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
