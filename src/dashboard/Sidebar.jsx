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
  FaChevronDown
} from "react-icons/fa";
import barImage from "../assets/bar.jpg";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [expanded, setExpanded] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);

  const tabs = [
    { label: "Products", icon: <FaTags /> },
    { label: "Sales", icon: <FaShoppingCart /> },
    { label: "Analytics", icon: <FaChartLine /> },
    { label: "Contacts", icon: <FaUsers /> },
    { label: "Settings", icon: <FaCog /> },
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
        className=" bg-gradient-to-b from-gray-50 to-gray-100 text-gray-700 p-4 flex flex-col rounded-xl border border-gray-200 ml-3 "
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          width: expanded ? "190px" : "70px",
          transition: "0.25s ease",
        }}
      >
        {/* Added margin-top to push all content down */}
        <nav className="flex flex-col gap-3 mt-16">
          {tabs.map((t) => (
            <button
              key={t.label}
              onClick={() => setActiveTab(t.label)}
              className={`group relative flex items-center p-3 rounded-xl transition-all duration-300
                ${activeTab === t.label 
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                  : "bg-white text-gray-600 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.1),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500"
                }`}
            >
              {/* ICON */}
              <span className={`text-xl transition-transform duration-300  ${activeTab === t.label ? 'scale-110' : ''}`}>
                {t.icon}
              </span>

              {/* LABEL WHEN EXPANDED */}
              {expanded && (
                <span className="ml-4 text-sm whitespace-nowrap font-medium">{t.label}</span>
              )}

              {/* TOOLTIP WHEN COLLAPSED */}
              {!expanded && (
                <span className="absolute left-16 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
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
                // If sidebar is collapsed, download immediately
                if (!expanded) {
                  handleDownloadBarcode();
                } else {
                  // If sidebar is expanded, toggle dropdown
                  setShowBarcode(!showBarcode);
                }
              }}
              className="group relative flex items-center p-3 rounded-xl bg-white text-gray-600 
                shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]
                hover:shadow-[3px_3px_10px_rgba(0,0,0,0.1),-3px_-3px_10px_rgba(255,255,255,0.8)]
                hover:text-blue-500 transition-all duration-300 w-full"
            >
              <FaDownload className="text-xl" />

              {expanded && (
                <div className="ml-4 text-sm font-medium flex items-center justify-between w-full">
                  <span>Download Barcode</span>
                  <FaChevronDown 
                    className={`text-xs transition-transform duration-300 ${showBarcode ? 'rotate-180' : ''}`} 
                  />
                </div>
              )}

              {!expanded && (
                <span className="absolute left-16 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg">
                  Download Barcode
                </span>
              )}
            </button>

            {/* BARCODE DROPDOWN CONTENT */}
            {showBarcode && expanded && (
              <div className="mt-2 ml-2 mr-2 bg-white rounded-xl p-4 border border-gray-200
                shadow-[3px_3px_10px_rgba(0,0,0,0.1),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                
                {/* BARCODE IMAGE */}
                <img 
                  src={barImage} 
                  alt="Barcode" 
                  className="w-full rounded-lg mb-3 border border-gray-200"
                />
                
                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={handleDownloadBarcode}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg font-medium
                    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all
                    flex items-center justify-center gap-2"
                >
                  <FaDownload className="text-sm" />
                  Download Barcode
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* SIGN OUT BUTTON - Added margin-top to push it further down */}
        <button
          onClick={handleSignOut}
          className="group relative mt-4 flex items-center p-3 rounded-xl
            bg-white text-red-500 
            shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]
            hover:shadow-[3px_3px_10px_rgba(220,38,38,0.2),-3px_-3px_10px_rgba(255,255,255,0.8)]
            hover:bg-red-50 hover:text-red-600 transition-all duration-300"
        >
          <FaSignOutAlt className="text-xl" />

          {expanded && <span className="ml-4 text-sm font-medium">Sign Out</span>}

          {!expanded && (
            <span className="absolute left-16 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg 
                opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;