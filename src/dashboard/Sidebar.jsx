import React, { useState, useEffect } from "react";

import fatoraLogo from "../assets/fatora.webp";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { performLogout } from "../lib/authUtils";
import { getCompanyBarcode } from "../companyApi";



import {
  FaTags,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
  FaUsers,
  FaDownload,
  FaChevronDown,
  FaChevronRight,
  FaUserFriends,
  FaBell,
  FaRegStar
} from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab }) => {

  const { user } = useSelector((state) => state.auth);
  const companyId = user?.id;
  const [barcode, setBarcode] = useState(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);

  const [showBarcode, setShowBarcode] = useState(false);
  const dispatch = useDispatch();
  const { userType } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleSignOut = () => {
    performLogout(dispatch, navigate, userType);
  };



  const tabs = [
    { label: "Products", icon: <FaTags className="text-[10px]" /> },
    { label: "Sales", icon: <FaShoppingCart className="text-[10px]" /> },
    { label: "Analytics", icon: <FaChartLine className="text-[10px]" /> },
    { label: "Contacts", icon: <FaUsers className="text-[10px]" /> },
    { label: "Followers", icon: <FaUserFriends className="text-[10px]" /> },
    { label: "Reviews", icon: <FaRegStar className="text-[10px]" /> },
    { label: "Notifications", icon: <FaBell className="text-[10px]" /> },
    { label: "Fatora", icon: <img src={fatoraLogo} alt="Fatora" className="w-3 h-3 object-contain" /> },
    { label: "Settings", icon: <FaCog className="text-[10px]" /> },
  ];

  // Removed duplicate helper functions




  const handleDownloadBarcode = () => {
    if (!barcode) return;

    const link = document.createElement("a");
    link.href = barcode;
    link.download = "company-barcode.png";
    link.click();
  };



  // FATORA STYLES
  const fatoraActiveTabStyles = "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm";
  const fatoraActiveIconStyles = "bg-white text-white shadow-sm";
  const fatoraHoverStyles = "hover:text-blue-600 hover:border-blue-200";

  // REGULAR STYLES
  const activeTabStyles = "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm";
  const inactiveTabStyles = "bg-white/60 text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  const activeIconStyles = "bg-blue-500 text-white shadow-sm";
  const inactiveIconStyles = "bg-gray-100 text-gray-600 group-hover:bg-gray-200";
  useEffect(() => {
    if (!showBarcode || !companyId) return;

    const fetchBarcode = async () => {
      try {
        setLoadingBarcode(true);
        const res = await getCompanyBarcode();

        // The API returns { paths: { png: "http...", ... } }
        let barcodeData = res.data?.paths?.png || res.data?.paths?.webp || res.data?.barcode || res.data;

        // If it's the full response object, try to find the path
        if (typeof barcodeData === 'object' && barcodeData !== null) {
          barcodeData = barcodeData.png || barcodeData.webp || barcodeData.avif;
        }

        // Handle potential HTTP/HTTPS mixed content issues
        if (typeof barcodeData === 'string' && barcodeData.startsWith("http://")) {
          // If the current window is HTTPS, we should try to use HTTPS for the barcode too
          if (window.location.protocol === "https:") {
            barcodeData = barcodeData.replace("http://", "https://");
          }
        }

        setBarcode(barcodeData);
      } catch (err) {
        console.error("❌ Failed to load barcode", err);
      } finally {
        setLoadingBarcode(false);
      }
    };

    fetchBarcode();
  }, [showBarcode, companyId]);

  /* ✅ NOTIFICATIONS COUNT */
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await import("../api").then(m => m.getUnreadNotificationCount());
      // Response: { unread: 11 }
      const count = res.data?.unread || 0;
      setUnreadCount(count);
    } catch (err) {
      console.error("❌ Failed to fetch unread count", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUnreadCount();

    // Listen for updates from Notifications page
    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener("notificationsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("notificationsUpdated", handleUpdate);
    };
  }, [user]);

  /* -----------------------------------------------------
      Helpers
  -------------------------------------------------------*/
  const getFollowersCount = () => 0; // Placeholder for now
  const getUnreadNotificationsCount = () => unreadCount;




  return (
    <div
      className="
        bg-white/90 backdrop-blur-sm text-gray-900
        h-full p-3 flex flex-col
        border-r border-gray-200
        w-52 shrink-0
        overflow-x-hidden
        min-w-0
      "
    >

      {/* USER PROFILE */}
      <div className="p-2 border-b border-gray-200 mb-4 mt-6 min-w-0">
        <div className="flex items-center gap-2 justify-start min-w-0">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-medium text-xs">C</span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              Company
            </h2>
            <p className="text-[11px] text-gray-500 truncate">
              Business Account
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden min-w-0">
        {tabs.map((t) => {
          const isActive = activeTab === t.label;
          const isFatora = t.label === "Fatora";

          return (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`group flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-all w-full min-w-0 ${isActive
                ? (isFatora ? fatoraActiveTabStyles : activeTabStyles)
                : `${inactiveTabStyles} ${isFatora ? fatoraHoverStyles : ""}`
                }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${isActive
                  ? (isFatora ? fatoraActiveIconStyles : activeIconStyles)
                  : (isFatora ? 'bg-gray-100 text-gray-600 group-hover:bg-blue-100' : inactiveIconStyles)
                  }`}
              >
                {t.icon}
              </div>

              <span className={`text-[13px] font-medium truncate flex-none max-w-fit text-left ${isActive && isFatora ? "text-blue-600" : ""
                }`}>
                {t.label}
              </span>

              {t.label === "Followers" && getFollowersCount() > 0 && (
                <span className="ml-auto bg-green-500 text-white text-[9px] rounded-full px-1.5 py-0.5 flex-shrink-0">
                  {getFollowersCount()}
                </span>
              )}

              {t.label === "Notifications" &&
                getUnreadNotificationsCount() > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5 flex-shrink-0">
                    {getUnreadNotificationsCount()}
                  </span>
                )}

              {isActive && (
                <FaChevronRight className={`ml-auto text-[10px] flex-shrink-0 ${isFatora ? "text-blue-500" : "text-blue-500"
                  }`} />
              )}
            </button>
          );
        })}

        {/* BARCODE SECTION */}
        <div className="relative w-full overflow-x-hidden min-w-0 mt-1">
          <button
            onClick={() => setShowBarcode(!showBarcode)}
            className={`group flex items-center gap-1.5 px-2.5 py-2 rounded-lg w-full min-w-0 ${showBarcode ? activeTabStyles : inactiveTabStyles
              }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${showBarcode ? activeIconStyles : inactiveIconStyles
                }`}
            >
              <FaDownload className="text-[10px]" />
            </div>

            <span className="text-[13px] font-medium truncate flex-none max-w-fit text-left">
              Barcode
            </span>

            <FaChevronDown
              className={`ml-auto text-[10px] transition-transform flex-shrink-0 text-gray-400 ${showBarcode ? "rotate-180" : ""
                }`}
            />
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden w-full max-w-full min-w-0 ${showBarcode ? "max-h-48 mt-2" : "max-h-0"
              }`}
          >
            <div className="p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm w-full max-w-full overflow-x-hidden min-w-0">

              {loadingBarcode ? (
                <p className="text-xs text-center text-gray-500">
                  Loading barcode...
                </p>
              ) : barcode ? (
                <img
                  src={barcode}
                  alt="Company Barcode"
                  className="w-full max-w-[90px] mx-auto h-20 object-contain rounded mb-2 border border-gray-200"
                />
              ) : (
                <p className="text-xs text-center text-red-500">
                  Barcode not available
                </p>
              )}

              <button
                onClick={handleDownloadBarcode}
                disabled={!barcode}
                className={`w-full px-3 py-2 rounded-lg font-medium shadow-sm transition text-sm flex items-center justify-center ${barcode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <FaDownload className="text-xs mr-2" />
                Download
              </button>

            </div>
          </div>

        </div>
      </nav>

      {/* SIGN OUT */}
      <button
        onClick={handleSignOut}
        className="group mt-2 mb-8 flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/80 text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-red-600 transition w-full min-w-0"
      >
        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gray-100 text-gray-600 flex-shrink-0 group-hover:bg-red-50 group-hover:text-red-500">
          <FaSignOutAlt className="text-[10px]" />
        </div>

        <span className="text-[13px] font-medium truncate flex-none max-w-fit text-left">
          Log out
        </span>
      </button>

      {/* STATUS */}
      <div className="mt-auto pt-3 border-t border-gray-200 min-w-0">
        <div className="flex items-center justify-between text-[11px] text-gray-600 min-w-0">
          <span className="truncate flex-1 min-w-0">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;