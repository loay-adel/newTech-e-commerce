// lib/redux/slices/productSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/products");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch products" }
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch product" }
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/slug/${slug}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch product" }
      );
    }
  }
);

// NEW: Fetch all categories
export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/products/categories");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch categories" }
      );
    }
  }
);

// NEW: Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      // Capitalize the first letter to match your database entries
      const cleanCategory =
        category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

      const response = await axios.get(
        `/api/products/category/${cleanCategory}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || {
          message: "Failed to fetch products by category",
        }
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    currentProduct: null,
    categories: [], // NEW: Array to store categories
    productsByCategory: [], // NEW: Array to store products filtered by category
    status: "idle",
    categoriesStatus: "idle", // NEW: Separate status for categories
    categoryProductsStatus: "idle", // NEW: Separate status for category products
    error: null,
    categoriesError: null, // NEW: Separate error for categories
    categoryProductsError: null, // NEW: Separate error for category products
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearProductsByCategory: (state) => {
      // NEW: Clear category products
      state.productsByCategory = [];
      state.categoryProductsStatus = "idle";
      state.categoryProductsError = null;
    },
    clearCategories: (state) => {
      // NEW: Clear categories
      state.categories = [];
      state.categoriesStatus = "idle";
      state.categoriesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error";
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error";
      })

      // Fetch product by slug
      .addCase(fetchProductBySlug.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error";
      })

      // NEW: Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.categoriesError = action.payload?.message || "Unknown error";
      })

      // NEW: Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.categoryProductsStatus = "loading";
        state.categoryProductsError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.categoryProductsStatus = "succeeded";
        state.productsByCategory = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.categoryProductsStatus = "failed";
        state.categoryProductsError =
          action.payload?.message || "Unknown error";
      });
  },
});

export const { clearCurrentProduct, clearProductsByCategory, clearCategories } =
  productSlice.actions;

export default productSlice.reducer;
