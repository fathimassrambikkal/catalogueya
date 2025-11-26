import { categories } from "./categoriesData";
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g20 from "../assets/g20.jpg";

// 🏷️ Base sales products (linked to REAL gardening companies)
const baseSales = [
  {
    id: "sale1",
    name: "Natural Grass Roll",
    category: "Plants",
    categoryId: "gardening",
    company: "ALRAYHAN",
    companyId: "gardenCo1", // ✅ Matches company.id from categoriesData
    price: 90,
    oldPrice: 130,
    img: g1,
    rating: 4.7,
    offerEnds: "Nov 30, 2025",
  },
  {
    id: "sale2",
    name: "Potted Indoor Plant Set",
    category: "Indoor Plants",
    categoryId: "gardening",
    company: "Mashatil discovery",
    companyId: "gardenCo2", // ✅ Matches company.id from categoriesData
    price: 60,
    oldPrice: 90,
    img: g2,
    rating: 4.5,
    offerEnds: "Dec 5, 2025",
  },
  {
    id: "sale3",
    name: "Ornamental Palm Tree",
    category: "Outdoor Plants",
    categoryId: "gardening",
    company: "ALRAYHAN",
    companyId: "gardenCo1",
    price: 120,
    oldPrice: 180,
    img: g3,
    rating: 4.8,
    offerEnds: "Nov 29, 2025",
  },
  {
    id: "sale4",
    name: "Flowering Plant Pack",
    category: "Flowering Plants",
    categoryId: "gardening",
    company: "Mashatil discovery",
    companyId: "gardenCo2",
    price: 85,
    oldPrice: 120,
    img: g4,
    rating: 4.6,
    offerEnds: "Dec 7, 2025",
  },
    {
    id: "sale4",
    name: "Flowering Plant Pack",
    category: "Flowering Plants",
    categoryId: "gardening",
    company: "Mashatil discovery",
    companyId: "gardenCo2",
    price: 85,
    oldPrice: 120,
    img: g20,
    rating: 4.6,
    offerEnds: "Dec 7, 2025",
  },
];

// 🔗 Merge sale-marked products from categories (if any)
const linkedSales = categories.flatMap((category) =>
  category.companies.flatMap((company) =>
    (company.products || [])
      .filter((p) => p.isOnSale)
      .map((p) => ({
        ...p,
        categoryId: category.id,
        categoryName: category.title,
        companyId: company.id,
        companyName: company.name,
        type: "sale",
      }))
  )
);

// ✅ Unified Sales Products
export const salesProducts = [
  ...linkedSales,
  ...baseSales.map((p) => ({
    ...p,
    type: "sale",
  })),
].filter(Boolean);
