import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userType: null,
    isAuthenticated: false,
    customerActiveTab: "messages", 
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      state.customerActiveTab = "messages";
    },
    setCustomerTab: (state, action) => {
      state.customerActiveTab = action.payload;
    },
  },
});

export const { loginSuccess, logout, setCustomerTab } = authSlice.actions;
export default authSlice.reducer;
