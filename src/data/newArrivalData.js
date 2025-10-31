// src/data/newArrivalData.js
import { categories } from "./categoriesData";
import { salesProducts } from "./salesData";

// 🧩 Combine: Extract new arrivals from categories + include sales products
export const newArrivalProducts = [
  // 🔹 1. From categories → products marked as new arrivals
  ...categories.flatMap((category) =>
    category.companies.flatMap((company) =>
      (company.products || [])
        .filter((p) => p.isNewArrival) // Only those tagged as new
        .map((p) => ({
          ...p,
          id: String(p.id), // ensure ID is string for route matching
          categoryId: category.id,
          categoryName: category.title,
          companyId: company.id,
          companyName: company.name,
          type: "newArrival",
        }))
    )
  ),

  // 🔹 2. From sales data → treat them as featured/new arrivals too
  ...salesProducts.map((p) => ({
    ...p,
    id: String(p.id), // ensure consistency
    categoryId: p.categoryId || null,
    categoryName: p.category || "Sales",
    companyId: p.companyId || null,
    companyName: p.company || "Featured Company",
    type: "sale", // helps identify in UI (optional badge)
  })),
].filter(Boolean); // Remove any undefined/empty results
