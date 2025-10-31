import { useState, useEffect } from "react";
import {
  getFavourites,
  toggleFavourite,
  isFavourite,
} from "../utils/favouriteUtils";

export default function useFavourites() {
  const [favourites, setFavourites] = useState(getFavourites());

  const handleToggle = (product) => {
    const updated = toggleFavourite(product);
    setFavourites(updated);
  };

  useEffect(() => {
    const handleStorageChange = () => setFavourites(getFavourites());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return {
    favourites,
    toggleFavourite: handleToggle,
    isFavourite,
    count: favourites.length,
  };
}
