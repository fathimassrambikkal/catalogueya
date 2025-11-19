import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie"; 
import logo from "../assets/logo.png";
import { useFavourites } from "../context/FavouriteContext";
import { AiOutlineHeart } from "react-icons/ai";
import { changeLanguage as apiChangeLanguage } from "../api";

// Memoized dropdown menu
const DropdownMenu = memo(function DropdownMenu({ isOpen, language, t, closeMenu }) {
  if (!isOpen) return null;

  const links = [
    { path: "/", label: t("home") },
    { path: "/about", label: t("about") },
    { path: "/salesproducts", label: t("offers") },
    { path: "/contact", label: t("contact") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`absolute mt-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl w-52 sm:w-60 border border-white/30 z-50 ${
        language === "ar" ? "left-0" : "right-0"
      }`}
    >
      <ul className={`flex flex-col text-gray-700 text-center text-sm ${language === "ar" ? "text-right pr-3" : ""}`}>
        {links.map((item) => (
          <li key={item.path} className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
            <Link to={item.path} onClick={closeMenu}>{item.label}</Link>
          </li>
        ))}
        <li className="px-4 py-2">
          <Link
            to="/register"
            onClick={closeMenu}
            className="block bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition text-sm"
          >
            {t("signup")}
          </Link>
        </li>
      </ul>
    </motion.div>
  );
});

// Memoized menu button
const MenuButton = memo(function MenuButton({ menuOpen, toggleMenu }) {
  return (
    <motion.button
      onClick={toggleMenu}
      className=" border border-gray-300 text-xs sm:text-sm  flex items-center bg-white/30 text-gray-900 px-2 py-1 sm:px-2 sm:py-2  rounded-lg md:rounded-xl  hover:bg-white/50 transition backdrop-blur-md"
      animate={{
        rotate: menuOpen ? [0, 3, -3, 0] : 0,
        scale: menuOpen ? 1.05 : 1,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <motion.div animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
        <HiDotsHorizontal className="text-gray-700 text-xl" />
      </motion.div>
    </motion.button>
  );
});

// Memoized Favourites
const FavouritesCounter = memo(function FavouritesCounter() {
  const { favourites } = useFavourites();
  const { i18n } = useTranslation();  
  const count = favourites.length;

  return (
    <Link 
      to="/favourite" 
      className={`relative ${i18n.language === "ar" ? "ml-2" : ""}`} 
    >
      <AiOutlineHeart
        className={`text-2xl cursor-pointer transition ${
          count > 0 ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-red-400"
        }`}
      />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 py-0.5 shadow-md">
          {count}
        </span>
      )}
    </Link>
  );
});

// Memoized Language Toggle - UPDATED with better click handling
const LanguageToggle = memo(function LanguageToggle({ toggleLanguage, language }) {
  console.log("🔤 LanguageToggle rendering - current language:", language);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🖱️ Language button clicked!");
    toggleLanguage();
  };
  
  return (
    <button
      onClick={handleClick}
      className="border border-gray-300 text-gray-900 px-2 py-1 sm:px-3 sm:py-2 rounded-lg md:rounded-xl hover:bg-white/50 transition text-xs sm:text-sm backdrop-blur-md"
    >
      {language === "en" ? "عربي" : "EN"}
    </button>
  );
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const glassPages = useMemo(() => ["/", "/about", "/salesproducts", "/contact"], []);
  const isGlassPage = useMemo(() => glassPages.includes(location.pathname), [location.pathname, glassPages]);

  // Initialize language - with proper cookie settings
  useEffect(() => {
    const cookieLang = Cookies.get("lang") || "en";
    console.log("🔄 Navbar initialization - cookie language:", cookieLang, "i18n language:", i18n.language);
    
    if (i18n.language !== cookieLang) {
      console.log("🔄 Updating i18n language from cookie...");
      i18n.changeLanguage(cookieLang);
      document.documentElement.setAttribute("dir", cookieLang === "ar" ? "rtl" : "ltr");
    }
  }, [i18n]);

  const toggleLanguage = useCallback(async () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "en" ? "ar" : "en";
    
    console.log("🔄 Language toggle function called:");
    console.log("   - Current language:", currentLang);
    console.log("   - New language:", newLang);
    console.log("   - Cookie before change:", Cookies.get("lang"));

    // Update cookie with proper expiration (30 days)
    Cookies.set("lang", newLang, { 
      expires: 30, // 30 days
      path: '/',
      sameSite: 'lax'
    });
    
    console.log("   - Cookie after update:", Cookies.get("lang"));

    try {
      console.log("🌐 Calling API to change language...");
      console.log("🌐 API function:", apiChangeLanguage);
      
      // Call the API function
      const response = await apiChangeLanguage();
      console.log("✅ API response received:", response);
      
      // Check if API call was successful
      if (response?.data?.status === 200) {
        console.log("🎉 Language change successful! Backend confirmed:", response.data.message);
        console.log("🔄 Reloading page to apply language changes...");
        
        // Reload the page after successful API call
        window.location.reload();
      } else {
        console.log("⚠️ API response format unexpected:", response);
        // Still reload to apply cookie changes
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Language change API error:", error);
      console.error("❌ Error details:", error.response?.data || error.message);
      
      // Even if API fails, still reload to apply cookie changes
      console.log("🔄 Reloading page despite API error (cookie is set)...");
      window.location.reload();
    }
  }, [i18n]);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) setMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside, { passive: true });
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Log when language changes via i18n
  useEffect(() => {
    console.log("📢 i18n language changed to:", i18n.language);
  }, [i18n.language]);

  return (
    <nav
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className={`fixed left-1/2 -translate-x-1/2 z-50 font-inter transition-all duration-500
        ${scrolled && isGlassPage
          ? "backdrop-blur-lg bg-white/30 shadow-xl border border-white/20"
          : "bg-white shadow-md"
        }
        w-full flex justify-between items-center px-6 sm:px-10 py-3 sm:py-2`}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img src={logo} alt="Catalogueya Logo" className="h-12 sm:h-14 object-contain ml-2 lg:ml-16" />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-5 md:mr-20">
        <FavouritesCounter />
        <Link
          to="/sign"
          className="border border-gray-300 text-gray-900 hover:text-blue-500 px-2 sm:px-3 py-1 sm:py-2 rounded-lg md:rounded-xl transition text-xs sm:text-sm flex items-center justify-center bg-white/30 hover:bg-white/50"
        >
          {t("login")}
        </Link>
        {/* UPDATED: LanguageToggle with better click handling */}
        <LanguageToggle 
          toggleLanguage={toggleLanguage} 
          language={i18n.language} 
        />
        <div className="relative menu-container">
          <MenuButton menuOpen={menuOpen} toggleMenu={toggleMenu} />
          <AnimatePresence>
            <DropdownMenu isOpen={menuOpen} language={i18n.language} t={t} closeMenu={() => setMenuOpen(false)} />
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}