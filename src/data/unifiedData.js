// src/data/unifiedData.js
import { categories } from "./categoriesData";
import { salesProducts } from "./salesData";
import { newArrivalProducts } from "./newArrivalData";

// 🧩 Unified, structured dataset for all pages/components
export const unifiedData = {
  categories, // 🏷️ Category-wise company + product data
  salesProducts, // 💸 Discounted or on-sale items
  newArrivalProducts, // 🆕 Recently added items

  // 📦 Combined all products (useful for global search or recommendation sections)
  allProducts: [
    ...categories.flatMap((category) =>
      category.companies.flatMap((company) =>
        company.products?.map((p) => ({
          ...p,
          categoryId: category.id,
          categoryName: category.title,
          companyId: company.id,
          companyName: company.name,
          type: "category",
        })) || []
      )
    ),
    ...salesProducts,
    ...newArrivalProducts,
  ],
};
