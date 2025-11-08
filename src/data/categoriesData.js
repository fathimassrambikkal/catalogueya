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
// Gardening Product Images mashatil
// =============================
import g1 from "../assets/g1.jpg";
import g2 from "../assets/g2.jpg";
import g3 from "../assets/g3.jpg";
import g4 from "../assets/g4.jpg";
import g5 from "../assets/g5.jpg";
import g6 from "../assets/g6.jpg";
import g7 from "../assets/g7.jpg";
import g8 from "../assets/g8.jpg";
import g9 from "../assets/g9.jpg";
import g10 from "../assets/g10.jpg";
import g11 from "../assets/g11.jpg";
import g12 from "../assets/g12.jpg";
import g13 from "../assets/g13.jpg";
import g14 from "../assets/g14.jpg";
import g15 from "../assets/g15.jpg";
import g16 from "../assets/g16.jpg";
import g17 from "../assets/g17.jpg";
import g18 from "../assets/g18.jpg";
import g19 from "../assets/g19.jpg";
import g20 from "../assets/g20.jpg";
import g21 from "../assets/g21.jpg";
import g22 from "../assets/g22.jpg";
import g23 from "../assets/g23.jpg";
import g24 from "../assets/g24.jpg";
import g25 from "../assets/g25.jpg";
// =============================
// Gardening Product Images alrayhan
// =============================
import a1 from "../assets/a2.jpg";
import a2 from "../assets/a1.jpg";
import a3 from "../assets/a3.jpg";
import a4 from "../assets/a4.jpg";
import a5 from "../assets/a5.jpg";
import a6 from "../assets/a6.jpg";
import a7 from "../assets/a7.jpg";
import a8 from "../assets/a8.jpg";
import a9 from "../assets/a9.jpg";
import a10 from "../assets/a10.jpg";
import a11 from "../assets/a11.jpg";
import a12 from "../assets/a12.jpg";
import a13 from "../assets/a13.jpg";
import a14 from "../assets/a14.jpg";
import a15 from "../assets/a15.jpg";
import a16 from "../assets/a16.jpg";
import a17 from "../assets/a17.jpg";
import a18 from "../assets/a18.jpg";
import a19 from "../assets/a19.jpg";
import a20 from "../assets/a20.jpg";
import a21 from "../assets/a21.jpg";
import a22 from "../assets/a22.jpg";
import a23 from "../assets/a23.jpg";





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
    title: "Lights",
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
  { id: "plant1", name: "Plant 1", price: 30, img: a1 },
  { id: "plant2", name: "Plant 2", price: 25, img: a2 },
  { id: "plant3", name: "Plant 3", price: 35, img: a3 },
  { id: "plant4", name: "Plant 4", price: 28, img: a4 },
  { id: "plant5", name: "Plant 5", price: 22, img: a5 },
  { id: "plant6", name: "Plant 6", price: 20, img: a6 },
  { id: "plant7", name: "Plant 7", price: 27, img: a7 },
  { id: "plant8", name: "Plant 8", price: 32, img: a8 },
  { id: "plant9", name: "Plant 9", price: 26, img: a9 },
  { id: "plant10", name: "Plant 10", price: 30, img: a10 },
  { id: "plant11", name: "Plant 11", price: 24, img: a11 },
  { id: "plant12", name: "Plant 12", price: 29, img: a12 },
  { id: "plant13", name: "Plant 13", price: 31, img: a13 },
  { id: "plant14", name: "Plant 14", price: 23, img: a14 },
  { id: "plant15", name: "Plant 15", price: 32, img: a15 },
  { id: "plant16", name: "Plant 16", price: 28, img: a16 },
  { id: "plant17", name: "Plant 17", price: 25, img: a17 },
  { id: "plant18", name: "Plant 18", price: 34, img: a18 },
  { id: "plant19", name: "Plant 19", price: 30, img: a19 },
  { id: "plant20", name: "Plant 20", price: 27, img: a20 },
  { id: "plant21", name: "Plant 21", price: 29, img: a21 },
  { id: "plant22", name: "Plant 22", price: 31, img: a22 },
  { id: "plant23", name: "Plant 23", price: 26, img: a23 },
  
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
        products: [
  { id: "plant1", name: "Fiddle Leaf Fig", price: 30, img: g1 },
  { id: "plant2", name: "Snake Plant", price: 25, img: g2 },
  { id: "plant3", name: "Monstera Deliciosa", price: 35, img: g3 },
  { id: "plant4", name: "ZZ Plant", price: 28, img: g4 },
  { id: "plant5", name: "Peace Lily", price: 22, img: g5 },
  { id: "plant6", name: "Spider Plant", price: 20, img: g6 },
  { id: "plant7", name: "Plant 7", price: 27, img: g7 },
  { id: "plant8", name: "Plant 8", price: 32, img: g8 },
  { id: "plant9", name: "Plant 9", price: 26, img: g9 },
  { id: "plant10", name: "Plant 10", price: 30, img: g10 },
  { id: "plant11", name: "Plant 11", price: 24, img: g11 },
  { id: "plant12", name: "Plant 12", price: 29, img: g12 },
  { id: "plant13", name: "Plant 13", price: 31, img: g13 },
  { id: "plant14", name: "Plant 14", price: 23, img: g14 },
  { id: "plant15", name: "Plant 15", price: 32, img: g15 },
  { id: "plant16", name: "Plant 16", price: 28, img: g16 },
  { id: "plant17", name: "Plant 17", price: 25, img: g17 },
  { id: "plant18", name: "Plant 18", price: 34, img: g18 },
  { id: "plant19", name: "Plant 19", price: 30, img: g19 },
  { id: "plant20", name: "Plant 20", price: 27, img: g20 },
  { id: "plant21", name: "Plant 21", price: 29, img: g21 },
  { id: "plant22", name: "Plant 22", price: 31, img: g22 },
  { id: "plant23", name: "Plant 23", price: 26, img: g23 },
  { id: "plant24", name: "Plant 24", price: 33, img: g24 },
  { id: "plant25", name: "Plant 25", price: 28, img: g25 },
]

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
