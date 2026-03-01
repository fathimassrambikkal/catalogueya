import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import favouritesReducer from "./favouritesSlice";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // ✅ ONLY auth slice will persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);