import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  shippingCost: 0,
  shippingLocation: "Cairo", // Default location
};

// Shipping pricing table (in EGP)
const SHIPPING_PRICES = {
  delivery: {
    Cairo: 80,
    Alexandria: 85,
    Delta: 91, // الدلتا والقناة
    UpperEgypt: 116, // الصعيد والبحر الأحمر
  },
  returnToSource: {
    Cairo: 70,
    Alexandria: 70,
    Delta: 70,
    UpperEgypt: 70,
  },
  customerReturns: {
    Cairo: 90,
    Alexandria: 90,
    Delta: 90,
    UpperEgypt: 90,
  },
  exchange: {
    Cairo: 95,
    Alexandria: 100,
    Delta: 106,
    UpperEgypt: 131,
  },
  lightPackages: {
    Cairo: 180,
    Alexandria: 185,
    Delta: 191,
    UpperEgypt: 216,
  },
  heavyPackages: {
    Cairo: 430,
    Alexandria: 480,
    Delta: 540,
    UpperEgypt: 790,
  },
};

// Map cities to regions
const CITY_TO_REGION = {
  // Cairo and Giza
  Cairo: "Cairo",
  Giza: "Cairo",

  // Alexandria
  Alexandria: "Alexandria",

  // Delta and Canal cities
  Dakahlia: "Delta",
  Sharqia: "Delta",
  Gharbia: "Delta",
  Monufia: "Delta",
  Qalyubia: "Delta",
  Ismailia: "Delta",
  Suez: "Delta",
  PortSaid: "Delta",
  Damietta: "Delta",
  Beheira: "Delta",
  KafrElSheikh: "Delta",

  // Upper Egypt and Red Sea
  Other: "UpperEgypt", // Default for other governorates
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem = {
          ...action.payload,
          quantity: 1,
          price:
            typeof action.payload.price === "string"
              ? parseFloat(action.payload.price)
              : action.payload.price,
        };
        state.items.push(newItem);
      }
      state.shippingCost = calculateShippingCost(
        state.items,
        state.shippingLocation
      );
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.shippingCost = calculateShippingCost(
        state.items,
        state.shippingLocation
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === id);
      if (item) {
        item.quantity = quantity;
      }
      state.shippingCost = calculateShippingCost(
        state.items,
        state.shippingLocation
      );
    },
    clearCart: (state) => {
      state.items = [];
      state.shippingCost = 0;
    },
    updateShippingLocation: (state, action) => {
      state.shippingLocation = action.payload;
      state.shippingCost = calculateShippingCost(state.items, action.payload);
    },
  },
});

// Helper function to calculate shipping cost based on items and location
function calculateShippingCost(items, location) {
  if (items.length === 0) return 0;

  const totalWeight = items.reduce((sum, item) => {
    // Estimate weight based on product type or use default
    const itemWeight = estimateItemWeight(item);
    return sum + itemWeight * item.quantity;
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Determine package type based on weight and quantity
  if (totalWeight > 5) {
    // Heavy packages (>5kg)
    return (
      SHIPPING_PRICES.heavyPackages[location] ||
      SHIPPING_PRICES.heavyPackages.Cairo
    );
  } else if (itemCount > 3 || totalWeight > 2) {
    // Light packages (multiple items or >2kg)
    return (
      SHIPPING_PRICES.lightPackages[location] ||
      SHIPPING_PRICES.lightPackages.Cairo
    );
  } else {
    // Standard delivery
    return SHIPPING_PRICES.delivery[location] || SHIPPING_PRICES.delivery.Cairo;
  }
}

// Helper function to estimate item weight (you can customize this per product)
function estimateItemWeight(item) {
  // Default weight estimates based on product categories
  const weightMap = {
    Keyboards: 1.2,
    Mice: 0.3,
    Headphones: 0.4,
    Cables: 0.2,
    Adapters: 0.1,
    Memory: 0.1,
    Storage: 0.3,
    Networking: 0.5,
    Accessories: 0.3,
    Gaming: 0.8,
    Cleaning: 0.4,
    Power: 0.6,
    Speakers: 1.5,
    Webcams: 0.4,
  };

  return weightMap[item.category] || 0.5; // Default 0.5kg for unknown categories
}

// Selectors
export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return sum + price * item.quantity;
  }, 0);

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export const selectShippingCost = (state) => state.cart.shippingCost;
export const selectShippingLocation = (state) => state.cart.shippingLocation;

export const selectCartTotalWithShipping = (state) =>
  selectCartTotal(state) + selectShippingCost(state);

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  updateShippingLocation,
} = cartSlice.actions;

export default cartSlice.reducer;
