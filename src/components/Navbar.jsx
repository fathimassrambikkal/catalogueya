import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useFavourites } from "../context/FavouriteContext";
import { AiOutlineHeart } from "react-icons/ai";
import { changeLanguage as apiChangeLanguage } from "../api";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";
import logo from "../assets/logo.png";

/* =============================
   DROPDOWN MENU (PURE CSS)
============================= */
const DropdownMenu = memo(function DropdownMenu({
  isOpen,
  language,
  fixedWords,
  t,
  closeMenu,
}) {
  if (!isOpen) return null;
const fw = fixedWords?.fixed_words || {};

const links = [
  { path: "/", label: fw.home },
  { path: "/about", label: fw.aboute },       
  { path: "/salesproducts", label: fw.ofer }, 
  { path: "/contact", label: fw.contact_us }, 
];




  return (
    <div
      className={`dropdown-apple absolute mt-3 bg-white/70 backdrop-blur-md
      shadow-lg rounded-xl w-52 sm:w-60 border border-white/30 z-50
      ${language === "ar" ? "left-0" : "right-0"}`}
    >
      <ul
        className={`flex flex-col text-gray-700 text-center text-sm ${
          language === "ar" ? "text-right pr-3" : ""
        }`}
      >
        {links.map((item) => (
          <li
            key={item.path}
            className="px-4 py-2 hover:bg-white/50 hover:rounded-full transition"
          >
            <Link to={item.path} onClick={closeMenu}>
              {item.label}
            </Link>
          </li>
        ))}
        <li className="px-4 py-2">
          <Link
            to="/register"
            onClick={closeMenu}
            className="block bg-blue-500 text-white px-3 py-1.5 rounded-full hover:bg-blue-600 transition text-sm"
          >
          {fw.singup}



          </Link>
        </li>
      </ul>
    </div>
  );
});

/* =============================
   MENU BUTTON (UNCHANGED)
============================= */
const MenuButton = memo(function MenuButton({ menuOpen, toggleMenu }) {
  return (
    <button
      onClick={toggleMenu}
      className="border border-gray-300 text-xs sm:text-sm flex items-center
      bg-white/30 text-gray-900 px-2 py-1 sm:px-2 sm:py-2
      rounded-lg md:rounded-xl hover:bg-white/50 transition backdrop-blur-md"
    >
      <HiDotsHorizontal className="text-gray-700 text-xl" />
    </button>
  );
});

/* =============================
   FAVOURITES COUNTER
============================= */
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
          count > 0
            ? "text-red-500 hover:text-red-600"
            : "text-gray-600 hover:text-red-400"
        }`}
      />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white
        text-[10px] sm:text-xs rounded-full px-1.5 py-0.5 shadow-md">
          {count}
        </span>
      )}
    </Link>
  );
});

/* =============================
   LANGUAGE TOGGLE
============================= */
const LanguageToggle = memo(function LanguageToggle({
  toggleLanguage,
  language,
}) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLanguage();
  };

  return (
    <button
      onClick={handleClick}
      className="border border-gray-300 text-gray-900
      px-2 py-1 sm:px-3 sm:py-2 rounded-lg md:rounded-xl
      hover:bg-white/50 transition text-xs sm:text-sm backdrop-blur-md"
    >
      {language === "en" ? "عربي" : "EN"}
    </button>
  );
});

/* =============================
   NAVBAR (MAIN)
============================= */
export default function Navbar() {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

const fw = fixedWords?.fixed_words || {};

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { t, i18n } = useTranslation();
  const location = useLocation();

  const glassPages = useMemo(
    () => ["/", "/about", "/salesproducts", "/contact"],
    []
  );
  const isGlassPage = useMemo(
    () => glassPages.includes(location.pathname),
    [location.pathname, glassPages]
  );

  /* Language init */
  useEffect(() => {
    const cookieLang = Cookies.get("lang") || "en";
    if (i18n.language !== cookieLang) {
      i18n.changeLanguage(cookieLang);
      document.documentElement.setAttribute(
        "dir",
        cookieLang === "ar" ? "rtl" : "ltr"
      );
    }
  }, [i18n]);

  const toggleLanguage = useCallback(async () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    Cookies.set("lang", newLang, { expires: 30, path: "/", sameSite: "lax" });

    try {
      await apiChangeLanguage();
    } finally {
      window.location.reload();
    }
  }, [i18n]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Outside click close */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu-container")) setMenuOpen(false);
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
        <FavouritesCounter />

        <Link
          to="/sign"
          className="border border-gray-300 text-gray-900 hover:text-blue-500
          px-2 sm:px-3 py-1 sm:py-2 rounded-lg md:rounded-xl
          transition text-xs sm:text-sm flex items-center justify-center
          bg-white/30 hover:bg-white/50"
        >
        {fw.login}


        </Link>

        <LanguageToggle
          toggleLanguage={toggleLanguage}
          language={i18n.language}
        />

        <div className="relative menu-container">
          <MenuButton menuOpen={menuOpen} toggleMenu={toggleMenu} />

          <DropdownMenu
            isOpen={menuOpen}
            language={i18n.language}
            fixedWords={fixedWords}
            t={t}
            closeMenu={() => setMenuOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}
