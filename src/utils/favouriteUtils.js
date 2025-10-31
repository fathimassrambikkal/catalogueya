// src/utils/favouriteUtils.js

// Get favourites from localStorage
export function getFavourites() {
  const data = localStorage.getItem("favourites");
  return data ? JSON.parse(data) : [];
}

// Save favourites to localStorage
function saveFavourites(favourites) {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}

// Toggle favourite status (add/remove)
export function toggleFavourite(product) {
  const favourites = getFavourites();
  const exists = favourites.some((item) => item.id === product.id);

  let updated;
  if (exists) {
    updated = favourites.filter((item) => item.id !== product.id);
  } else {
    updated = [...favourites, product];
  }

  saveFavourites(updated);
  return updated;
}

// Check if product is favourite
export function isFavourite(id) {
  const favourites = getFavourites();
  return favourites.some((item) => item.id === id);
}
