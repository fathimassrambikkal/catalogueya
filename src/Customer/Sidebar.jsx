import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import fatoraLogo from "../assets/fatora.webp";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../lib/authUtils";
import {
  FaGlobe,
  FaComments,
  FaBell,
  FaStar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaHeart,
  FaUserPlus,
} from "react-icons/fa";
import { RiCloseLine } from "react-icons/ri";

const menuItems = [
  { label: "Explore Catalogueya", icon: <FaGlobe />, page: "website" },
  { label: "Favourites", icon: <FaHeart />, page: "fav" },
  { label: "Messages", icon: <FaComments />, page: "messages" },
  { label: "Notifications", icon: <FaBell />, page: "notifications" },
  { label: "Reviews", icon: <FaStar />, page: "reviews" },
  { label: "Following", icon: <FaUserPlus />, page: "following" },
  {
    label: "Fatora",
    icon: <img src={fatoraLogo} alt="Fatora" className="w-full h-full object-contain" />,
    page: "fatora",
  },
  { label: "Settings", icon: <FaCog />, page: "settings" },
  { label: "Help", icon: <FaQuestionCircle />, page: "help" },
  { label: "Logout", icon: <FaSignOutAlt />, page: "logout", isLogout: true },
];

function Sidebar({ activeTab, setActiveTab, onCloseSidebar, isMobile }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType,user } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    performLogout(dispatch, navigate, userType);
  }, [dispatch, navigate, userType]);

  const handleNavigation = useCallback(
    (page, isLogout) => {
      if (isLogout) {
        handleLogout();
        return;
      }
      
      if (page === "website") {
        navigate("/");
        onCloseSidebar?.();
        return;
      }
      setActiveTab(page);
      onCloseSidebar?.();
    },
    [navigate, setActiveTab, onCloseSidebar, handleLogout]
  );

  const activeTabStyles =
    "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg";
  const inactiveTabStyles =
    "bg-white/60 text-gray-700 border border-gray-200/50 hover:text-blue-500";
  const logoutStyles = "hover:text-red-500";

  const activeIconStyles = "bg-blue-500 text-white shadow-md";
  const inactiveIconStyles = "bg-gray-100 text-gray-600";
  const logoutIconStyles = "bg-gray-100 text-gray-600";



   const displayName =
  [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
  user?.name ||
  "Customer";


const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative w-full h-full bg-white border-r border-gray-200/60 overflow-hidden">
      {/* SINGLE MENU CONTAINER */}
      <nav className="h-full flex flex-col  px-2 sm:px-3 py-3 sm:py-4">
        
        {/* HEADER - Fixed at top */}
        <div className="flex items-center  px-2 sm:px-3 py-2 sm:py-3 flex-shrink-0 mt-16 sm:mt-16 md:mt-0  ">
          <div className="flex gap-3 mt-0  sm:mt-0 md:mt-6  items-center justify-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ">
            <span className="font-bold text-white text-sm sm:text-base">{initial}</span>
          </div>

          <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
           {displayName}
          </span>
          </div>
          

          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="ml-auto p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
              aria-label="Close sidebar"
            >
              <RiCloseLine size={16} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* ALL ITEMS - Evenly distributed */}
        <div className="flex-1 flex flex-col justify-evenly ">
          <div className="flex flex-col gap-1 sm:gap-2">
            {menuItems.map((item, index) => {
              const isActive = activeTab === item.page;
              const isFatora = item.page === "fatora";
              const isLogoutItem = item.isLogout;

              return (
                <button
                  key={item.page}
                  onClick={() => handleNavigation(item.page, isLogoutItem)}
                  className={`group flex items-center p-2 sm:p-2 rounded-xl transition-all duration-200 ${
                    isLogoutItem 
                      ? logoutStyles 
                      : isActive ? activeTabStyles : inactiveTabStyles
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isLogoutItem
                        ? logoutIconStyles
                        : isActive
                          ? isFatora
                            ? "bg-white"
                            : activeIconStyles
                          : inactiveIconStyles
                    }`}
                  >
                    {isFatora ? (
                      <img 
                        src={fatoraLogo} 
                        alt="Fatora" 
                        className="w-4 h-4 sm:w-4 sm:h-4"
                      />
                    ) : (
                      React.cloneElement(item.icon, {
                        className: "w-4 h-4 sm:w-4 sm:h-4"
                      })
                    )}
                  </div>

                  <span className={`ml-2.5 sm:ml-3 text-sm sm:text-sm md:text-[15px] font-medium truncate flex-1 text-left ${
                    isLogoutItem ? "hover:text-red-500" : ""
                  }`}>
                    {item.label}
                  </span>

                  {!isLogoutItem && isActive && (
                    <FaChevronRight className="text-blue-500 text-xs sm:text-xs ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </nav>
    </div>
  );
}

export default Sidebar;