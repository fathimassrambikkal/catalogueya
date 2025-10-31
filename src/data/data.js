// src/data/data.js

export const categories = [
  {
    id: "paint",
    title: "Paint",
    image: "/assets/paint.png",
    companies: [
      {
        id: "colorpro",
        name: "ColorPro Paints",
        logo: "/assets/company1.png",
        rating: 4.5,
        description: "Experts in interior and exterior paints.",
        products: [
          {
            id: "paint1",
            name: "Acrylic Wall Paint",
            price: "25",
            image: "/assets/paint1.jpg",
          },
          {
            id: "paint2",
            name: "Gloss Finish Paint",
            price: "30",
            image: "/assets/paint2.jpg",
          },
        ],
      },
      {
        id: "freshcoats",
        name: "FreshCoats",
        logo: "/assets/company2.png",
        rating: 4.8,
        description: "High-durability waterproof paints.",
        products: [
          {
            id: "paint3",
            name: "Waterproof Exterior",
            price: "45",
            image: "/assets/paint3.jpg",
          },
        ],
      },
    ],
  },

  {
    id: "carpenter",
    title: "Carpenter",
    image: "/assets/carpenter.png",
    companies: [
      {
        id: "woodworks",
        name: "WoodWorks Co.",
        logo: "/assets/company3.png",
        rating: 4.6,
        description: "Furniture and interior wood design.",
        products: [
          {
            id: "table1",
            name: "Wooden Dining Table",
            price: "120",
            image: "/assets/table1.jpg",
          },
          {
            id: "chair1",
            name: "Modern Wooden Chair",
            price: "75",
            image: "/assets/chair1.jpg",
          },
        ],
      },
    ],
  },
];
