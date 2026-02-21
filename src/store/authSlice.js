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
    updateProfile: (state, action) => {
      state.user = { 
        ...state.user, 
        ...action.payload,
        // Ensure name-related fields are synced for getDisplayName
        name: action.payload.name || action.payload.companyName || action.payload.company_name || state.user?.name,
        company_name: action.payload.name || action.payload.companyName || action.payload.company_name || state.user?.company_name,
        companyName: action.payload.name || action.payload.companyName || action.payload.company_name || state.user?.companyName
      };
    },
  },
});

export const { loginSuccess, logout, setCustomerTab, updateProfile } = authSlice.actions;
export default authSlice.reducer;
