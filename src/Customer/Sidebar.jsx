import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import fatoraLogo from "../assets/fatora.webp";
import { useDispatch, useSelector } from "react-redux";
import { performLogout } from "../lib/authUtils";
import { RiCloseLine } from "react-icons/ri";

/* =========================
   ICON SET (SVG matching React Icons shape)
   ========================= */

const Icons = {
  globe: (c) => (
    <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),

  heart: (c) => (
    <svg className={c} viewBox="0 0 512 512" fill="currentColor">
      <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z" />
    </svg>
  ),
  chat: (c) => (
    <svg className={c} viewBox="0 0 576 512" fill="currentColor">
      <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" />
    </svg>
  ),
  bell: (c) => (
    <svg className={c} viewBox="0 0 448 512" fill="currentColor">
      <path d="M224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64zm215.39-149.71c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71z" />
    </svg>
  ),
  star: (c) => (
    <svg className={c} viewBox="0 0 576 512" fill="currentColor">
      <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
    </svg>
  ),
 userPlus: (c) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={c}
    shapeRendering="geometricPrecision"
  >
    {/* User head */}
    <circle cx="9" cy="8" r="3.5" />

    {/* User body */}
    <path d="M3.5 20c0-3.2 2.6-5.8 5.8-5.8h1.4c3.2 0 5.8 2.6 5.8 5.8H3.5z" />

    {/* Plus */}
    <rect x="16.25" y="6.5" width="1.5" height="7" rx="0.75" />
    <rect x="13.5" y="9.25" width="7" height="1.5" rx="0.75" />
  </svg>
),

  cog: (c) => (
    <svg className={c} viewBox="0 0 512 512" fill="currentColor">
      <path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
    </svg>
  ),
  help: (c) => (
    <svg className={c} viewBox="0 0 512 512" fill="currentColor">
      <path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z" />
    </svg>
  ),
  logout: (c) => (
    <svg className={c} viewBox="0 0 512 512" fill="currentColor">
      <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z" />
    </svg>
  ),
};

/* ========================= */

const menuItems = [
  { label: "Explore Catalogueya", icon: Icons.globe, page: "website" },
  { label: "Favourites", icon: Icons.heart, page: "fav" },
  { label: "Messages", icon: Icons.chat, page: "messages" },
  { label: "Notifications", icon: Icons.bell, page: "notifications" },
  { label: "Reviews", icon: Icons.star, page: "reviews" },
  { label: "Following", icon: Icons.userPlus, page: "following" },
  { label: "Fatora", icon: "fatora", page: "fatora" },
  { label: "Settings", icon: Icons.cog, page: "settings" },
  { label: "Help", icon: Icons.help, page: "help" },
];

function Sidebar({ activeTab, setActiveTab, onCloseSidebar, isMobile }) {
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
    <aside className="w-full h-full bg-white border-r border-gray-200/60">
      <nav className="h-full grid grid-rows-[auto_1fr_auto] px-2 sm:px-3 py-3 sm:py-4">
        
        {/* HEADER */}
        <div className="flex items-center px-2 sm:px-3 py-2 sm:py-3 mt-16 sm:mt-16 md:mt-5">
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
              <RiCloseLine size={16} />
            </button>
          )}
        </div>

        {/* MENU */}
        <div className="flex flex-col gap-1 sm:gap-2 mt-8 md:mt-2">
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
                className={`flex items-center p-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-500/10 text-blue-600 border border-blue-200 shadow-lg"
                    : "bg-white/60 text-gray-700 border border-gray-200/50 hover:text-blue-500"
                }`}
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center bg-gray-100">
                  {item.icon === "fatora" ? (
                    <img src={fatoraLogo} alt="Fatora" className="w-4 h-4" />
                  ) : (
                    item.icon("w-4 h-4")
                  )}
                </div>

                <span className="ml-2.5 sm:ml-3 text-sm md:text-[15px] font-medium truncate flex-1 text-left">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* LOGOUT (PINNED, ALWAYS VISIBLE) */}
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-xl hover:text-red-500 transition-all"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center bg-gray-100">
            {Icons.logout("w-4 h-4")}
          </div>
          <span className="ml-2.5 sm:ml-3 text-sm md:text-[15px] font-medium">
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;