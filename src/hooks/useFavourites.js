import React, { createContext, useContext, useEffect, useState } from "react";

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  // ✅ Move normalizeProductData outside so it can be used consistently
  const normalizeProductData = (item) => {
    if (!item || !item.id) return null;

    // Base structure with fallbacks
    const normalized = {
      id: item.id,
      name: item.name || item.name_en || "Unnamed Product",
      price: item.price || item.discount_price || 0,
      description: item.description || "",
      isOnSale: item.isOnSale || false,
      isNewArrival: item.isNewArrival || false,
      
      // Handle images - prioritize different field names
      image: item.image || item.img || '/api/placeholder/300/300',
      img: item.img || item.image || '/api/placeholder/300/300',
      
      // Handle company data with multiple field name variations
      company_name: item.company_name || item.companyName || "Company",
      company_id: item.company_id || item.companyId || null,
      
      // Handle category data with multiple field name variations
      category_name: item.category_name || item.categoryName || "Product",
      category_id: item.category_id || item.categoryId || null,
      
      // Handle rating with safe parsing
      rating: parseFloat(item.rating) || 0,
      
      // Preserve any additional fields
      ...item
    };

    // ✅ Special handling for different product types
    if (item.isOnSale) {
      normalized.category_name = "Sale";
    } else if (item.isNewArrival) {
      normalized.category_name = "New Arrival";
    }

    // ✅ Ensure image URLs are properly formatted
    if (normalized.image && !normalized.image.startsWith('http') && !normalized.image.startsWith('/api/placeholder')) {
      const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";
      const cleanPath = normalized.image.startsWith('/') ? normalized.image.slice(1) : normalized.image;
      normalized.image = `${API_BASE_URL}/${cleanPath}`;
      normalized.img = `${API_BASE_URL}/${cleanPath}`;
    }

    return normalized;
  };

  // ✅ Enhanced: Clean existing favourites on mount to ensure data consistency
  useEffect(() => {
    const cleanExistingFavourites = () => {
      const cleanedFavourites = favourites
        .map(item => normalizeProductData(item))
        .filter(item => item !== null); // Remove any invalid items

      if (cleanedFavourites.length !== favourites.length) {
        setFavourites(cleanedFavourites);
        localStorage.setItem("favourites", JSON.stringify(cleanedFavourites));
      }
    };

    if (favourites.length > 0) {
      cleanExistingFavourites();
    }
  }, []); // Run only on mount

  const toggleFavourite = (item) => {
    const normalizedItem = normalizeProductData(item);
    
    if (!normalizedItem) {
      console.error('❌ Cannot add invalid item to favourites:', item);
      return;
    }

    setFavourites((prev) => {
      const exists = prev.some((fav) => fav.id === normalizedItem.id);
      let updated;
      
      if (exists) {
        // Remove from favourites
        updated = prev.filter((fav) => fav.id !== normalizedItem.id);
        console.log('🗑️ Removed from favourites:', normalizedItem.name);
      } else {
        // Add to favourites with normalized data
        updated = [...prev, normalizedItem];
        console.log('❤️ Added to favourites:', normalizedItem.name, 'Company:', normalizedItem.company_name);
      }

      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Enhanced: Add method to update favourite item data
  const updateFavouriteItem = (productId, updatedData) => {
    setFavourites(prev => {
      const updated = prev.map(item => {
        if (item.id === productId) {
          const mergedData = { ...item, ...updatedData };
          return normalizeProductData(mergedData);
        }
        return item;
      });
      
      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Enhanced: Add method to refresh all favourites data
  const refreshFavouritesData = async (fetchProductData) => {
    if (typeof fetchProductData !== 'function') return;

    try {
      const refreshedFavourites = await Promise.all(
        favourites.map(async (item) => {
          try {
            // Only refresh if missing critical company data
            if (!item.company_id || item.company_name === "Company") {
              const freshData = await fetchProductData(item.id);
              if (freshData) {
                return normalizeProductData({ ...item, ...freshData });
              }
            }
            return item; // Return original if no refresh needed or failed
          } catch (error) {
            console.warn('❌ Failed to refresh favourite item:', item.id, error);
            return item; // Return original on error
          }
        })
      );

      setFavourites(refreshedFavourites);
      localStorage.setItem("favourites", JSON.stringify(refreshedFavourites));
    } catch (error) {
      console.error('❌ Error refreshing favourites:', error);
    }
  };

  // ✅ Enhanced: Add method to check if item has complete data
  const hasCompleteData = (item) => {
    const normalized = normalizeProductData(item);
    return !!(normalized.company_id && normalized.company_name && normalized.company_name !== "Company");
  };

  // ✅ Enhanced: Get favourite by ID
  const getFavouriteById = (productId) => {
    return favourites.find(item => item.id === productId) || null;
  };

  // ✅ Enhanced: Check if item is favourite
  const isFavourite = (productId) => {
    return favourites.some(item => item.id === productId);
  };

  // ✅ Enhanced: Clear all favourites
  const clearFavourites = () => {
    setFavourites([]);
    localStorage.setItem("favourites", JSON.stringify([]));
  };

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const contextValue = {
    favourites,
    toggleFavourite,
    updateFavouriteItem,
    refreshFavouritesData,
    hasCompleteData,
    getFavouriteById,
    isFavourite,
    clearFavourites,
    normalizeProductData // ✅ Now properly exported
  };

  return (
    <FavouriteContext.Provider value={contextValue}>
      {children}
    </FavouriteContext.Provider>
  );
}

export const useFavourites = () => {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error('useFavourites must be used within a FavouriteProvider');
  }
  return context;
};