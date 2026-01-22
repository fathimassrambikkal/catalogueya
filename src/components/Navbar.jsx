import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomerAccountDropdown from "./CustomerAccountDropdown";

import { AiOutlineHeart } from "react-icons/ai";
import { changeLanguage as apiChangeLanguage } from "../api";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

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
    { path: "/contact", label: fw.contact_us },
  ];

  return (
    <div
      className={`absolute mt-3 bg-white/70 backdrop-blur-md shadow-lg rounded-xl w-52 sm:w-60 border border-white/30 z-50 ${
        language === "ar" ? "left-0" : "right-0"
      }`}
    >
      <ul
        className={`flex flex-col text-gray-700 text-center text-sm ${
          language === "ar" ? "text-right pr-3" : ""
        }`}
      >
        {links.map((item) => (
          <li
            key={item.path}
            className="px-4 py-2 hover:bg-white/50   hover:rounded-full transition"
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
   MENU BUTTON (ENTERPRISE)
============================= */
const MenuButton = memo(function MenuButton({ menuOpen, toggleMenu }) {
  return (
    <button
      onClick={toggleMenu}
      className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white/40 hover:bg-white/70 transition-all"
      aria-label="Menu"
    >
      <HiDotsVertical className="text-gray-700 text-base" />
    </button>
  );
});

/* =============================
   FAVOURITES COUNTER
============================= */
const FavouritesCounter = memo(function FavouritesCounter() {
  const favourites = useSelector((state) => state.favourites.items);
  const { i18n } = useTranslation();
  const count = favourites.length;

  return (
    <Link
      to="/favourite"
      className={`relative flex items-center justify-center ${
        i18n.language === "ar" ? "ml-2" : ""
      }`}
    >
      <AiOutlineHeart
        className={`cursor-pointer transition text-lg sm:text-xl ${
          count > 0
            ? "text-red-500 hover:text-red-600"
            : "text-gray-600 hover:text-red-400"
        }`}
      />
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-md leading-none"
        >
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
      className="h-9 px-3 rounded-lg text-sm border border-gray-200 bg-white/30 hover:bg-white/50 transition text-gray-900 min-w-[60px]"
    >
      {language === "en" ? "عربي" : "EN"}
    </button>
  );
});

/* =============================
   NAVBAR (ENTERPRISE)
============================= */
export default function Navbar() {
  const { isAuthenticated, userType, user } = useSelector((state) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);

  const displayName =
    user?.name ||
    [user?.first_name].filter(Boolean).join(" ") ||
    "Customer";

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

  const navigate = useNavigate();

  const preloadDashboard = () => {
    if (userType === "customer") {
      import("../pages/CustomerLogin");
    } else if (userType === "company") {
      import("../pages/CompanyDashboard");
    }
  };

  useEffect(() => {
    setAccountOpen(false);
  }, [isAuthenticated, userType]);

  useEffect(() => {
    if (!accountOpen) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest(".customer-account-container")) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 font-inter transition-all duration-300 ${
        scrolled && isGlassPage
          ? "backdrop-blur-lg bg-white/30 shadow-xl border border-white/20"
          : "bg-white shadow-md"
      }`}
    >
      {/* Container */}
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
         {/* Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src={`${import.meta.env.VITE_ASSET_BASE_URL}/${settings?.logo}`}
            alt="Catalogueya Logo"
            className="h-12 sm:h-14 object-contain ml-3 lg:ml-16"
          />
        </Link>
      </div>

          {/* RIGHT: Actions (Enterprise Structure) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Secondary Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <FavouritesCounter />
              <LanguageToggle
                toggleLanguage={toggleLanguage}
                language={i18n.language}
              />
            </div>

           

            {/* Primary Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Account */}
              {isAuthenticated && userType === "customer" ? (
                <div className="relative customer-account-container">
                  <button
                    onClick={() => setAccountOpen((p) => !p)}
                    className="flex items-center gap-2 h-9 px-2 rounded-full hover:bg-gray-100/60 transition focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <svg
                      className={`hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                        accountOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 8l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.65"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {accountOpen && (
                    <CustomerAccountDropdown onClose={() => setAccountOpen(false)} />
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/sign")}
                  className="h-9 px-3 rounded-lg text-sm border border-gray-300 bg-white/30 hover:bg-white/50 transition text-gray-900 whitespace-nowrap"
                >
                  {fw.login}
                </button>
              )}

              {/* Menu */}
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
          </div>
        </div>
      </div>
    </nav>
  );
}