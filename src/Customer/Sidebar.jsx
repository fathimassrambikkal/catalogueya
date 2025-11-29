import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FaComments,
  FaBell,
  FaStar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaHeart,
  FaUserPlus
} from "react-icons/fa";
import { TbLayoutSidebarRightFilled } from "react-icons/tb"; // Import the icon
import { useFollowing } from "../context/FollowingContext";

// Menu items configuration
const menuItems = [ 
  { label: "Favourites", icon: <FaHeart className="text-sm" />, page: "fav" },
  { label: "Messages", icon: <FaComments className="text-sm" />, page: "messages" },
  { label: "Notifications", icon: <FaBell className="text-sm" />, page: "notifications" },
  { label: "Reviews", icon: <FaStar className="text-sm" />, page: "reviews" },
  { label: "Following", icon: <FaUserPlus className="text-sm" />, page: "following" },
  { label: "Settings", icon: <FaCog className="text-sm" />, page: "settings" },
  { label: "Help", icon: <FaQuestionCircle className="text-sm" />, page: "help" }
];

function Sidebar({ activeTab, setActiveTab, onCloseSidebar }) { // Added onCloseSidebar prop
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getFollowingCount } = useFollowing();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/sign");
  }, [logout, navigate]);

  const handleNavigation = useCallback(
    (page) => {
      setActiveTab(page);
    },
    [setActiveTab]
  );

  const activeTabStyles =
    "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg shadow-blue-200/50";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] hover:text-blue-500 hover:border-blue-100";

  const activeIconStyles = "bg-blue-500 text-white shadow-md";
  const inactiveIconStyles =
    "bg-gray-100 text-gray-600 shadow-[inset_2px_2px_4px rgba(0,0,0,0.05),inset_-2px_-2px_4px rgba(255,255,255,0.8)] group-hover:bg-blue-50 group-hover:text-blue-500";

  return (
    <div className="bg-white text-gray-900 h-full p-3 flex flex-col border-r border-gray-200/60 w-48 max-w-full z-50 overflow-x-hidden">
      {/* Close Button at the same position as in main content */}
      <div className="absolute top-4 left-6">
        <button
          onClick={onCloseSidebar}
          className="p-3 rounded-xl text-sm bg-white text-gray-500 shadow-md hover:bg-gray-100"
        >
          <TbLayoutSidebarRightFilled size={18} />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-3 border-b border-gray-200/60 mb-4 mt-16 overflow-hidden"> {/* Added mt-16 to account for close button */}
        <div className="flex items-center min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
            <span className="text-white font-medium text-sm">S</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">Sara</h2>
            <p className="text-xs text-gray-600 truncate">Premium Member</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 flex flex-col gap-1 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = activeTab === item.page;
          const showBadge = item.page === "following" && getFollowingCount() > 0;
          
          return (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className={`group relative flex items-center p-2.5 rounded-xl transition-all duration-200 min-w-0 overflow-hidden ${
                isActive ? activeTabStyles : inactiveTabStyles
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  isActive ? activeIconStyles : inactiveIconStyles
                }`}
              >
                {item.icon}
              </div>

              <span className="ml-3 text-sm font-medium flex-1 text-left truncate min-w-0">{item.label}</span>

              {/* Following Badge */}
              {showBadge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center flex-shrink-0">
                  {getFollowingCount()}
                </span>
              )}

              {isActive && <FaChevronRight className="text-blue-500 text-xs flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="group relative mb-4 flex items-center p-2.5 rounded-xl min-w-0 overflow-hidden
          bg-white/60 text-gray-700 border border-gray-200/50 
          shadow-[inset_1px_1px_2px rgba(255,255,255,0.8),inset_-1px_-1px_2px rgba(0,0,0,0.05)]
          hover:shadow-[3px_3px_10px rgba(220,38,38,0.1),-3px_-3px_10px rgba(255,255,255,0.8)]
          hover:text-red-500 hover:border-red-200 transition-all duration-200"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
          bg-gray-100 text-gray-600 
          shadow-[inset_2px_2px_4px rgba(0,0,0,0.05),inset_-2px_-2px_4px rgba(255,255,255,0.8)]
          group-hover:bg-red-50 group-hover:text-red-500 transition-all duration-200"
        >
          <FaSignOutAlt className="text-xs" />
        </div>
        <span className="ml-3 text-sm font-medium flex-1 text-left truncate min-w-0">Logout</span>
      </button>

      {/* Status */}
      <div className="mt-4 pt-3 border-t border-gray-200/60 overflow-hidden">
        <div className="flex items-center justify-between text-xs text-gray-600 min-w-0">
          <span className="truncate min-w-0">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-md flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;