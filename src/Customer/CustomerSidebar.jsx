import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../lib/authUtils";

import {
  GlobeIcon,
  HeartIcon,
  ChatIcon,
  BellIcon,
  StarIcon,
  UserPlusIcon,
  IconBills,
  CogIcon,
  HelpIcon,
  LogoutIcon,
  CloseIcon
} from "./Svgicons";

/* ========================= */

const menuItems = [
  { label: "Explore Catalogueya", icon: GlobeIcon, page: "website" },
  { label: "Favourites", icon: HeartIcon, page: "fav" },
  { label: "Messages", icon: ChatIcon, page: "messages" },
  { label: "Notifications", icon: BellIcon, page: "notifications" },
  { label: "Reviews", icon: StarIcon, page: "reviews" },
  { label: "Following", icon: UserPlusIcon, page: "following" },
  { label: "Bills", icon: IconBills, page: "fatora" },
  { label: "Settings", icon: CogIcon, page: "settings" },
  { label: "Help", icon: HelpIcon, page: "help" },
];

function CustomerSidebar({ activeTab, setActiveTab, onCloseSidebar, isMobile }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType, user } = useSelector((s) => s.auth);

  const handleLogout = useCallback(
    () => performLogout(dispatch, navigate, userType),
    [dispatch, navigate, userType]
  );

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Customer";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="w-full h-full bg-white border-r border-gray-200/60   ">
    <nav className="h-full grid grid-rows-[auto_1fr_auto] px-2 py-3 sm:px-3 sm:py-4">
       {/* HEADER */}
        <div className="flex items-center px-2 sm:px-3 py-2 sm:py-3 mt-10  ">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="font-bold text-white text-sm sm:text-base">
                {initial}
              </span>
            </div>
            <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {displayName}
            </span>
          </div>

          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="ml-auto p-2 rounded-lg hover:bg-gray-100"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          )}
        </div>

          
        

        {/* MAIN MENU SECTION - Compact and clean */}
        <div className="mt-4 sm:mt-6 overflow-y-auto">
          <div className="space-y-0.5 px-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() =>
                    item.page === "website"
                      ? navigate("/")
                      : setActiveTab(item.page)
                  }
                  className={`w-full flex items-center px-2.5 py-2 rounded-xl transition-all duration-200 ease-out ${
                    isActive
                      ? "bg-blue-500/10 text-blue-600 shadow-sm border border-blue-200/50"
                      : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive 
                      ? "bg-blue-100" 
                      : "bg-gray-100/80"
                  }`}>
                    <item.icon className={`w-3.5 h-3.5 ${
                      isActive ? "text-blue-600" : "text-gray-600"
                    }`} />
                  </div>

                  {/* Label */}
                  <span className="ml-3 text-[13px] sm:text-sm font-medium truncate">
                    {item.label}
                  </span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* LOGOUT SECTION - Pinned to bottom */}
        <div className="border-t border-gray-200/40 pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-2.5 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-out group"
          >
            {/* Logout Icon */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-100/80 group-hover:bg-red-100">
              <LogoutIcon className="w-3.5 h-3.5 text-gray-600 group-hover:text-red-500" />
            </div>
            
            {/* Logout Text */}
            <span className="ml-3 text-[13px] sm:text-sm font-medium">
              Logout
            </span>
          </button>

       
        </div>
      </nav>
    </aside>
  );
}

export default CustomerSidebar;