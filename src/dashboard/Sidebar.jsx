import React, { useState } from "react";
import {
  FaTags,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
  FaUsers,
  FaDownload,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa";
import barImage from "../assets/bar.jpg";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [expanded, setExpanded] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  const tabs = [
    { label: "Products", icon: <FaTags className="text-sm" /> },
    { label: "Sales", icon: <FaShoppingCart className="text-sm" /> },
    { label: "Analytics", icon: <FaChartLine className="text-sm" /> },
    { label: "Contacts", icon: <FaUsers className="text-sm" /> },
    { label: "Settings", icon: <FaCog className="text-sm" /> },
  ];

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/company-login";
  };

  const handleDownloadBarcode = () => {
    const link = document.createElement("a");
    link.href = barImage;
    link.download = "barcode.jpg";
    link.click();
  };

  return (
    <>
      {/* SIDEBAR */}
      <div
        className="bg-white/80 backdrop-blur-lg text-gray-900 p-3 flex flex-col border-r border-gray-200/60 ml-3"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          width: expanded ? "192px" : "72px",
          transition: "0.25s ease",
        }}
      >
        {/* User Profile */}
        <div className="p-3 border-b border-gray-200/60 mb-4 mt-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-medium text-sm">C</span>
            </div>
            {expanded && (
              <div className="flex-1 ml-3">
                <h2 className="text-base font-semibold text-gray-900">Company</h2>
                <p className="text-xs text-gray-600">Business Account</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200
                ${activeTab === t.label 
                  ? "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg shadow-blue-200/50" 
                  : "bg-white/60 text-gray-700 border border-gray-200/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:border-blue-100"
                }`}
            >
              {/* ICON */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                activeTab === t.label 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] group-hover:bg-blue-50 group-hover:text-blue-500"
              }`}>
                {t.icon}
              </div>

              {/* LABEL WHEN EXPANDED */}
              {expanded && (
                <>
                  <span className="ml-3 text-sm font-medium flex-1 text-left">{t.label}</span>
                  {activeTab === t.label && <FaChevronRight className="text-blue-500 text-xs" />}
                </>
              )}

              {/* TOOLTIP WHEN COLLAPSED */}
              {!expanded && (
                <span className="absolute left-12 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
                  opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg z-50">
                  {t.label}
                </span>
              )}
            </button>
          ))}

          {/* DOWNLOAD BARCODE BUTTON WITH DROPDOWN */}
          <div className="relative">
            <button
              onClick={(e) => {
                
                if (!expanded) {
                  handleDownloadBarcode();
                } else {
                 
                  setShowBarcode(!showBarcode);
                }
              }}
              className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200 w-full ${
                showBarcode 
                  ? "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg shadow-blue-200/50" 
                  : "bg-white/60 text-gray-700 border border-gray-200/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:border-blue-100"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                showBarcode 
                  ? "bg-blue-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] group-hover:bg-blue-50 group-hover:text-blue-500"
              }`}>
                <FaDownload className="text-sm" />
              </div>

              {expanded && (
                <div className="ml-3 text-sm font-medium flex items-center justify-between w-full">
                  <span>Barcode</span>
                  <FaChevronDown 
                    className={`text-xs transition-transform duration-300 ${showBarcode ? 'rotate-180' : ''}`} 
                  />
                </div>
              )}

              {!expanded && (
                <span className="absolute left-12 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg">
                  Barcode
                </span>
              )}
            </button>

            {/* BARCODE DROPDOWN CONTENT */}
            {showBarcode && expanded && (
              <div className="mt-2 ml-2 mr-2 bg-white/80 backdrop-blur-lg rounded-xl p-4 border border-gray-200/60
                shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                
                {/* BARCODE IMAGE */}
                <img 
                  src={barImage} 
                  alt="Barcode" 
                  className="w-full rounded-lg mb-3 border border-gray-200/60"
                />
                
                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={handleDownloadBarcode}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg font-medium
                    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all
                    flex items-center justify-center gap-2 text-sm"
                >
                  <FaDownload className="text-sm" />
                  Download Barcode
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* SIGN OUT BUTTON */}
        <button
          onClick={handleSignOut}
          className="group relative mt-4 flex items-center p-2.5 rounded-xl
            bg-white/60 text-gray-700 border border-gray-200/50 
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
            hover:shadow-[3px_3px_10px_rgba(220,38,38,0.1),-3px_-3px_10px_rgba(255,255,255,0.8)]
            hover:text-red-500 hover:border-red-200 transition-all duration-200"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center 
            bg-gray-100 text-gray-600 
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
            group-hover:bg-red-50 group-hover:text-red-500 transition-all duration-200">
            <FaSignOutAlt className="text-xs" />
          </div>

          {expanded && <span className="ml-3 text-sm font-medium">Sign Out</span>}

          {!expanded && (
            <span className="absolute left-12 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
                opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg">
              Sign Out
            </span>
          )}
        </button>

        {/* Status */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-gray-200/60">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Online</span>
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-md"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;