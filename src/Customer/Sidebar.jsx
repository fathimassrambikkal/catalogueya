import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import fatoraLogo from '../assets/fatora.webp';
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
import { TbLayoutSidebarRightFilled } from "react-icons/tb";

const menuItems = [
  { label: "Favourites", icon: <FaHeart className="text-sm" />, page: "fav" },
  { label: "Messages", icon: <FaComments className="text-sm" />, page: "messages" },
  { label: "Notifications", icon: <FaBell className="text-sm" />, page: "notifications" },
  { label: "Reviews", icon: <FaStar className="text-sm" />, page: "reviews" },
  { label: "Following", icon: <FaUserPlus className="text-sm" />, page: "following" },
  { label: "Fatora", icon: <img src={fatoraLogo} alt="Fatora" className="w-4 h-4" />, page: "fatora" },
  { label: "Settings", icon: <FaCog className="text-sm" />, page: "settings" },
  { label: "Help", icon: <FaQuestionCircle className="text-sm" />, page: "help" }
];

function Sidebar({ activeTab, setActiveTab, onCloseSidebar }) {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company");
    navigate("/sign");
  }, [navigate]);

  const handleNavigation = useCallback(
    (page) => setActiveTab(page),
    [setActiveTab]
  );

  const getFollowingCount = () => 3; // placeholder

  const activeTabStyles = "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200/50 hover:text-blue-500";

  const activeIconStyles = "bg-blue-500 text-white shadow-md";
  const inactiveIconStyles = "bg-gray-100 text-gray-600";

  return (
    <aside className="h-full w-72 max-w-[88%] min-w-0 bg-white p-3 flex flex-col border-r border-gray-200/60 z-50 overflow-y-auto overflow-x-hidden">
      {/* close button for drawer mode */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onCloseSidebar}
          className="p-2 rounded-xl bg-white text-gray-500 shadow-md hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <TbLayoutSidebarRightFilled size={18} />
        </button>
      </div>

      {/* profile */}
      <div className="p-3 border-b border-gray-200/60 mb-4 mt-16 min-w-0 overflow-hidden">
        <div className="flex items-center min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg flex-shrink-0">
            <span className="text-white font-medium text-sm">S</span>
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <h2 className="text-base font-semibold text-gray-900 truncate">Sara</h2>
            <p className="text-xs text-gray-600 truncate">Premium Member</p>
          </div>
        </div>
      </div>

      {/* menu */}
      <nav className="flex-1 flex flex-col gap-2 min-w-0 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = activeTab === item.page;
          const showBadge = item.page === "following" && getFollowingCount() > 0;
          const isFatora = item.page === "fatora";

          return (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className={`group flex items-center p-2.5 rounded-xl transition-all duration-200 min-w-0 overflow-hidden ${
                isActive ? activeTabStyles : inactiveTabStyles
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive 
                    ? (isFatora ? "bg-white" : activeIconStyles)
                    : inactiveIconStyles
                }`}
              >
                {item.icon}
              </div>

              <span className="ml-3 text-sm font-medium flex-1 text-left truncate min-w-0 overflow-hidden pr-2">
                {item.label}
              </span>

              {showBadge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center flex-shrink-0 mr-1">
                  {getFollowingCount()}
                </span>
              )}

              {isActive && <FaChevronRight className="text-blue-500 text-xs flex-shrink-0 ml-auto" />}
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 mb-2 flex items-center p-2.5 rounded-xl bg-white/60 text-gray-700 border border-gray-200/50 hover:text-red-500 transition-all duration-200 min-w-0 overflow-hidden"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600 mr-3">
          <FaSignOutAlt className="text-xs" />
        </div>
        <span className="text-sm font-medium truncate flex-1 min-w-0">Logout</span>
      </button>

      <div className="mt-4 pt-3 border-t border-gray-200/60 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between text-xs text-gray-600 min-w-0">
          <span className="truncate min-w-0 flex-1 overflow-hidden">Online</span>
          <div className="w-2 h-2 bg-green-500 rounded-full shadow-md flex-shrink-0 ml-2" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;