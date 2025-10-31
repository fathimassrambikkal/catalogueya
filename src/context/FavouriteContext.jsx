// src/context/FavouriteContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const FavouriteContext = createContext();

export function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  const toggleFavourite = (item) => {
    setFavourites((prev) => {
      const exists = prev.some((fav) => fav.id === item.id);
      const updated = exists
        ? prev.filter((fav) => fav.id !== item.id)
        : [...prev, item];
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
