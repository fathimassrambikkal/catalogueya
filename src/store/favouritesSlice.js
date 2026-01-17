import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCustomerFavourites } from "../api";

// ==================== ASYNC: FETCH FAVOURITES ====================
export const fetchFavourites = createAsyncThunk(
  "favourites/fetch",
  async () => {
    const res = await getCustomerFavourites();
    return res.data?.groups || res.data?.data?.groups || [];
  }
);

// ==================== SOURCE MAP (NEW) ====================
// Stores productId -> source
const sourceMap = {};

const favouritesSlice = createSlice({
  name: "favourites",

  initialState: {
    // 👇 EXISTING (DO NOT TOUCH)
    items: [],            // guest favourites
    loading: false,

    // 👇 LOGIN + POPUP FLOW
    lists: [],            // lists from API (Fav.jsx)
    pendingProduct: null, // product clicked from ❤️
    showListPopup: false, // popup visibility

    // ✅ Active list
    activeList: null,
  },

  reducers: {
    // ==================== GUEST ====================
    toggleFavourite: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((fav) => fav.id === item.id);

      if (exists) {
        state.items = state.items.filter((fav) => fav.id !== item.id);
      } else {
        state.items.push(item);
      }
    },

    clearFavourites: (state) => {
      state.items = [];
    },

    // ==================== LOGIN FLOW ====================

    // 🔹 Sync lists from API
    setFavouriteLists: (state, action) => {
      // 🔥 RESTORE SOURCE INTO PRODUCTS
      state.lists = (action.payload || []).map((group) => ({
        ...group,
        products: (group.products || []).map((p) => ({
          ...p,
          source: p.source || sourceMap[p.id] || "category",
        })),
      }));
    },

    // ✅ Set active list
    setActiveFavouriteList: (state, action) => {
      state.activeList = action.payload;
    },

    // 🔹 Open popup (SAVE SOURCE HERE)
    openListPopup: (state, action) => {
      state.pendingProduct = action.payload;
      state.showListPopup = true;

      // 🔥 REMEMBER SOURCE
      if (action.payload?.id && action.payload?.source) {
        sourceMap[action.payload.id] = action.payload.source;
      }
    },

    // 🔹 Close popup
    closeListPopup: (state) => {
      state.pendingProduct = null;
      state.showListPopup = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })

      // ✅ API DATA → lists (with source restored)
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.lists = (action.payload || []).map((group) => ({
          ...group,
          products: (group.products || []).map((p) => ({
            ...p,
            source: p.source || sourceMap[p.id] || "category",
          })),
        }));
        state.loading = false;
      })

      .addCase(fetchFavourites.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ==================== EXPORTS ====================
export const {
  toggleFavourite,
  clearFavourites,

  setFavouriteLists,
  setActiveFavouriteList,
  openListPopup,
  closeListPopup,
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
