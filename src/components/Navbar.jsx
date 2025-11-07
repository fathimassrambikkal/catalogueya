import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { useFavourites } from "../context/FavouriteContext";
import { AiOutlineHeart } from "react-icons/ai";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className={`fixed left-1/2 -translate-x-1/2 z-50 font-inter transition-all duration-500
        ${
          scrolled && isGlassPage
            ? "backdrop-blur-lg bg-white/30 shadow-xl border border-white/20"
            : "bg-white shadow-md"
        }
        w-full flex justify-between items-center px-6 sm:px-10 py-3 sm:py-2`}
    >
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src={logo}
            alt="Catalogueya Logo"
            className="h-12 sm:h-14 object-contain ml-2 lg:ml-16"
          />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-5 md:mr-20">
        {/* Favourites */}
        <Link to="/favourite" className="relative">
          <AiOutlineHeart
            className={`text-2xl cursor-pointer transition ${
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

        {/* Login */}
        <Link
          to="/sign"
          className="border border-gray-300 text-gray-950 hover:text-blue-500 px-3 sm:px-4 py-1 sm:py-2 rounded-xl transition text-xs sm:text-sm flex items-center justify-center bg-white/30 hover:bg-white/50"
        >
          {t("login")}
        </Link>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="border border-gray-300 text-gray-950 px-2 py-1 sm:px-3 sm:py-2 rounded-xl hover:bg-white/50 transition text-xs sm:text-sm backdrop-blur-md"
        >
          {i18n.language === "en" ? "عربي" : "EN"}
        </button>

        {/* Menu Button */}
        <div className="relative menu-container">
          <motion.button
            onClick={toggleMenu}
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
                className={`absolute mt-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl w-52 sm:w-60 border border-white/30 z-50 ${
                  i18n.language === "ar" ? "left-0" : "right-0"
                }`}
              >
                <ul
                  className={`flex flex-col text-gray-700 text-center text-sm ${
                    i18n.language === "ar" ? "text-right pr-3" : ""
                  }`}
                >
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
                    <Link
                      to="/salesproducts"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t("offers")}
                    </Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition">
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>
                      {t("contact")}
                    </Link>
                  </li>
                  <li className="px-4 py-2">
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition text-sm"
                    >
                      {t("signup")}
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
