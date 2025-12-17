import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://ontheway10.onrender.com";

export const fetchPlaces = createAsyncThunk("places/fetch", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/getPlaces`);
    return res.data; // { places }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Fetch places failed" });
  }
});

export const addPlace = createAsyncThunk("places/add", async (payload, thunkAPI) => {
  try {
    // payload: { name, adminFlag }
    const res = await axios.post(`${API}/addPlace`, payload);
    return res.data; // { message, places }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Add place failed" });
  }
});

export const togglePlace = createAsyncThunk("places/toggle", async (payload, thunkAPI) => {
  try {
    // payload: { id, adminFlag }
    const res = await axios.put(`${API}/togglePlace/${payload.id}`, { adminFlag: payload.adminFlag });
    return res.data; // { message, places }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Toggle place failed" });
  }
});

export const deletePlace = createAsyncThunk("places/delete", async (payload, thunkAPI) => {
  try {
    // payload: { id, adminFlag }
    const res = await axios.delete(`${API}/deletePlace/${payload.id}`, {
      data: { adminFlag: payload.adminFlag },
    });
    return res.data; // { message, places }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || { message: "Delete place failed" });
  }
});

const PlacesSlice = createSlice({
  name: "places",
  initialState: {
    places: [],
    isLoading: false,
    isError: false,
    message: "",
  },
  reducers: {
    clearPlacesMessage: (s) => {
      s.message = "";
      s.isError = false;
    },
  },
  extraReducers: (b) => {
    const pending = (s) => {
      s.isLoading = true;
      s.isError = false;
      s.message = "";
    };
    const rejected = (s, a) => {
      s.isLoading = false;
      s.isError = true;
      s.message = a.payload?.message || "Error";
    };

    b.addCase(fetchPlaces.pending, pending);
    b.addCase(fetchPlaces.fulfilled, (s, a) => {
      s.isLoading = false;
      s.places = a.payload?.places || [];
    });
    b.addCase(fetchPlaces.rejected, rejected);

    b.addCase(addPlace.pending, pending);
    b.addCase(addPlace.fulfilled, (s, a) => {
      s.isLoading = false;
      s.message = a.payload?.message || "Added";
      s.places = a.payload?.places || [];
    });
    b.addCase(addPlace.rejected, rejected);

    b.addCase(togglePlace.pending, pending);
    b.addCase(togglePlace.fulfilled, (s, a) => {
      s.isLoading = false;
      s.message = a.payload?.message || "Updated";
      s.places = a.payload?.places || [];
    });
    b.addCase(togglePlace.rejected, rejected);

    b.addCase(deletePlace.pending, pending);
    b.addCase(deletePlace.fulfilled, (s, a) => {
      s.isLoading = false;
      s.message = a.payload?.message || "Deleted";
      s.places = a.payload?.places || [];
    });
    b.addCase(deletePlace.rejected, rejected);
  },
});

export const { clearPlacesMessage } = PlacesSlice.actions;
export default PlacesSlice.reducer;
