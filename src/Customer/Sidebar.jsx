import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FaComments,
  FaBell,
  FaStar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight
} from "react-icons/fa";

function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/sign");
  };

  const handleNavigation = (page) => {
    setActiveTab(page);
  };

  const menuItems = [
    {
      label: "Messages",
      icon: <FaComments className="text-sm" />,
      page: "messages",
      color: "blue"
    },
    {
      label: "Notifications",
      icon: <FaBell className="text-sm" />,
      page: "notifications",
      color: "blue"
    },
    {
      label: "Reviews",
      icon: <FaStar className="text-sm" />,
      page: "reviews",
      color: "blue"
    },
    {
      label: "Settings",
      icon: <FaCog className="text-sm" />,
      page: "settings",
      color: "blue"
    },
    {
      label: "Help",
      icon: <FaQuestionCircle className="text-sm" />,
      page: "help",
      color: "blue"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-lg text-gray-900 h-full p-3 flex flex-col border-r border-gray-200/60 w-48">
      
      {/* User Profile Section */}
      <div className="p-3 border-b border-gray-200/60 mb-4 mt-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg">
            <span className="text-white font-medium text-sm">S</span>
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900">Sara</h2>
            <p className="text-xs text-gray-600">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.page}
            onClick={() => handleNavigation(item.page)}
            className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200
              ${activeTab === item.page 
                ? "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg shadow-blue-200/50" 
                : "bg-white/60 text-gray-700 border border-gray-200/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:border-blue-100"
              }`}
          >
            {/* Icon */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
              ${activeTab === item.page 
                ? "bg-blue-500 text-white shadow-md" 
                : "bg-gray-100 text-gray-600 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] group-hover:bg-blue-50 group-hover:text-blue-500"
              }`}>
              {item.icon}
            </div>

            {/* Label */}
            <span className="ml-3 text-sm font-medium flex-1 text-left">{item.label}</span>
            
            {/* Chevron for active item */}
            {activeTab === item.page && (
              <FaChevronRight className="text-blue-500 text-xs" />
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
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
        <span className="ml-3 text-sm font-medium">Logout</span>
      </button>

      {/* Bottom Status Bar */}
      <div className="mt-4 pt-3 border-t border-gray-200/60">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-md"></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;