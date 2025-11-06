import React, { createContext, useContext, useEffect, useState } from "react";
import { categories } from "../data/categoriesData"; // needed to fetch missing info

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  // Helper: complete product info if missing
  const getFullProduct = (item) => {
    if (item.categoryId && item.companyId) return item; // already complete

    // Search in categories data
    for (const cat of categories) {
      for (const comp of cat.companies) {
        const prod = comp.products.find((p) => p.id === item.id);
        if (prod) {
          return {
            ...prod,
            categoryId: cat.id,
            companyId: comp.id,
            categoryName: cat.title,
            companyName: comp.name,
            image: prod.image || prod.img,
          };
        }
      }
    }
    return item; // fallback
  };

  const toggleFavourite = (item) => {
    const fullItem = getFullProduct(item);

    setFavourites((prev) => {
      const exists = prev.some((fav) => fav.id === fullItem.id);
      const updated = exists
        ? prev.filter((fav) => fav.id !== fullItem.id)
        : [...prev, fullItem];

      localStorage.setItem("favourites", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
}

export const useFavourites = () => useContext(FavouriteContext);
