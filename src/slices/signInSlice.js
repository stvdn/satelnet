import { createSlice } from "@reduxjs/toolkit";

export const signInSlice = createSlice({
  name: "signIn",
  initialState: {
    signIn: false,
    userId: "",
    userData: {},
    verifiedUser: false,
  },
  reducers: {
    signIn: (state, action) => {
      state.signIn = action.payload.signIn;
      state.userId = action.payload.userId;
      state.userData = action.payload.userData;
      state.verifiedUser = action.payload.verifiedUser;
    },
  },
});

export const { signIn } = signInSlice.actions;

export default signInSlice.reducer;
