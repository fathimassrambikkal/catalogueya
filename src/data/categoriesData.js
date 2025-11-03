// =============================
// Category Images
// =============================
import paintImg from "../assets/paint.png";
import carpenterImg from "../assets/carpenter.png";
import lightsImg from "../assets/lights.png";
import curtainsImg from "../assets/curtains.PNG";
import wallpaperImg from "../assets/wallpaper.png";
import gardeningImg from "../assets/gardening.png";
import securityImg from "../assets/security.jpg";

// =============================
// Logos
// =============================
import alrayhanLogo from "../assets/alrayhan.png";
import mashatilDiscoveryLogo from "../assets/logo1.png";

// =============================
// Banners (NEW)
// =============================
import paintBanner from "../assets/bannerc.avif";
import carpenterBanner from "../assets/bannerc.avif";
import lightingBanner from "../assets/bannerc.avif";
import curtainsBanner from "../assets/bannerc.avif";
import wallpaperBanner from "../assets/bannerc.avif";
import gardeningBanner from "../assets/bannerc.avif";
import securityBanner from "../assets/bannerc.avif";

// =============================
// Gardening Product Images
// =============================
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.jpg";
import g6 from "../assets/g6.jpg";

// =============================
// Categories Data
// =============================
export const categories = [
  {
    id: "painting",
    title: "Painting",
    image: paintImg,
    companies: [
      {
        id: "paintco1",
        name: "ColorMax Paints",
        rating: 4.5,
        banner: paintBanner,
        products: [
          {
            id: "paint1",
            name: "UltraGloss Wall Paint",
            price: 49,
            img: paintImg,
            rating: 4.2,
            isNewArrival: true,
          },
        ],
      },
      {
        id: "paintco2",
        name: "Rainbow Coats",
        rating: 4.2,
        banner: paintBanner,
        products: [
          {
            id: "paint2",
            name: "SuperShield Exterior Paint",
            price: 55,
            img: paintImg,
            rating: 4.3,
          },
        ],
      },
    ],
  },
  {
    id: "carpenter",
    title: "Carpentry",
    image: carpenterImg,
    companies: [
      {
        id: "woodworks",
        name: "WoodWorks Co.",
        rating: 4.6,
        banner: carpenterBanner,
        products: [
          {
            id: "wood1",
            name: "Wooden Dining Table",
            price: 120,
            img: carpenterImg,
            rating: 4.8,
            isNewArrival: true,
          },
        ],
      },
      {
        id: "furniPro",
        name: "FurniPro",
        rating: 4.4,
        banner: carpenterBanner,
        products: [
          {
            id: "wood2",
            name: "Wall Shelf Set",
            price: 50,
            img: carpenterImg,
            rating: 4.5,
          },
        ],
      },
    ],
  },
  {
    id: "lighting",
    title: "Lighting",
    image: lightsImg,
    companies: [
      {
        id: "lightco1",
        name: "BrightHome",
        rating: 4.7,
        banner: lightingBanner,
        products: [
          {
            id: "lamp1",
            name: "LED Table Lamp",
            price: 35,
            img: lightsImg,
            rating: 4.6,
            isNewArrival: true,
          },
        ],
      },
      {
        id: "lightco2",
        name: "Luma Lights",
        rating: 4.3,
        banner: lightingBanner,
        products: [
          {
            id: "lamp2",
            name: "Smart Bulb Set",
            price: 45,
            img: lightsImg,
            rating: 4.4,
          },
        ],
      },
    ],
  },
  {
    id: "curtains",
    title: "Curtains & Blinds",
    image: curtainsImg,
    companies: [
      {
        id: "curtainsCo1",
        name: "Elegant Drapes",
        rating: 4.5,
        banner: curtainsBanner,
        products: [
          {
            id: "curtain1",
            name: "Luxury Curtain Set",
            price: 80,
            img: curtainsImg,
            rating: 4.6,
          },
        ],
      },
      {
        id: "curtainsCo2",
        name: "HomeShades",
        rating: 4.2,
        banner: curtainsBanner,
        products: [
          {
            id: "curtain2",
            name: "Sheer Curtains",
            price: 35,
            img: curtainsImg,
            rating: 4.3,
          },
        ],
      },
    ],
  },
  {
    id: "wallpaper",
    title: "Wallpaper",
    image: wallpaperImg,
    companies: [
      {
        id: "wallco1",
        name: "WallArt",
        rating: 4.6,
        banner: wallpaperBanner,
        products: [
          {
            id: "wp1",
            name: "Floral Wallpaper",
            price: 50,
            img: wallpaperImg,
            rating: 4.5,
          },
        ],
      },
      {
        id: "wallco2",
        name: "DecorWalls",
        rating: 4.3,
        banner: wallpaperBanner,
        products: [
          {
            id: "wp2",
            name: "Textured Wallpaper",
            price: 60,
            img: wallpaperImg,
            rating: 4.4,
          },
        ],
      },
    ],
  },
  {
    id: "gardening",
    title: "Gardening",
    image: gardeningImg,
    companies: [
      {
        id: "gardenCo1",
        name: "ALRAYHAN",
        logo: alrayhanLogo,
        banner: gardeningBanner,
        rating: 4.7,
        title: "ALRAYHAN CARE AND MAINTENANCE GARDENES",
        about:
          "قسم الزراعه متخصصون في جميع أعمال الزراعه ونقوم بتصميم وتنسيق الحدائق...",
        businessNumber: "200964",
        workingHours: "7",
        delivery: "Yes",
        implementation: "Yes",
        address: "Doha, Qatar",
        location: "Doha, Qatar",
        email: "wahaab562@gmail.com",
        phone: "55106186",
        googleMapLink: "https://maps.google.com/?q=Doha,Qatar",
        products: [
          { id: "plant1", name: "Fiddle Leaf Fig", price: 30, img: g1 },
          { id: "plant2", name: "Snake Plant", price: 25, img: g2 },
          { id: "plant3", name: "Monstera Deliciosa", price: 35, img: g3 },
          { id: "plant4", name: "ZZ Plant", price: 28, img: g4 },
          { id: "plant5", name: "Peace Lily", price: 22, img: g5 },
          { id: "plant6", name: "Spider Plant", price: 20, img: g6 },
        ],
      },
      {
        id: "gardenCo2",
        name: "Mashatil Discovery",
        logo: mashatilDiscoveryLogo,
        banner: gardeningBanner,
        rating: 4.5,
        title: "Gardening Experts",
        businessNumber: "25751",
        workingHours: "16",
        delivery: "Yes",
        implementation: "Yes",
        location: "Al Gharafa",
        email: "aelwany20@gmail.com",
        phone: "31098634",
        googleMapLink: "https://maps.google.com/?q=Al+gharafa,Qatar",
        products: [],
      },
    ],
  },
  {
    id: "security",
    title: "Security Systems",
    image: securityImg,
    companies: [
      {
        id: "secureCo1",
        name: "SafeHome",
        rating: 4.8,
        banner: securityBanner,
        products: [
          {
            id: "cam1",
            name: "CCTV Camera",
            price: 80,
            img: securityImg,
            rating: 4.9,
          },
        ],
      },
    ],
  },
];
