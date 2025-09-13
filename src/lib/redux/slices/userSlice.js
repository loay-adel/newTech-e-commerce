// lib/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/api";

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      // Store only token in localStorage
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async ({ name, email, password, phone, addresses }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users/register", {
        name,
        email,
        password,
        phone,
        addresses,
      });

      // Store only token in localStorage
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const getUserProfile = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/users/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/users/profile", userData);

      // Update localStorage if needed
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...currentUser,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        })
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const initialState = {
  currentUser: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  status: "idle",
  error: null,
};

// Check if user is already logged in
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    initialState.currentUser = JSON.parse(user);
    initialState.token = token;
  }
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentUser = null;
        state.token = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
        };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.currentUser = null;
        state.token = null;
      })
      // Get Profile
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { clearError } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectAuthStatus = (state) => state.user.status;
export const selectAuthError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => !!state.user.token;

export default userSlice.reducer;
