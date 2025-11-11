import { categories } from "./categoriesData";
import { salesProducts } from "./salesData";
import { newArrivalProducts } from "./newArrivalData";

export const unifiedData = {
  categories,
  salesProducts,
  newArrivalProducts,
  allProducts: [
    ...categories.flatMap((category) =>
      category.companies.flatMap((company) =>
        (company.products || []).map((p) => ({
          ...p,
          categoryId: category.id,
          categoryName: category.title,
          companyId: company.id,
          companyName: company.name,
          type: "category",
        }))
      )
    ),
    ...salesProducts,
    ...newArrivalProducts,
  ],
};
