import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { useFavourites } from "../context/FavouriteContext";
import { AiOutlineHeart } from "react-icons/ai";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { favourites } = useFavourites();
  const { t, i18n } = useTranslation();
  const count = favourites.length;
  const location = useLocation();

  const glassPages = ["/", "/about", "/salesproducts", "/contact"];
  const isGlassPage = glassPages.includes(location.pathname);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 font-inter transition-all duration-500
        ${
          isGlassPage
            ? "backdrop-blur-lg bg-white/30 shadow-xl border border-white/20"
            : "bg-white/80 shadow-xl"
        }
        w-[90%] sm:w-[80%] md:w-[60%] rounded-full flex justify-between items-center px-4 sm:px-8 py-2 sm:py-3`}
    >
      {/* ✅ Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src={logo}
            alt="Catalogueya Logo"
            className="h-8 sm:h-10 object-contain"
          />
        </Link>
      </div>

      {/* ✅ Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* ❤️ Favourites */}
        <Link to="/favourite" className="relative">
          <AiOutlineHeart
            className={`text-xl sm:text-xl cursor-pointer transition ${
              count > 0
                ? "text-red-500 hover:text-red-600"
                : "text-gray-600 hover:text-red-400"
            }`}
          />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 py-0.5 shadow-md">
              {count}
            </span>
          )}
        </Link>

        {/* 🔐 Login */}
        <Link
          to="/sign"
          className="border border-gray-300 text-gray-700 hover:text-blue-500 px-3 sm:px-4 py-1 sm:py-2 rounded-full transition text-xs sm:text-sm flex items-center justify-center bg-white/30 hover:bg-white/50"
        >
          {t("login")}
        </Link>

        {/* 📝 Sign Up */}
        <Link
          to="/register"
          className="bg-blue-500 text-white hover:bg-blue-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full transition text-xs sm:text-sm flex items-center justify-center"
        >
          {t("signup")}
        </Link>

        {/* 🌍 Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="border border-gray-300 text-gray-700 px-2 py-1 sm:px-3 sm:py-2 rounded-full hover:bg-white/50 transition text-xs sm:text-sm backdrop-blur-md"
        >
          {i18n.language === "en" ? "AR" : "EN"}
        </button>

        {/* 🍔 Menu Button */}
        <div
          className="relative"
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <motion.button
            className="flex items-center bg-white/30 text-gray-700 px-2 py-2 rounded-xl hover:bg-white/50 transition"
            animate={{
              rotate: menuOpen ? [0, 3, -3, 0] : 0,
              scale: menuOpen ? 1.05 : 1,
            }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                rotate: menuOpen ? 90 : 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <HiDotsHorizontal className="text-gray-700 text-xl" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute right-0 mt-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl w-40 sm:w-48 border border-white/30 z-50"
              >
                <ul className="flex flex-col text-gray-700 text-center text-sm">
                  <li className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                      {t("home")}
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
                    <Link to="/about" onClick={() => setMenuOpen(false)}>
                      {t("about")}
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
                    <Link to="/salesproducts" onClick={() => setMenuOpen(false)}>
                      {t("offers")}
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>
                      {t("contact")}
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
