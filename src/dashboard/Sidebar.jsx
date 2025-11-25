import React, { useState } from "react";
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
  FaUserFriends
} from "react-icons/fa";
import barImage from "../assets/bar.jpg";
import { useFollowers } from "../context/FollowersContext";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [showBarcode, setShowBarcode] = useState(false);
  const { getFollowersCount } = useFollowers();

  const tabs = [
    { label: "Products", icon: <FaTags className="text-sm" /> },
    { label: "Sales", icon: <FaShoppingCart className="text-sm" /> },
    { label: "Analytics", icon: <FaChartLine className="text-sm" /> },
    { label: "Contacts", icon: <FaUsers className="text-sm" /> },
    { label: "Followers", icon: <FaUserFriends className="text-sm" /> }, // NEW
    { label: "Settings", icon: <FaCog className="text-sm" /> },
  ];

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/sign";
  };

  const handleDownloadBarcode = () => {
    const link = document.createElement("a");
    link.href = barImage;
    link.download = "barcode.jpg";
    link.click();
  };

  const activeTabStyles =
    "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg shadow-blue-200/50";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:border-blue-100";

  const activeIconStyles = "bg-blue-500 text-white shadow-md";
  const inactiveIconStyles =
    "bg-gray-100 text-gray-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] group-hover:bg-blue-50 group-hover:text-blue-500";

  return (
    <div className="bg-white/80 backdrop-blur-lg text-gray-900 h-full p-3 flex flex-col border-r border-gray-200/60 w-48">
      
      {/* USER PROFILE */}
      <div className="p-3 border-b border-gray-200/60 mb-4 mt-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-medium text-sm">C</span>
          </div>
          <div className="flex-1 ml-3">
            <h2 className="text-base font-semibold text-gray-900">Company</h2>
            <p className="text-xs text-gray-600">Business Account</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 flex flex-col gap-1">
        {tabs.map((t) => {
          const isActive = activeTab === t.label;
          const showBadge = t.label === "Followers" && getFollowersCount() > 0;
          
          return (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`group flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                isActive ? activeTabStyles : inactiveTabStyles
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  isActive ? activeIconStyles : inactiveIconStyles
                }`}
              >
                {t.icon}
              </div>

              <span className="ml-3 text-sm font-medium flex-1">{t.label}</span>

              {/* Followers Badge */}
              {showBadge && (
                <span className="bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {getFollowersCount()}
                </span>
              )}

              {isActive && <FaChevronRight className="text-blue-500 text-xs" />}
            </button>
          );
        })}

        {/* BARCODE BUTTON */}
        <div className="relative">
          <button
            onClick={() => setShowBarcode(!showBarcode)}
            className={`group flex items-center p-2.5 rounded-xl transition-all duration-200 w-full ${
              showBarcode ? activeTabStyles : inactiveTabStyles
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                showBarcode ? activeIconStyles : inactiveIconStyles
              }`}
            >
              <FaDownload className="text-sm" />
            </div>

            <span className="ml-3 text-sm font-medium flex-1">Barcode</span>

            <FaChevronDown
              className={`text-xs transition-transform duration-300 ${
                showBarcode ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Barcode DropDown Content */}
          {showBarcode && (
            <div className="mt-2 p-4 bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/60 shadow-md">
              <img
                src={barImage}
                alt="Barcode"
                className="w-full rounded-lg mb-3 border border-gray-200/60"
              />

              <button
                onClick={handleDownloadBarcode}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <FaDownload className="text-sm" />
                Download Barcode
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* SIGN OUT */}
      <button
        onClick={handleSignOut}
        className="group mt-4 flex items-center p-2.5 rounded-xl bg-white/60 text-gray-700 border border-gray-200/50 
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
          hover:shadow-[3px_3px_10px_rgba(220,38,38,0.1),-3px_-3px_10px_rgba(255,255,255,0.8)]
          hover:text-red-500 hover:border-red-200 transition-all duration-200"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
            group-hover:bg-red-50 group-hover:text-red-500 transition-all duration-200"
        >
          <FaSignOutAlt className="text-xs" />
        </div>

        <span className="ml-3 text-sm font-medium">Sign Out</span>
      </button>

      {/* Status */}
      <div className="mt-4 pt-3 border-t border-gray-200/60">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;