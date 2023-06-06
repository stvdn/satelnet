import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.products.push(action.payload);
    },
    updateProductQuantity: (state, action) => {
      state.products[action.payload.index].quantity += action.payload.change;
    },
    removeProductCart: (state, action) => {
      state.products.pop(action.payload);
    },
    cleanCart: (state, action) => {
      state.products = [];
    },
  },
});

export const {
  addToCart,
  updateProductQuantity,
  removeProductCart,
  cleanCart,
} = cartSlice.actions;

export default cartSlice.reducer;
