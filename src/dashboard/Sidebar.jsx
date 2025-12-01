import React, { useState } from "react";
import barImage from "../assets/bar.jpg";
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
  FaBell
} from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [showBarcode, setShowBarcode] = useState(false);

  const tabs = [
    { label: "Products", icon: <FaTags className="text-[10px]" /> },
    { label: "Sales", icon: <FaShoppingCart className="text-[10px]" /> },
    { label: "Analytics", icon: <FaChartLine className="text-[10px]" /> },
    { label: "Contacts", icon: <FaUsers className="text-[10px]" /> },
    { label: "Followers", icon: <FaUserFriends className="text-[10px]" /> },
    { label: "Notifications", icon: <FaBell className="text-[10px]" /> },
    { label: "Settings", icon: <FaCog className="text-[10px]" /> },
  ];

  const getFollowersCount = () => 0;
  const getUnreadNotificationsCount = () => 3;

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/sign";
  };

  // REAL DOWNLOAD FUNCTION
  const handleDownloadBarcode = () => {
    const link = document.createElement("a");
    link.href = barImage;
    link.download = "barcode.jpg";
    link.click();
  };

  const activeTabStyles =
    "bg-blue-500/10 text-blue-600 border border-blue-200 shadow";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200 shadow-inner hover:text-blue-500 hover:border-blue-100";

  const activeIconStyles = "bg-blue-500 text-white shadow";
  const inactiveIconStyles =
    "bg-gray-100 text-gray-600 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-500";

  return (
    <div
      className="
        bg-white/80 backdrop-blur-lg text-gray-900
        h-full p-3 flex flex-col
        border-r border-gray-200/60
        w-52 shrink-0
        overflow-x-hidden
        min-w-0
      "
    >

      {/* USER PROFILE */}
      <div className="p-2 border-b border-gray-200/60 mb-3 mt-5 min-w-0">
        <div className="flex items-center gap-2 justify-start min-w-0">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow">
            <span className="text-white font-medium text-xs">C</span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              Company
            </h2>
            <p className="text-[11px] text-gray-600 truncate">
              Business Account
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto overflow-x-hidden min-w-0">
        {tabs.map((t) => {
          const isActive = activeTab === t.label;
          return (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all w-full min-w-0 ${
                isActive ? activeTabStyles : inactiveTabStyles
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                  isActive ? activeIconStyles : inactiveIconStyles
                }`}
              >
                {t.icon}
              </div>

              <span className="text-[13px] font-medium truncate flex-1 min-w-0">
                {t.label}
              </span>

              {t.label === "Followers" && getFollowersCount() > 0 && (
                <span className="bg-green-500 text-white text-[9px] rounded-full px-1.5 py-0.5 flex-shrink-0">
                  {getFollowersCount()}
                </span>
              )}

              {t.label === "Notifications" &&
                getUnreadNotificationsCount() > 0 && (
                  <span className="bg-red-500 text-white text-[9px] rounded-full px-1.5 py-0.5 flex-shrink-0">
                    {getUnreadNotificationsCount()}
                  </span>
                )}

              {isActive && (
                <FaChevronRight className="text-blue-500 text-[10px] flex-shrink-0" />
              )}
            </button>
          );
        })}

        {/* BARCODE SECTION */}
        <div className="relative w-full overflow-x-hidden min-w-0">
          <button
            onClick={() => setShowBarcode(!showBarcode)}
            className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg w-full min-w-0 ${
              showBarcode ? activeTabStyles : inactiveTabStyles
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                showBarcode ? activeIconStyles : inactiveIconStyles
              }`}
            >
              <FaDownload className="text-[10px]" />
            </div>

            <span className="text-[13px] font-medium truncate flex-1 min-w-0">
              Barcode
            </span>

            <FaChevronDown
              className={`text-[10px] transition-transform flex-shrink-0 ${
                showBarcode ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`transition-all duration-300 overflow-hidden w-full max-w-full min-w-0 ${
              showBarcode ? "max-h-48 mt-2" : "max-h-0"
            }`}
          >
            <div className="p-3 bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200 shadow w-full max-w-full overflow-x-hidden min-w-0">

              <img
                src={barImage}
                alt="Barcode"
                className="w-full max-w-[90px] mx-auto h-20 object-contain rounded-lg mb-2 border"
              />

              <button
                onClick={handleDownloadBarcode}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg font-medium shadow hover:scale-[1.03] transition text-sm"
              >
                <FaDownload className="text-[10px] inline-block mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SIGN OUT */}
      <button
        onClick={handleSignOut}
        className="group mt-1 mb-10 flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/60 text-gray-700 border border-gray-200 shadow-inner hover:text-red-500 transition w-full min-w-0"
      >
        <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gray-100 text-gray-600 flex-shrink-0">
          <FaSignOutAlt className="text-[10px]" />
        </div>

        <span className="text-[13px] font-medium truncate flex-1 min-w-0">
          Sign Out
        </span>
      </button>

      {/* STATUS */}
      <div className="mt-3 pt-3 border-t border-gray-200 min-w-0">
        <div className="flex items-center justify-between text-[11px] text-gray-600 min-w-0">
          <span className="truncate flex-1 min-w-0">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
