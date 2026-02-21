import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CustomerAccountDropdown from "./CustomerAccountDropdown";
import { performLogout } from "../lib/authUtils";
import { changeLanguage as apiChangeLanguage } from "../api";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";
import { OutlineHeartIcon, UserOutlineIcon } from "../components/SvgIcon";
import { getImageUrl, getNotifications, getUnreadNotificationsCount, markAllNotificationsAsRead } from "../companyDashboardApi";
import { FaBell as FaRegBell, FaHistory } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* =============================
   LOGO COMPONENT
============================= */
const Logo = memo(function Logo({ settings }) {
  const getLogoUrl = () => {
    if (!settings?.logo) return null;

    if (typeof settings.logo === "string") return settings.logo;

    if (typeof settings.logo === "object") {
      const logoPath = settings.logo.webp || settings.logo.avif;
      if (!logoPath) return null;

      const cleanPath = String(logoPath).trim();
      return cleanPath.startsWith("http")
        ? cleanPath
        : `${import.meta.env.VITE_ASSET_BASE_URL || ""}/${cleanPath}`;
    }

    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <Link to="/" className="flex items-center flex-shrink-0">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Catalogueya"
          className="h-12 lg:h-14 w-auto object-contain"
          width="160"
          height="56"
          decoding="async"
          fetchpriority="high"
        />
      ) : (
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded" />
      )}
    </Link>
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
      className={`relative flex items-center justify-center ${i18n.language === "ar" ? "ml-2" : ""
        }`}
    >
      <OutlineHeartIcon
        filled={count > 0}
        size={20}
        className={`cursor-pointer transition ${count > 0
          ? "text-red-500 hover:text-red-600"
          : "text-gray-600 hover:text-red-400"
          }`}
      />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
});

/* =============================
   LANGUAGE TOGGLE (ENTERPRISE)
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
      className="relative px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow"
      aria-label="Toggle language"
    >
      <span className="relative z-10">{language === "en" ? "عربي" : "EN"}</span>
    </button>
  );
});

/* =============================
   AVATAR BUTTON (UNIVERSAL)
============================= */
const AvatarButton = memo(function AvatarButton({
  isAuthenticated,
  displayName,
  onClick,
  accountOpen,
}) {
  if (isAuthenticated) {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 transition focus:outline-none text-white"
        aria-haspopup="menu"
        aria-expanded={accountOpen}
      >
        <span className="text-xs font-medium">
          {displayName?.charAt(0).toUpperCase() || "C"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-9 h-9 rounded-full  border border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-600 hover:text-gray-800 shadow-sm hover:shadow-md"
      aria-haspopup="menu"
      aria-expanded={accountOpen}
    >
      <UserOutlineIcon className="w-4 h-4" />
    </button>
  );
});

/* =============================
   NAVBAR (ENTERPRISE)
============================= */
export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, userType, user } = useSelector((state) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Notifications state for Company */
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (userType !== 'company') return;
    try {
      const res = await getUnreadNotificationsCount();
      if (res.data && res.data.unread !== undefined) {
        setUnreadNotifCount(res.data.unread);
      }
    } catch (e) {
      console.error("Failed to fetch unread count in Navbar", e);
    }
  }, [userType]);

  const fetchAllNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const res = await getNotifications();
      const data = res.data?.data || {};
      const flattened = [];
      Object.keys(data).forEach(category => {
        if (Array.isArray(data[category])) {
          data[category].forEach(item => flattened.push({ ...item, category }));
        }
      });
      setNotifications(flattened.slice(0, 10));

      await markAllNotificationsAsRead();
      setUnreadNotifCount(0);
    } catch (e) {
      console.error("Failed to fetch notifications in Navbar", e);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    if (userType === 'company') {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userType, fetchUnreadCount]);

  const handleNotifClick = (notif) => {
    setShowNotifDropdown(false);
    if (notif.data?.type === 'message' && notif.data?.conversationId) {
      navigate("/company-dashboard", {
        state: {
          restoreTab: "Messages",
          targetConversationId: notif.data.conversationId
        }
      });
    } else {
      navigate("/company-dashboard", { state: { restoreTab: "Notifications" } });
    }
  };

  const displayName =
    user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "Customer";

  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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

  const toggleAccount = useCallback(() => {
    setAccountOpen((prev) => !prev);
  }, []);

  /* Outside click close for account dropdown */
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

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Preload dashboard on hover */
  const preloadDashboard = useCallback(() => {
    if (userType === "customer") {
      import("../pages/CustomerLogin");
    } else if (userType === "company") {
      import("../pages/CompanyDashboard");
    }
  }, [userType]);

  /* Close dropdown on auth change */
  useEffect(() => {
    setAccountOpen(false);
  }, [isAuthenticated, userType]);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 font-inter transition-all duration-300 ${scrolled && isGlassPage
        ? "backdrop-blur-lg bg-white/30 shadow-xl border border-white/20"
        : "bg-white shadow-md"
        }`}
    >
      {/* Container */}
      <div className="mx-auto w-full max-w-[1440px] pl-6 pr-4 sm:pl-8 sm:pr-6">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-16"
            }`}
        >
          {/* Logo */}
          <Logo settings={settings} />

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 ltr:ml-auto rtl:mr-auto">
            {/* ❤️ Heart - Hidden for company */}
            {userType !== 'company' && <FavouritesCounter />}

            {/* 📤 Sent Notifications - Only for company */}
            {userType === 'company' && (
              <button
                onClick={() => navigate("/company-dashboard", { state: { restoreTab: "Notifications" } })}
                className="p-2 rounded-full bg-gray-100/50 text-gray-500 hover:bg-gray-200/80 transition-all duration-300"
                title="Sent Notifications History"
              >
                <div className="relative flex items-center justify-center">
                  <FaHistory className="text-xl opacity-60" />
                  <FaRegBell className="absolute text-[8px] font-bold" />
                </div>
              </button>
            )}

            {/* 🔔 Notifications - Only for company */}
            {userType === 'company' && (
              <div className="relative">
                <button
                  onClick={() => {
                    const nextState = !showNotifDropdown;
                    setShowNotifDropdown(nextState);
                    if (nextState) fetchAllNotifications();
                  }}
                  className={`
                    p-2 rounded-full transition-all duration-300 relative
                    ${showNotifDropdown ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100/50 text-gray-500 hover:bg-gray-200/80'}
                  `}
                >
                  <FaRegBell className={`text-base ${unreadNotifCount > 0 && !showNotifDropdown ? 'animate-pulse' : ''}`} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden flex flex-col"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-blue-50/20">
                        <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Notifications</span>
                        <button
                          onClick={() => {
                            markAllNotificationsAsRead();
                            setUnreadNotifCount(0);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-white px-2 py-1 rounded-lg shadow-sm"
                        >
                          Read All
                        </button>
                      </div>

                      <div className="max-h-[360px] overflow-y-auto no-scrollbar py-1">
                        {loadingNotifs ? (
                          <div className="p-8 text-center text-gray-400">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">Syncing</p>
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((n, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleNotifClick(n)}
                              className="w-full px-5 py-3.5 flex gap-3.5 text-left hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 group"
                            >
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                <FaRegBell className="text-xs" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                  {n.notification?.title || "New Message"}
                                </p>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight mt-0.5 font-medium">
                                  {n.notification?.body || n.data?.body || "Tap to view details"}
                                </p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-10 text-center text-gray-300">
                            <p className="text-sm font-black italic">Perfect Silence</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}


            {/* 🌐 Language - Hidden for company */}
            {userType !== 'company' && (
              <LanguageToggle
                toggleLanguage={toggleLanguage}
                language={i18n.language}
              />
            )}

            {/* 🔐 Avatar Dropdown (Mixed Logic) */}
            <div className="relative customer-account-container">
              {userType === 'company' ? (
                <>
                  <button
                    onClick={() => setAccountOpen((p) => !p)}
                    className="flex items-center gap-2.5 h-10 px-1.5 rounded-full hover:bg-gray-100/60 transition focus:outline-none border border-gray-200/50 bg-white/40 backdrop-blur-sm shadow-sm"
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow-sm shrink-0">
                      {getImageUrl(user?.logo || user?.image || user?.photo) ? (
                        <img
                          src={getImageUrl(user?.logo || user?.image || user?.photo)}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerText = displayName.charAt(0).toUpperCase();
                          }}
                          alt=""
                        />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="hidden md:flex flex-col items-start pr-1">
                      <span className="text-xs font-bold text-gray-800 truncate max-w-[120px] leading-tight">
                        {displayName}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium leading-tight">
                        Business Account
                      </span>
                    </div>

                    <svg
                      className={`hidden sm:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 8l4 4 4-4" stroke="currentColor" fill="none" />
                    </svg>
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-50 animate-fadeIn text-left">
                      {/* Header */}
                      <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden shadow-inner shrink-0">
                          {getImageUrl(user?.logo) ? (
                            <img src={getImageUrl(user?.logo)} className="w-full h-full object-cover" alt="" />
                          ) : (
                            displayName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                          <p className="text-[11px] text-gray-500 truncate font-medium">{user?.email}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          to="/company-dashboard"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-500 hover:text-white rounded-xl transition-all font-semibold group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                          </div>
                          Dashboard
                        </Link>

                        <div className="h-px bg-gray-100 my-1 mx-2" />

                        <button
                          onClick={() => performLogout(dispatch, navigate, 'company')}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all font-semibold group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <AvatarButton
                    isAuthenticated={isAuthenticated && userType === "customer"}
                    displayName={displayName}
                    onClick={toggleAccount}
                    accountOpen={accountOpen}
                  />

                  {accountOpen && (
                    <CustomerAccountDropdown
                      isAuthenticated={isAuthenticated && userType === "customer"}
                      onClose={() => setAccountOpen(false)}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}