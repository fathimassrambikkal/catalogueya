import React from "react";
import {
  FaTags,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import barImage from "../assets/bar.jpg";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: "Products", icon: <FaTags /> },
    { label: "Sales", icon: <FaShoppingCart /> },
    { label: "Analytics", icon: <FaChartLine /> },
    { label: "Contacts", icon: <FaUsers /> },
    { label: "Settings", icon: <FaCog /> },
  ];

  const handleSignOut = () => {
    // Clear authentication
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    
    // Clear any other stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/company-login';
  };

  return (
    <div className="w-60 bg-white shadow-md flex flex-col h-full">
      <div className="text-2xl font-bold text-center mb-6 pt-6"></div>

      <nav className="flex-1">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`flex items-center gap-3 px-6 py-3 text-sm w-full text-left 
              ${
                activeTab === t.label
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
        
        {/* Image placed below Settings - same line format */}
        <div className={`flex items-center gap-3 px-6 py-3 text-sm w-full text-left text-gray-600 hover:bg-gray-100 cursor-pointer`}>
          <img 
            src={barImage}
            alt="Sidebar image" 
            className="w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-24 lg:h-24 rounded-lg object-cover"
          />
        </div>
      </nav>

      <button 
        onClick={handleSignOut}
        className="flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 border-t mt-auto"
      >
        <FaSignOutAlt />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;