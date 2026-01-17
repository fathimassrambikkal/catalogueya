import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resolveProductRoute } from "../utils/productNavigation";
import {
  setFavouriteLists,
  setActiveFavouriteList,
} from "../store/favouritesSlice";
import {
  getCustomerFavourites,
  createFavoriteGroup,
  deleteFavoriteGroup,
  editFavoriteGroup,
  removeFromFavorite,
} from "../api";

function Fav() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const lists = useSelector((state) => state.favourites.lists);

  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const [editModal, setEditModal] = useState({
    isOpen: false,
    list: null,
    newName: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    list: null,
  });

  // Base URL for images
  const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

  // Default favorites list - defined as constant
  const DEFAULT_FAVORITES_LIST = {
    id: "default-favorites",
    name: "My Favourites",
    products: [],
    itemCount: 0,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // ================= ICON COMPONENTS =================
  const ShareIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M8 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" strokeLinecap="round" />
    </svg>
  );

  const EditIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4h8v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );

  const RefreshIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );

  const SmallDeleteIcon = () => (
    <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
    </svg>
  );

  // ================= INITIAL LOAD =================
  useEffect(() => {
    const initializeData = async () => {
      // Set default list immediately - NO DELAY
      if (!lists.length || !lists.some(list => list.isDefault)) {
        dispatch(setFavouriteLists([DEFAULT_FAVORITES_LIST]));
        dispatch(setActiveFavouriteList(DEFAULT_FAVORITES_LIST));
      }
      setIsInitializing(false);
      
      // Then fetch fresh data in background if user exists
      if (currentUser) {
        fetchAllFavourites();
      }
    };

    initializeData();
  }, [currentUser]);

  // ================= FETCH ALL FAVOURITES =================
  const fetchAllFavourites = async () => {
    if (!currentUser) {
      console.log("❌ No current user, skipping fetch");
      return;
    }

    console.log("🔄 Fetching favourites for user:", currentUser.id);

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token exists:", !!token);
      
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getCustomerFavourites();
      console.log("✅ Favourites API Response:", response);
      
      if (!response.data) {
        throw new Error("No data returned from API");
      }

      // Extract groups from response
      const groups = response.data?.groups || response.data?.data?.groups || [];
      console.log("📊 Extracted groups:", groups);
      
      // Format groups with products count
      const formattedGroups = groups.map(group => ({
        id: group.id,
        name: group.name,
        products: group.products || [],
        itemCount: group.products?.length || 0,
        createdAt: group.created_at || group.createdAt,
        updatedAt: group.updated_at || group.updatedAt,
        isDefault: false
      }));

      console.log("📋 Formatted Groups:", formattedGroups);
      
      // Combine default list with user-created lists
      const currentLists = lists.filter(list => list.isDefault);
      const allLists = [...currentLists, ...formattedGroups];
      dispatch(setFavouriteLists(allLists));
      setError(null);
    } catch (err) {
      console.error("❌ Fetch favourites failed:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Failed to sync your favorites.";
      setError(errorMessage);
      
      // Keep existing data, just show error notification
      setTimeout(() => setError(null), 3000); // Auto-hide error after 3s
    }
  };

  // ================= CREATE =================
  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newList = {
      id: tempId,
      name: newListName.trim(),
      products: [],
      itemCount: 0,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true // Mark as optimistic update
    };

    // Immediate UI update
    const defaultList = lists.find(list => list.isDefault) || DEFAULT_FAVORITES_LIST;
    const otherLists = lists.filter(list => !list.isDefault);
    const updatedLists = [defaultList, newList, ...otherLists];
    dispatch(setFavouriteLists(updatedLists));
    setNewListName("");
    setIsCreating(false);

    // Background API call
    try {
      console.log("🟡 Creating list:", newListName);
      const response = await createFavoriteGroup(newListName.trim());
      
      // Update with real ID from server
      const finalLists = updatedLists.map(list => {
        if (list.id === tempId) {
          return {
            ...list,
            id: response.data?.id || response.data?.data?.id,
            isOptimistic: false
          };
        }
        return list;
      });
      dispatch(setFavouriteLists(finalLists));
    } catch (err) {
      console.error("❌ Create group failed:", err);
      // Rollback on error
      const rolledBackLists = updatedLists.filter(list => list.id !== tempId);
      dispatch(setFavouriteLists(rolledBackLists));
      alert(`Failed to create list: ${err?.response?.data?.message || err.message}`);
    }
  };

  // ================= DELETE =================
  const handleDeleteList = async () => {
    if (!deleteModal.list?.id || deleteModal.list?.isDefault) return;

    console.log("🗑 Deleting group id:", deleteModal.list.id);

    // Store deleted list for potential rollback
    const deletedList = deleteModal.list;
    
    // Immediate UI update
    const updatedLists = lists.filter(list => list.id !== deleteModal.list.id);
    dispatch(setFavouriteLists(updatedLists));
    setDeleteModal({ isOpen: false, list: null });
    
    // Background API call
    try {
      await deleteFavoriteGroup(deletedList.id);
      console.log("🗑 Delete successful");
    } catch (err) {
      console.error("❌ Delete group failed:", err);
      // Rollback on error
      dispatch(setFavouriteLists([...updatedLists, deletedList]));
      alert(`Failed to delete: ${err?.response?.data?.message || err.message}`);
    }
  };

  // ================= EDIT =================
  const handleEditList = async () => {
    if (!editModal.list?.id || !editModal.newName.trim() || editModal.list?.isDefault) return;

    const oldName = editModal.list.name;
    
    // Immediate UI update
    const updatedLists = lists.map(list => 
      list.id === editModal.list.id 
        ? { ...list, name: editModal.newName.trim(), isOptimistic: true }
        : list
    );
    dispatch(setFavouriteLists(updatedLists));
    setEditModal({ isOpen: false, list: null, newName: "" });

    // Background API call
    try {
      console.log("✏️ Editing list:", editModal.list.id, "to:", editModal.newName);
      await editFavoriteGroup(editModal.list.id, editModal.newName.trim());
      
      // Remove optimistic flag
      const finalLists = lists.map(list => 
        list.id === editModal.list.id 
          ? { ...list, name: editModal.newName.trim(), isOptimistic: false }
          : list
      );
      dispatch(setFavouriteLists(finalLists));
    } catch (err) {
      console.error("❌ Edit group failed:", err);
      // Rollback on error
      const rolledBackLists = lists.map(list => 
        list.id === editModal.list.id 
          ? { ...list, name: oldName, isOptimistic: false }
          : list
      );
      dispatch(setFavouriteLists(rolledBackLists));
      alert(`Failed to edit: ${err?.response?.data?.message || err.message}`);
    }
  };

  // ================= REMOVE PRODUCT FROM LIST =================
  const handleRemoveProduct = async (productId, listId) => {
    if (!productId || !listId) return;

    // Store removed product for potential rollback
    const listToUpdate = lists.find(list => list.id === listId);
    const productToRemove = listToUpdate?.products.find(p => p.id === productId);
    
    // Immediate UI update
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedProducts = list.products.filter(p => p.id !== productId);
        return {
          ...list,
          products: updatedProducts,
          itemCount: updatedProducts.length
        };
      }
      return list;
    });
    dispatch(setFavouriteLists(updatedLists));
    
    // Background API call
    try {
      await removeFromFavorite(productId);
      console.log("✅ Product removed successfully");
    } catch (err) {
      console.error("❌ Remove product failed:", err);
      // Rollback on error
      const rolledBackLists = lists.map(list => {
        if (list.id === listId && productToRemove) {
          return {
            ...list,
            products: [...list.products, productToRemove],
            itemCount: list.products.length + 1
          };
        }
        return list;
      });
      dispatch(setFavouriteLists(rolledBackLists));
      alert(`Failed to remove: ${err?.response?.data?.message || err.message}`);
    }
  };

  // ================= SHARE =================
  const handleShare = async (list) => {
    const text = `Check out my list "${list.name}" with ${list.itemCount} items!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: list.name,
          text,
        });
      } catch {
        // user cancelled → ignore
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("List information copied to clipboard!");
    }
  };

  // ================= REFRESH BUTTON =================
  const handleRefresh = () => {
    fetchAllFavourites();
  };

  // ================= GET IMAGE URL =================
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE_URL}/${imgPath}`;
  };

  const handleNavigate = (product) => {
    navigate(
      resolveProductRoute({
        ...product,
        source: product.source || "favourites",
      })
    );
  };

  // ================= ERROR NOTIFICATION =================
  const ErrorNotification = () => {
    if (!error) return null;
    
    return (
      <div className="fixed top-4 right-4 z-50 animate-slideIn">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 shadow-lg max-w-xs sm:max-w-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-sm">⚠️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-1 text-xs text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER LIST CARD =================
  const renderListCard = (list) => {
    const displayAllProducts = list.products.length > 4;
    
    return (
      <div
        key={list.id}
        className={`flex flex-col sm:flex-row items-stretch sm:items-start justify-between p-3 sm:p-4 md:p-6 rounded-2xl mb-3 sm:mb-4 transition-all duration-200
        bg-white/80 backdrop-blur-lg border ${list.isOptimistic ? 'border-yellow-200/60' : 'border-gray-200/60'}
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
        hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
        hover:border-blue-200/60  w-full overflow-hidden max-w-full
        ${list.isOptimistic ? 'opacity-90' : ''}`}
      >
        {list.isOptimistic && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        )}
        
        {/* Content area */}
        <div className="flex-1 min-w-0 mb-3 sm:mb-0 sm:mr-4 overflow-hidden">
          {/* List header with name and action buttons inline */}
          <div className="flex flex-row items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg break-words leading-tight">
                {list.name}
              </h3>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2 sm:ml-4">
              {/* Share - Disabled for default list */}
              <button
                onClick={() => !list.isDefault && handleShare(list)}
                disabled={list.isDefault || list.isOptimistic}
                title={list.isDefault ? "Cannot share default list" : "Share"}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl
                bg-white/80 border border-gray-200
                flex items-center justify-center transition
                ${
                  list.isDefault || list.isOptimistic
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                }`}
              >
                <ShareIcon />
              </button>

              {/* Edit - Disabled for default list */}
              <button
                onClick={() => !list.isDefault && setEditModal({ isOpen: true, list, newName: list.name })}
                disabled={list.isDefault || list.isOptimistic}
                title={list.isDefault ? "Cannot edit default list" : "Edit"}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl
                bg-white/80 border border-gray-200
                flex items-center justify-center transition
                ${
                  list.isDefault || list.isOptimistic
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <EditIcon />
              </button>

              {/* Delete List - Disabled for default list */}
              <button
                onClick={() => !list.isDefault && setDeleteModal({ isOpen: true, list })}
                disabled={list.isDefault || list.isOptimistic}
                title={list.isDefault ? "Cannot delete default list" : "Delete List"}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl
                bg-white/80 border border-gray-200
                flex items-center justify-center transition
                ${
                  list.isDefault || list.isOptimistic
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          
          {/* Product preview */}
          {list.products && list.products.length > 0 && (
            <div className="mt-2 sm:mt-3">
              {!displayAllProducts ? (
                // When 4 or fewer products: show in a row
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {list.products.map((product, index) => {
                    const imageUrl = getImageUrl(product.image);
                    return (
                      <div key={index} className="relative group">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            onClick={() => handleNavigate(product)}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover cursor-pointer
                                     hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 
                                          flex items-center justify-center">
                            <span className="text-gray-400 text-xs">📷</span>
                          </div>
                        )}

                        {/* Remove button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(product.id, list.id);
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white rounded-full 
                                   flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                          title="Remove from list"
                        >
                          <SmallDeleteIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // When more than 4 products: show ALL in wrapped rows
                <div className="flex flex-wrap gap-2">
                  {list.products.map((product, index) => {
                    const imageUrl = getImageUrl(product.image);
                    return (
                      <div key={index} className="relative">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product.name}
                            onClick={() => handleNavigate(product)}
                            className="
                              w-14 h-14 sm:w-16 sm:h-16
                              rounded-lg object-cover cursor-pointer
                              hover:scale-105 transition-transform
                            "
                          />
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">📷</span>
                          </div>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(product.id, list.id);
                          }}
                          className="
                            absolute -top-1 -right-1
                            w-4 h-4 sm:w-5 sm:h-5
                            bg-red-500 text-white rounded-full
                            flex items-center justify-center
                            hover:bg-red-600 transition-colors
                            shadow-sm
                          "
                        >
                          <SmallDeleteIcon />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ================= RENDER CREATE LIST FORM =================
  const renderCreateListForm = () => (
    <div className="p-3 sm:p-4 md:p-6 rounded-2xl mb-3 sm:mb-4 transition-all duration-200
      bg-white/80 backdrop-blur-lg border border-blue-200/60
      shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)] w-full overflow-hidden max-w-full">
      <h3 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 break-words">
        Create New List
      </h3>

      <div className="flex flex-col gap-2 sm:gap-3 w-full max-w-full overflow-hidden">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="Enter list name..."
          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200/60 bg-white/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]
          focus:outline-none focus:border-blue-300 placeholder-gray-400 text-sm sm:text-base"
        />

        <div className="flex gap-2 sm:gap-3 w-full max-w-full">
          <button
            onClick={handleCreateList}
            disabled={!newListName.trim()}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200
            shadow-[3px_3px_10px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Create
          </button>

          <button
            onClick={() => {
              setIsCreating(false);
              setNewListName("");
            }}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white/80 border border-gray-200/60 text-gray-600
            hover:text-red-500 transition-all duration-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)] text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Separate default list and user lists
  const defaultList = lists.find(list => list.isDefault) || DEFAULT_FAVORITES_LIST;
  const userLists = lists.filter(list => !list.isDefault);

  return (
    <>
      <ErrorNotification />
      
      <div className="min-h-full p-3 sm:p-4 md:p-6 overflow-x-hidden w-full max-w-full">
        <div className="w-full max-w-full mx-auto mt-10 overflow-hidden">
          <div className="flex flex-col items-center mb-4 sm:mb-6 gap-2">
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 text-center">
              My Favorites Lists
            </h1>
          </div>

          <div className="space-y-3 sm:space-y-4 w-full max-w-full overflow-hidden">
            {/* Always show the default list first */}
            {defaultList && renderListCard(defaultList)}
            
            {/* Create New List Button or Form - placed right after default list */}
            {isCreating ? (
              renderCreateListForm()
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full p-3 sm:p-4 md:p-6 rounded-2xl cursor-pointer bg-white/60 backdrop-blur-lg border 
                border-gray-200/50 border-dashed hover:border-blue-200/60 hover:scale-[1.01] sm:hover:scale-[1.02] transition-all
                shadow-[inset_1px_1px_2px rgba(255,255,255,0.8)] max-w-full overflow-hidden"
              >
                <div className="flex items-center justify-center">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 6v12" />
                      <path d="M6 12h12" />
                    </svg>
                  </div>

                  <span className="text-blue-500 font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap">
                    Create a New List
                  </span>
                </div>
              </button>
            )}

            {/* Then show user-created lists below the create button */}
            {userLists.map(renderListCard)}
          </div>

          {/* Edit Modal */}
          {editModal.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm mx-auto overflow-hidden">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Edit List</h3>
                  <input
                    type="text"
                    value={editModal.newName}
                    onChange={(e) => setEditModal(prev => ({ ...prev, newName: e.target.value }))}
                    className="w-full p-2 sm:p-3 border rounded-lg mb-3 sm:mb-4 text-sm sm:text-base"
                    placeholder="Enter new list name"
                  />
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleEditList}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditModal({ isOpen: false, list: null, newName: "" })}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteModal.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 w-full max-w-xs sm:max-w-sm mx-auto overflow-hidden">
                <div className="text-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Delete List</h3>
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base">Are you sure you want to delete "{deleteModal.list?.name}"?</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    This will remove {deleteModal.list?.itemCount || 0} items from this list.
                  </p>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleDeleteList}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => setDeleteModal({ isOpen: false, list: null })}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Fav;