import React, { useState, useEffect } from "react";
import fatoraLogo from "../assets/fatora.webp";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../lib/authUtils";
import { getBarcode } from "../api";

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
} from "react-icons/fa";

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


const Sidebar = ({ activeTab, setActiveTab, onCloseSidebar, isMobile }) => {
  const { user, userType } = useSelector((state) => state.auth);
  const companyId = user?.id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [barcode, setBarcode] = useState(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  const handleSignOut = () =>
    performLogout(dispatch, navigate, userType);

  const tabs = [
    { label: "Products", icon: <FaTags className="text-[10px]" /> },
    { label: "Sales", icon: <FaShoppingCart className="text-[10px]" /> },
    { label: "Analytics", icon: <FaChartLine className="text-[10px]" /> },
    { label: "Contacts", icon: <FaUsers className="text-[10px]" /> },
    { label: "Followers", icon: <FaUserFriends className="text-[10px]" /> },
    { label: "Notifications", icon: <FaBell className="text-[10px]" /> },
    {
      label: "Fatora",
      icon: <img src={fatoraLogo} alt="Fatora" className="w-3 h-3" />,
    },
    { label: "Settings", icon: <FaCog className="text-[10px]" /> },
  ];

  const getFollowersCount = () => 0;
  const getUnreadNotificationsCount = () => 3;

  const handleDownloadBarcode = () => {
    if (!barcode) return;
    const link = document.createElement("a");
    link.href = barcode;
    link.download = "company-barcode.png";
    link.click();
  };

  // styles (unchanged)
  const fatoraActiveTabStyles =
    "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm";
  const fatoraActiveIconStyles = "bg-white text-white shadow-sm";
  const fatoraHoverStyles =
    "hover:text-blue-600 hover:border-blue-200";

  const activeTabStyles =
    "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300";

  const activeIconStyles = "bg-blue-500 text-white shadow-sm";
  const inactiveIconStyles =
    "bg-gray-100 text-gray-600 group-hover:bg-gray-200";

  useEffect(() => {
    if (!showBarcode || !companyId) return;

    const fetchBarcode = async () => {
      try {
        setLoadingBarcode(true);
        const res = await getBarcode(companyId);
        const barcodeData =
          res.data?.data?.barcode || res.data?.barcode || res.data;
        setBarcode(barcodeData);
      } catch (err) {
        console.error("Failed to load barcode", err);
      } finally {
        setLoadingBarcode(false);
      }
    };

    fetchBarcode();
  }, [showBarcode, companyId]);

  return (
    <aside className="w-52 h-full bg-white/90 backdrop-blur-sm border-r border-gray-200">
      {/* GRID LAYOUT */}
      <div className="h-full grid grid-rows-[auto_1fr_auto] px-3 py-3">

        {/* ================= HEADER ================= */}
        <div className="pt-4 pb-4 border-b border-gray-200 mt-16 sm:mt-16 md:mt-5">
          <div className="flex items-center gap-2 w-full">
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

            {isMobile && (
  <button
    onClick={onCloseSidebar}
    className="ml-auto p-2 rounded-lg hover:bg-gray-100"
    aria-label="Close sidebar"
  >
    <CloseIcon className="w-4 h-4 text-gray-700" />
  </button>
)}

          </div>
        </div>

        {/* ================= MENU ================= */}
        <nav className="flex flex-col gap-2 pt-4">
          {tabs.map((t) => {
            const isActive = activeTab === t.label;
            const isFatora = t.label === "Fatora";

            return (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.label)}
                className={`group flex items-center gap-1.5 px-2.5 py-2.5 rounded-lg transition-all w-full ${
                  isActive
                    ? isFatora
                      ? fatoraActiveTabStyles
                      : activeTabStyles
                    : `${inactiveTabStyles} ${
                        isFatora ? fatoraHoverStyles : ""
                      }`
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    isActive
                      ? isFatora
                        ? fatoraActiveIconStyles
                        : activeIconStyles
                      : inactiveIconStyles
                  }`}
                >
                  {t.icon}
                </div>

                <span className="text-[13px] font-medium truncate">
                  {t.label}
                </span>

                {t.label === "Followers" &&
                  getFollowersCount() > 0 && (
                    <span className="ml-auto bg-green-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getFollowersCount()}
                    </span>
                  )}

                {t.label === "Notifications" &&
                  getUnreadNotificationsCount() > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5">
                      {getUnreadNotificationsCount()}
                    </span>
                  )}

                {isActive && (
                  <FaChevronRight className="ml-auto text-[10px] text-blue-500" />
                )}
              </button>
            );
          })}

          {/* BARCODE */}
          <div className="mt-2">
            <button
              onClick={() => setShowBarcode(!showBarcode)}
              className={`group flex items-center gap-1.5 px-2.5 py-2 rounded-lg w-full ${
                showBarcode ? activeTabStyles : inactiveTabStyles
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center ${
                  showBarcode ? activeIconStyles : inactiveIconStyles
                }`}
              >
                <FaDownload className="text-[10px]" />
              </div>
              <span className="text-[13px] font-medium">Barcode</span>
              <FaChevronDown
                className={`ml-auto text-[10px] transition-transform ${
                  showBarcode ? "rotate-180" : ""
                }`}
              />
            </button>

            {showBarcode && (
              <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                {loadingBarcode ? (
                  <p className="text-xs text-center text-gray-500">
                    Loading barcode...
                  </p>
                ) : barcode ? (
                  <>
                    <img
                      src={barcode}
                      alt="Company Barcode"
                      className="w-full max-w-[90px] mx-auto h-20 object-contain mb-2 border"
                    />
                    <button
                      onClick={handleDownloadBarcode}
                      className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      Download
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-center text-red-500">
                    Barcode not available
                  </p>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ================= LOGOUT ================= */}
        <button
          onClick={handleSignOut}
          className="mt-4 flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/80 text-gray-700 border border-gray-200 hover:text-red-600 transition"
        >
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gray-100">
            <FaSignOutAlt className="text-[10px]" />
          </div>
          <span className="text-[13px] font-medium">Log out</span>
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;
