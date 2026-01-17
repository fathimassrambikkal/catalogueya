import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import favouritesReducer from "./favouritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
  },
});
