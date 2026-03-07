import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../lib/authUtils";
import { getBarcode } from "../api";
import { printBarcode, getImageUrl, } from "../companyDashboardApi";

import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

import {
 
  FaChartLine,
  FaCog,
  FaUsers,
 
} from "react-icons/fa";

import {
  
  FaTags,
  FaShoppingCart,

 
  FaSignOutAlt,
 

  FaStar ,
  FaDownload,
  FaChevronDown,
  
  FaUserFriends,
IconBills,
  FaCommentDots,
  FaBell
 
} from "./SvgIcons";


const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


const Sidebar = ({ activeTab, setActiveTab, onCloseSidebar, isMobile, companyInfo, unreadCounts = {}, setTargetConversationId }) => {
  const { user, userType } = useSelector((state) => state.auth);
  const companyId = user?.id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [barcode, setBarcode] = useState(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

    const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
  
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  // Props now provide counts. 
  // We can keep local polling as fallback or just rely on props. 
  // For this refactor, we rely on parent "CompanyDashboard" to provide these values.

  // Clean up unused local state if strictly using props, 
  // but to prevent breaking if props aren't passed immediately during refactor,
  // we can default to props if available.

  /* Count fetching logic moved to CompanyDashboard */

  const handleSignOut = () =>
    performLogout(dispatch, navigate, userType);

const tabs = [
  { key: "products", label: fw.products || "Products", icon: <FaTags className="w-3 h-3" /> },
  { key: "highlights", label: fw.product_highlights || "Product Highlights", icon: <FaShoppingCart className="w-3 h-3" /> },
  { key: "analytics", label: fw.analytics || "Analytics", icon: <FaChartLine className="w-3 h-3" /> },
  { key: "contacts", label: fw.contacts || "Contacts", icon: <FaUsers className="w-4 h-4" /> },
  { key: "messages", label: fw.messages || "Messages", icon: <FaCommentDots className="w-4 h-4" /> },
  { key: "followers", label: fw.followers || "Followers", icon: <FaUserFriends className="w-4 h-3" /> },
  { key: "reviews", label: fw.reviews || "Reviews", icon: <FaStar className="w-3 h-3" /> },
  { key: "bills", label: fw.bills || "Bills", icon: <IconBills className="w-3 h-3" /> },
  { key: "settings", label: fw.settings || "Settings", icon: <FaCog className="w-3 h-3" /> },
];

  const getFollowersCount = () => unreadCounts.followers || 0;
  const getReviewsCount = () => unreadCounts.reviews || 0;
  const getUnreadNotificationsCount = () => unreadCounts.notifications || 0;
  const getUnreadMessagesCount = () => unreadCounts.messages || 0;

  const handleDownloadBarcode = () => {
    if (!barcode) return;
    const link = document.createElement("a");
    link.href = barcode;
    link.download = "company-barcode.png";
    link.click();
  };



 const activeTabStyles =
  "bg-blue-500/10 text-blue-600 shadow-sm border border-blue-200/50";

const inactiveTabStyles =
  "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900";

  const activeIconStyles = "bg-blue-500 text-white shadow-sm";
  const inactiveIconStyles =
    "bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-100";

  useEffect(() => {
    if (!showBarcode || !companyId) return;

    const fetchBarcode = async () => {
      try {
        setLoadingBarcode(true);
        const res = await printBarcode();
        // Updated response processing
        const paths = res.data?.paths || {};
        const barcodeUrl = paths.webp || paths.png || paths.avif || res.data?.data?.barcode;
        setBarcode(barcodeUrl);
      } catch (err) {
        console.error("Failed to load barcode", err);
      } finally {
        setLoadingBarcode(false);
      }
    };

    fetchBarcode();
  }, [showBarcode, companyId]);

  return (
    <aside className="w-52 h-full bg-white border-r border-gray-200">
      {/* GRID LAYOUT */}
      <div className="h-full grid grid-rows-[auto_1fr_auto] px-3 py-3">

        {/* ================= HEADER ================= */}
        <div className="pt-4 pb-4 border-b border-gray-200 mt-16 sm:mt-16 md:mt-5">
          <div className="flex items-center gap-2 w-full">
            <div className="w-9 h-9 border border-gray-100 rounded-full overflow-hidden flex items-center justify-center shadow-sm shrink-0">
              {(companyInfo?.logo || user?.logo) ? (
                <img src={getImageUrl(companyInfo?.logo || user?.logo)} alt={companyInfo?.companyName || user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{(companyInfo?.companyName || user?.name || "C").charAt(0)}</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 break-words">
                {companyInfo?.companyName || user?.name || user?.company_name || "Company"}
              </h2>
              <p className="text-[11px] text-gray-500 truncate">
               {fw.business || "Business"}
              </p>
            </div>

            {isMobile && (
              <button
                onClick={onCloseSidebar}
                className="ml-auto p-2 rounded-lg hover:bg-gray-100 shrink-0"
                aria-label="Close sidebar"
              >
                <CloseIcon className="w-4 h-4 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex flex-col gap-1 pt-3">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            const isBills = t.label === "Bills";

            return (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.key)}
                className={`group flex items-center gap-1 p-2 rounded-xl transition-all duration-200 ease-out w-full ${isActive ? activeTabStyles : inactiveTabStyles
                  }`}
              >
               <div
          className={`w-5 h-5 rounded-lg flex items-center justify-center ${
            isActive ? "bg-blue-100" : "bg-gray-100/80"
          }`}
        >
                  {t.icon}
                </div>

                <span className="text-[13px] font-medium truncate">
                  {t.label}
                </span>

                {t.label === "Messages" &&
                  !isActive &&
                  getUnreadMessagesCount() > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getUnreadMessagesCount()}
                    </span>
                  )}

                {t.label === "Followers" &&
                  !isActive &&
                  getFollowersCount() > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getFollowersCount()}
                    </span>
                  )}

                {t.label === "Notifications" &&
                  !isActive &&
                  getUnreadNotificationsCount() > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getUnreadNotificationsCount()}
                    </span>
                  )}

                {t.label === "Reviews" &&
                  !isActive &&
                  getReviewsCount() > 0 && (
                    <span className="ml-auto bg-blue-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getReviewsCount()}
                    </span>
                  )}

                {isActive && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
              </button>
            );
          })}

          {/* BARCODE */}
          <div className="mt-1">
            <button
              onClick={() => setShowBarcode(!showBarcode)}
              className={`group flex items-center gap-1 p-2 rounded-xl w-full ${showBarcode ? activeTabStyles : inactiveTabStyles
                }`}
            >
          <div
          className={`w-5 h-5 rounded-lg flex items-center justify-center ${
            showBarcode ? "bg-blue-100" : "bg-gray-100/80"
          }`}
        >
          <FaDownload
            className={`w-4 h-4 ${
              showBarcode ? "text-blue-600" : "text-gray-600"
            }`}
          />
        </div>
              <span className="text-[13px] font-medium">{fw.barcode || "Barcode"}</span>
              <FaChevronDown
                className={`ml-auto w-3 h-3 transition-transform ${showBarcode ? "rotate-180" : ""
                  }`}
              />
            </button>

      {showBarcode && (
    <div className="mt-2 p-2 bg-gray-50 rounded-xl border border-gray-200/60">
      {loadingBarcode ? (
        <p className="text-[11px] text-center text-gray-500">
          Loading barcode...
        </p>
      ) : barcode ? (
        <>
          <img
            src={barcode}
            alt="Company Barcode"
            className="w-full max-w-[75px] mx-auto h-8 object-contain mb-2"
          />

          <button
            onClick={handleDownloadBarcode}
            className="w-full py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition"
          >
            {fw.download || "Download"}
          </button>
        </>
      ) : (
        <p className="text-[11px] text-center text-red-500">
          Barcode not available
        </p>
      )}
    </div>
  )}
</div>
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="border-t border-gray-200/40 pt-2">
          <button
          onClick={handleSignOut}
          className="mt-4 flex items-center gap-1.5  bg-white/80 text-gray-700  hover:text-red-600  bg-blue-500  text-[9px] rounded-full px-1.5 py-0.5"
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-blue-50">
            <FaSignOutAlt className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </div>
          <span className="text-[13px] font-medium">{fw.logout || "Logout"}</span>
        </button>
        </div>
      

      </div>
    </aside>
  );
};

export default Sidebar;
