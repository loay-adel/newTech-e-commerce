// src/lib/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

// Auth utilities - Store token securely
const authStorage = {
  setToken: (token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },
  setUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  getUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      // Store token and user data
      authStorage.setToken(response.data.token);
      authStorage.setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
      });

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
      const response = await api.post("/api/users/register", {
        name,
        email,
        password,
        phone,
        addresses,
      });

      // Store token and user data
      authStorage.setToken(response.data.token);
      authStorage.setUser({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
      });

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
      const response = await api.get("/api/users/profile");
      // Update user data in storage
      authStorage.setUser({
        ...authStorage.getUser(),
        ...response.data,
      });
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
      const response = await api.put("/api/users/profile", userData);

      // Update user data in storage
      const updatedUser = {
        ...authStorage.getUser(),
        ...response.data,
      };
      authStorage.setUser(updatedUser);

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
      // Call backend logout endpoint
      await api.post("/api/users/logout");

      // Clear storage
      authStorage.clear();
      return null;
    } catch (error) {
      // Still clear storage even if API call fails
      authStorage.clear();
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/users/refresh-token");
      authStorage.setToken(response.data.token);
      return response.data;
    } catch (error) {
      authStorage.clear();
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

const initialState = {
  currentUser: authStorage.getUser(),
  token: authStorage.getToken(),
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
      };
      authStorage.setUser(state.currentUser);
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
      .addCase(getUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null;
        state.currentUser = null;
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

export const { clearError, updateUserData } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectToken = (state) => state.user.token;
export const selectAuthStatus = (state) => state.user.status;
export const selectAuthError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => !!state.user.token;

export default userSlice.reducer;
