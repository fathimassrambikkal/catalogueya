import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  closeListPopup,
  setFavouriteLists,
} from "../store/favouritesSlice";
import {
  getFavoriteGroups,
  addProductToFavorite,
  createFavoriteGroup,
  deleteFavoriteGroup,
} from "../api";
import { useTranslation } from "react-i18next";

// ✅ normalize backend response
const normalizeGroups = (response) => {
  return Array.isArray(response?.data?.groups)
    ? response.data.groups
    : [];
};

// ✅ Blue + White Success Toast (theme-safe)
const BlueSuccessToast = ({ message, onClose }) => {
  const [isMounted, setIsMounted] = useState(true);
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(false);
      setTimeout(onClose, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed top-4 sm:top-6 inset-x-0 flex justify-center z-[1000] pointer-events-none px-4"
    >
      <div
        className={`
          bg-white/80
          text-gray-900
          rounded-xl
          border border-gray-200/60
          shadow-[0_4px_16px_rgba(0,0,0,0.08)]
          sm:rounded-2xl
        
          px-4 py-3 sm:px-5 sm:py-3.5
          backdrop-blur-xl
          flex items-center gap-3
          transition-all duration-300 ease-out
          ${isRTL ? "flex-row-reverse text-right" : "flex-row text-left"}
          ${isMounted
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-[-12px] opacity-0 scale-95"}
        `}
      >
        {/* Icon */}
        <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            dir="ltr"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Text */}
        <span className="text-sm font-semibold tracking-tight truncate">
          {message}
        </span>
      </div>
    </div>
  );
};



export default function AddToListPopup() {
  const dispatch = useDispatch();

  const { showListPopup, pendingProduct, lists } = useSelector(
    (state) => state.favourites
  );
  const isLoggedIn = useSelector((state) => !!state.auth.user);
const { i18n } = useTranslation();

  const [selectedList, setSelectedList] = useState(null);
  const [sending, setSending] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [deletingList, setDeletingList] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ✅ Normalize redux lists safely
  const safeLists = useMemo(() => {
    if (Array.isArray(lists)) return lists;
    if (Array.isArray(lists?.groups)) return lists.groups;
    return [];
  }, [lists]);

  // ================= LOAD GROUPS FROM API =================
  useEffect(() => {
    if (!showListPopup || !isLoggedIn) return;

    // reset states every popup open
    setSelectedList(null);
    setIsClosing(false);
    setShowSuccessToast(false);
    setIsCreating(false);
    setNewListName("");
    setDeleteError(null);

    getFavoriteGroups()
      .then((res) => {
        const groups = normalizeGroups(res);
        dispatch(setFavouriteLists(groups));
      })
      .catch((err) =>
        console.error("❌ Failed to load favourite groups", err)
      );
  }, [showListPopup, isLoggedIn, dispatch]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showListPopup) {
        if (isCreating) {
          setIsCreating(false);
          setNewListName("");
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showListPopup, isCreating]);

  // ================= CLOSE HANDLER =================
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      dispatch(closeListPopup());
    }, 200);
  }, [dispatch]);

  // ================= CREATE NEW LIST =================
  const handleCreateList = async () => {
    if (!newListName.trim() || creatingList) return;

    try {
      setCreatingList(true);

      await createFavoriteGroup(newListName.trim());
      
      // Refresh lists
      const res = await getFavoriteGroups();
      const groups = normalizeGroups(res);
      dispatch(setFavouriteLists(groups));
      
      // Reset creation state
      setNewListName("");
      setIsCreating(false);
      
      // Show success message
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 1500);

    } catch (err) {
      console.error("❌ Create list failed", err);
      // Only show alert for sending (as requested)
    } finally {
      setCreatingList(false);
    }
  };

  // ================= DELETE LIST =================
  const handleDeleteList = async (list) => {
    if (!list?.id || deletingList) return;

    try {
      setDeletingList(true);
      setDeleteError(null);

      // Show immediate UI update
      const updatedLists = safeLists.filter(l => l.id !== list.id);
      dispatch(setFavouriteLists(updatedLists));
      
      // Make API call
      await deleteFavoriteGroup(list.id);
      
      // If the deleted list was selected, clear selection
      if (selectedList?.id === list.id) {
        setSelectedList(null);
      }
      
      // Show success message
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 1500);

    } catch (err) {
      console.error("❌ Delete list failed:", err);
      setDeleteError(err?.response?.data?.message || "Failed to delete list");
      // Refresh lists from server on error
      const res = await getFavoriteGroups();
      const groups = normalizeGroups(res);
      dispatch(setFavouriteLists(groups));
    } finally {
      setDeletingList(false);
    }
  };

  // ================= SEND PRODUCT =================
  const handleSend = async () => {
    if (!selectedList) return;

    try {
      setSending(true);

      await addProductToFavorite(
        pendingProduct.id,
        selectedList.id
      );

      // Show success toast with the list name
      setShowSuccessToast(true);
      
      // 🔁 re-fetch groups so Redux stays in sync
      const res = await getFavoriteGroups();
      const groups = normalizeGroups(res);
      dispatch(setFavouriteLists(groups));
      
      // Close popup after a short delay
      setTimeout(() => {
        handleClose();
      }, 100);

    } catch (err) {
      console.error("❌ Add to favourite failed", err);
      // Show alert only for sending (as requested)
      alert(`Failed to add to list: ${err?.response?.data?.message || err.message}`);
    } finally {
      setSending(false);
    }
  };

  // Prevent backdrop click from closing when in create mode
  const handleBackdropClick = (e) => {
    if (isCreating) {
      // Don't close on backdrop click when in create mode
      e.stopPropagation();
    } else {
      handleClose();
    }
  };

  // 🚫 render guard AFTER hooks
  if (!isLoggedIn || !showListPopup || !pendingProduct) return null;


  

  return (
    <>
      {/* Backdrop with click to close */}
      <div 
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] sm:backdrop-blur-[2px]"
        onClick={handleBackdropClick}
      />

      {/* Success Toast */}
      {showSuccessToast && (
  <BlueSuccessToast
    message={
      selectedList
        ? `Added to "${selectedList.name}"`
        : "List deleted successfully"
    }
    onClose={() => setShowSuccessToast(false)}
  />
)}


      {/* Popup - Responsive positioning */}
      <div dir="ltr" className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-6 md:pt-8 px-3 sm:px-4 overflow-y-auto">
        {/* Consistent max-width on all devices */}
        <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[400px] mx-2">
          {/* Glass Morphism Card with animation */}
          <div
            className={`
              bg-gradient-to-b from-white/97 to-white/93
              rounded-xl sm:rounded-2xl md:rounded-[24px]
              shadow-[0_10px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.4)]
              sm:shadow-[0_20px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.4)]
              overflow-hidden
              backdrop-blur-xl
              border border-white/60
              transition-all duration-300 ease-out
              ${isClosing 
                ? "opacity-0 scale-95 translate-y-[-8px] sm:translate-y-[-10px]" 
                : "opacity-100 scale-100 translate-y-0"
              }
            `}
          >
            {/* Header with subtle gradient */}
            <div className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-4 md:pb-5 border-b border-white/40">
              <div className="flex flex-col items-center">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-center tracking-[-0.02em]">
                  {isCreating ? "Create New List" : "Add to Favourites"}
                </h3>
               
              </div>
            </div>

            {/* Lists Container with smooth scroll */}
            <div className="p-4 sm:p-5 md:p-6"  dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              {isCreating ? (
                // CREATE LIST FORM
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      List Name
                    </label>
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Enter list name..."
                      className="
                        w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-4 md:py-3.5
                        rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        border border-gray-300/80
                        bg-white/80
                        text-sm text-gray-900
                        placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                        transition-all duration-200
                        disabled:opacity-60 disabled:cursor-not-allowed
                      "
                      disabled={creatingList}
                      onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                    />
                  </div>

                  {/* Actions buttons for create form */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <button
                      onClick={() => setIsCreating(false)}
                      disabled={creatingList}
                      className="
                        py-2.5 sm:py-3 md:py-3.5 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        bg-gradient-to-b from-gray-100 to-gray-50
                        border border-gray-200/80
                        text-xs sm:text-sm font-semibold text-gray-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                        hover:bg-gray-200/80 active:scale-[0.98]
                        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                        hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                        w-full
                      "
                    >
                      Back
                    </button>

                    <button
                      onClick={handleCreateList}
                      disabled={!newListName.trim() || creatingList}
                      className="
                        py-2.5 sm:py-3 md:py-3.5 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        bg-gradient-to-b from-blue-500 to-blue-600
                        text-xs sm:text-sm font-semibold text-white
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        relative overflow-hidden group
                        shadow-[0_1px_6px_rgba(59,130,246,0.3)] sm:shadow-[0_2px_8px_rgba(59,130,246,0.3)] md:shadow-[0_2px_12px_rgba(59,130,246,0.3)]
                        hover:shadow-[0_3px_12px_rgba(59,130,246,0.4)] sm:hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] md:hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)]
                        hover:scale-[1.02] active:scale-[0.98]
                        w-full
                      "
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 translate-x-[-100%] group-hover:translate-x-[100%]" />
                      
                      <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                        {creatingList ? (
                          <>
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                            <span className="tracking-[-0.01em]">Creating...</span>
                          </>
                        ) : (
                          <>
                            <svg  dir="ltr"className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="tracking-[-0.01em]">Create List</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                // EXISTING LISTS VIEW
                <>
                  <div className="space-y-1.5 sm:space-y-2 max-h-[240px] sm:max-h-[280px] md:max-h-[320px] overflow-y-auto pe-1.5 sm:pe-2 -me-1.5 sm:-me-2 scrollbar-thin">
                    {/* Create New List Button */}
                    <button
                      onClick={() => setIsCreating(true)}
                      className="
                        w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-4 md:py-3.5
                        rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        border-2 border-dashed border-gray-300/80
                        bg-gradient-to-b from-white/60 to-white/40
                        hover:border-blue-300/80 hover:bg-blue-50/30
                        transition-all duration-300 ease-out
                        flex items-center justify-center gap-2 sm:gap-3
                        group
                        text-start
                      "
                    >
                      <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg dir="ltr" className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 block truncate">
                          Create New List
                        </span>
                       
                      </div>
                    </button>

                    {/* Existing Lists */}
                    {safeLists.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 md:py-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner">
                          <svg dir="ltr" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-700">No lists available</p>
                        <p className="text-xs text-gray-400 mt-0.5 sm:mt-1">Create your first list to get started</p>
                      </div>
                    ) : (
                      safeLists.map((list) => (
                        <div
                          key={list.id}
                          className={`
                            w-full px-3 py-2.5 sm:px-4 sm:py-3 md:px-4 md:py-3.5 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]   text-start
                            border transition-all duration-300 ease-out
                            disabled:opacity-60 disabled:cursor-not-allowed
                            group relative overflow-hidden
                            flex items-center
                            ${
                              selectedList?.id === list.id
                                ? "bg-gradient-to-r from-blue-50/80 to-blue-50/40 border-blue-200/80 shadow-[0_1px_6px_rgba(59,130,246,0.1)] sm:shadow-[0_2px_8px_rgba(59,130,246,0.12)] md:shadow-[0_2px_12px_rgba(59,130,246,0.12)]"
                                : "bg-white/60 border-gray-200/80 hover:bg-gray-50/80 hover:border-gray-300/60 hover:shadow-sm"
                            }
                          `}
                        >
                          {/* Main clickable area for selection */}
                          <button
                            onClick={() => setSelectedList(list)}
                            disabled={sending}
                            className="flex-1 flex items-center gap-3 sm:gap-4   text-start"
                          >
                            {/* Selection indicator */}
                            <div className={`
                              w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0
                              ${selectedList?.id === list.id 
                                ? "border-blue-500 bg-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.15)] sm:shadow-[0_0_0_4px_rgba(59,130,246,0.15)]" 
                                : "border-gray-300 group-hover:border-gray-400"
                              }
                            `}>
                              {selectedList?.id === list.id && (
                                <svg dir="ltr" className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            
                            {/* List content */}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-gray-900 block truncate">
                                {list.name}
                              </span>
                              <span className="text-xs text-gray-500 mt-0.5">
                                {list.itemCount || 0} {list.itemCount === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                          </button>

                          {/* Modern Sleek Delete Button - ALWAYS VISIBLE */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteList(list);
                            }}
                            disabled={sending || deletingList}
                            title="Delete List"
                            className="
                              w-7 h-7 sm:w-8 sm:h-8 rounded-xl
                              bg-gradient-to-b from-gray-50 to-gray-100
                              border border-gray-200/80
                              flex items-center justify-center 
                              hover:bg-gradient-to-b hover:from-red-50 hover:to-red-100
                              hover:border-red-200
                              active:scale-95
                              transition-all duration-200
                              flex-shrink-0 ms-2 sm:ms-3

                              disabled:opacity-40 disabled:cursor-not-allowed
                            "
                          >
                            {/* Modern Trash Icon */}
                            <svg  dir="ltr"
                              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover:text-red-500 transition-colors" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="1.8" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                    
                    {/* Delete Error Message */}
                    {deleteError && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-600 text-center">
                          {deleteError}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons for adding to list - Stack on mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 md:pt-5 border-t border-gray-100/60">
                    <button
                      onClick={handleClose}
                      disabled={sending}
                      className="
                        py-2.5 sm:py-3 md:py-3.5 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        bg-gradient-to-b from-gray-100 to-gray-50
                        border border-gray-200/80
                        text-xs sm:text-sm font-semibold text-gray-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-300
                        hover:bg-gray-200/80 active:scale-[0.98]
                        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
                        hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                        w-full
                      "
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleSend}
                      disabled={!selectedList || sending}
                      className="
                        py-2.5 sm:py-3 md:py-3.5 rounded-[10px] sm:rounded-[12px] md:rounded-[14px]
                        bg-gradient-to-b from-blue-500 to-blue-600
                        text-xs sm:text-sm font-semibold text-white
                        transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        relative overflow-hidden group
                        shadow-[0_1px_6px_rgba(59,130,246,0.3)] sm:shadow-[0_2px_8px_rgba(59,130,246,0.3)] md:shadow-[0_2px_12px_rgba(59,130,246,0.3)]
                        hover:shadow-[0_3px_12px_rgba(59,130,246,0.4)] sm:hover:shadow-[0_4px_16px_rgba(59,130,246,0.4)] md:hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)]
                        hover:scale-[1.02] active:scale-[0.98]
                        w-full
                      "
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 translate-x-[-100%] group-hover:translate-x-[100%]" />
                      
                      <span className="relative flex items-center justify-center gap-1.5 sm:gap-2">
                        {sending ? (
                          <>
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                            <span className="tracking-[-0.01em]">Adding...</span>
                          </>
                        ) : (
                          <>
                          
                            <span className="tracking-[-0.01em]">Add to List</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}