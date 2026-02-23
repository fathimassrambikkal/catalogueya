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
   ANIMATED HAMBURGER ICON (SVG ONLY)
============================= */
const AnimatedHamburgerIcon = memo(function AnimatedHamburgerIcon({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative w-8 h-8 flex items-center justify-center text-xs font-medium rounded-lg border border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <svg
        className="w-6 h-6 text-gray-700"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      >
        {/* All lines as one path with morphing */}
        <path
          d={isOpen 
            ? "M6 6L18 18 M12 12L12 12 M6 18L18 6" 
            : "M6 8L18 8 M6 12L18 12 M6 16L18 16"
          }
          className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
      </svg>
      
      {/* Subtle dot indicator for active state */}
      <span 
        className={`
          absolute -bottom-1 left-1/2 -translate-x-1/2
          w-1 h-1 rounded-full bg-gray-400
          transition-all duration-300
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
        `}
      />
    </button>
  );
});

/* =============================
   NAVBAR (ENTERPRISE)
============================= */
export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, userType, user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
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
            {/*  Heart - Hidden for company */}
            {userType !== 'company' && <FavouritesCounter />}

            {/*  Sent Notifications - Only for company */}
            {userType === 'company' && (
           <button
  onClick={() => navigate("/company-dashboard", { state: { restoreTab: "Notifications" } })}
  className="group p-2.5 rounded-xl bg-white text-gray-400 hover:text-gray-900 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
  title="Sent Notifications History"
>
  <div className="relative flex items-center justify-center">
    <FaHistory className="text-base transition-transform group-hover:scale-105" />
    <FaRegBell className="absolute text-[6px] font-medium opacity-80 group-hover:opacity-100" />
  </div>
  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
</button>
            )}

            {/*  Notifications - Only for company */}
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

                {showNotifDropdown && (
                  <div 
                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden flex flex-col animate-notification-dropdown"
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
                  </div>
                )}
              </div>
            )}

            {/*  Language - Hidden for company */}
            {userType !== 'company' && (
              <LanguageToggle
                toggleLanguage={toggleLanguage}
                language={i18n.language}
              />
            )}

            {/*  Avatar Dropdown with Animated Hamburger */}
            <div className="relative customer-account-container flex items-center gap-2">
              {/*  Avatar */}
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/sign");
                  } else if (userType === "company") {
                    navigate("/company-dashboard");
                  } else {
                    navigate("/customer-login");
                  }
                }}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white overflow-hidden hover:border-gray-300 transition-colors duration-200"
              >
                {/*  BEFORE LOGIN → Show Outline Icon */}
                {!isAuthenticated && (
                  <UserOutlineIcon className="w-4 h-4 text-gray-600" />
                )}

                {/*  CUSTOMER LOGIN → Show First Letter */}
                {isAuthenticated && userType === "customer" && (
                  <span className="text-xs font-semibold p-4 border border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow">
                    {displayName?.charAt(0)?.toUpperCase()}
                  </span>
                )}

                {/*  COMPANY LOGIN → Show Logo Image */}
                {isAuthenticated && userType === "company" && (
                  <>
                    {getImageUrl(user?.logo || user?.image) ? (
                      <img
                        src={getImageUrl(user?.logo || user?.image)}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-800">
                        {displayName?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </>
                )}
              </button>
              
              {/*  Animated Hamburger Icon (SVG Only) */}
              <AnimatedHamburgerIcon
                isOpen={accountOpen}
                onClick={() => setAccountOpen((p) => !p)}
              />

              {/* Unified Dropdown */}
              <div
                className={`
                  absolute right-0 mt-3 origin-top-right
                  transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${accountOpen
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}
                `}
              >
                <CustomerAccountDropdown
                  isAuthenticated={isAuthenticated}
                  userType={userType}
                  onClose={() => setAccountOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations to your global styles  */}
      <style >{`
        @keyframes notificationDropdown {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-notification-dropdown {
          animation: notificationDropdown 0.2s ease-out forwards;
          transform-origin: top right;
        }
      `}</style>
    </nav>
  );
}