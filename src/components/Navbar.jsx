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
      <HiDotsVertical className=" text-gray-700
    text-sm sm:text-xs md:text-lg lg:text-lg xl:text-xl
    
    " />
    </button>
  );
});

/* =============================
   FAVOURITES COUNTER (FIXED - NO AUTH LOGIC)
============================= */
const FavouritesCounter = memo(function FavouritesCounter() {
  const favourites = useSelector((state) => state.favourites.items);
  const { i18n } = useTranslation();
  const count = favourites.length;

  return (
    <Link
      to="/favourite"
      className={`relative ${i18n.language === "ar" ? "ml-2" : ""}`}
    >
      <AiOutlineHeart
        className={` cursor-pointer transition text-base sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl ${
          count > 0
            ? "text-red-500 hover:text-red-600"
            : "text-gray-600 hover:text-red-400"
        }`}
      />
      {count > 0 && (
        <span
          className=" absolute
        -top-1.5 sm:-top-2
        -right-1.5 sm:-right-2
        bg-red-500 text-white
        text-[9px] sm:text-[10px] md:text-xs
        rounded-full
        px-1 sm:px-1.5
        py-0.5
        shadow-md
        leading-none"
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
      className="border border-gray-300 text-gray-900
      px-2 py-1 sm:px-3 sm:py-1 rounded-lg md:rounded-xl
      hover:bg-white/50 transition text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base backdrop-blur-md"
    >
      {language === "en" ? "عربي" : "EN"}
    </button>
  );
});

/* =============================
   NAVBAR (MAIN)
============================= */
export default function Navbar() {
  // ✅ FIX 1 & 2: Declare auth state and accountOpen in Navbar
  const { isAuthenticated, userType, user } = useSelector((state) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);

  // ✅ FIX 3: Calculate displayName in Navbar
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

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/sign");
      return;
    }

    if (userType === "customer") {
      navigate("/customer-login");
    } else if (userType === "company") {
      navigate("/company-dashboard");
    }
  };

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
            src={`${import.meta.env.VITE_ASSET_BASE_URL}/${settings?.logo}`}
            alt="Catalogueya Logo"
            className="h-12 sm:h-14 object-contain ml-3 lg:ml-16"
          />
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 sm:space-x-5 md:mr-20">
        <FavouritesCounter />

        {/* ✅ FIX 3: Customer Account Dropdown (now has access to accountOpen and displayName) */}
       {isAuthenticated && userType === "customer" ? (
  <div className="relative customer-account-container">
<button
  onMouseEnter={preloadDashboard}
  onClick={() => setAccountOpen((prev) => !prev)}
  className="
    group
    flex items-center gap-[4px]
    p-0.5
    rounded-full
    transition
    focus:outline-none
  "
  aria-haspopup="menu"
  aria-expanded={accountOpen}
>
  {/* Avatar */}
  <div
    className="
      w-6 h-6 sm:w-7 sm:h-7
      rounded-full
      bg-blue-600
      flex items-center justify-center
      text-white
      text-[11px] sm:text-xs
      font-medium
      leading-none
      select-none
      ring-1 ring-transparent
      group-hover:ring-blue-400/40
      group-focus:ring-blue-500/50
      transition
    "
  >
    {displayName.charAt(0).toUpperCase()}
  </div>

  {/* Caret – balanced size */}
  <svg
    viewBox="0 0 20 20"
    className={`
      w-[15px] h-[15px]
      text-gray-400
      transition-transform duration-200
      ${accountOpen ? "rotate-180" : ""}
      group-hover:text-gray-500
    `}
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
    className="border border-gray-300 text-gray-900
    px-2 sm:px-3 py-1 sm:py-2 rounded-lg md:rounded-xl
    bg-white/30 hover:bg-white/50 transition text-xs sm:text-sm"
  >
    {fw.login}
  </button>
)}


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