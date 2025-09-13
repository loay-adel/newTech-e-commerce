import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import userReducer from "./slices/userSlice";
import wishlistReducer from "./slices/wishlistSlice";
import productsReducer from "./slices/productSlice";
import languageReducer from "./slices/languageSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
        language: languageReducer,
  },
});
