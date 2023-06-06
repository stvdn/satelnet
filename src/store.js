import { configureStore } from "@reduxjs/toolkit";
import signInReducer from "./slices/signInSlice";
import cartReducer from "./slices/cartSlice";

export default configureStore({
  reducer: {
    signIn: signInReducer,
    cart: cartReducer,
  },
  devTools: true,
});
