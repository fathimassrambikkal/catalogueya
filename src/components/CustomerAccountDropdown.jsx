import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { performLogout } from "../lib/authUtils";
import { setCustomerTab } from "../store/authSlice";
import { useFixedWords } from "../hooks/useFixedWords";
import { FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

export default function CustomerAccountDropdown({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Customer";

    const labels = {
  welcome: fw.welcome ?? "Welcome",
  notifications: fw.notifications ?? "Notifications",
  dashboard: fw.my_dashboard ?? "My Dashboard",
  settings: fw.settings ?? "Settings",
  logout: fw.logout ?? "Logout",
};


  const goToTab = (tab) => {
    dispatch(setCustomerTab(tab));
    navigate("/customer-login");
    onClose?.();
  };

  return (
    <div className="absolute right-0 mt-2 w-44 xs:w-52 sm:w-60 md:w-72 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden">
      
      {/* Header */}
      <div className="px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 border-b border-gray-200">
        <p className="text-[10px] xs:text-xs text-gray-500"> {labels.welcome}</p>
        <p className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 truncate">
          {displayName}
        </p>
      </div>

      {/* Menu */}
      <div className="p-1.5 xs:p-2 sm:p-2.5 flex flex-col gap-0.5 xs:gap-1 sm:gap-1.5">

        {/* Notifications */}
        <button
          onClick={() => goToTab("notifications")}
          className="group flex items-center p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl transition-all duration-200
          bg-white text-gray-700 border border-gray-200/50 hover:text-blue-600 hover:bg-blue-50 active:scale-[0.98]"
        >
          <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <FaBell className="text-[10px] xs:text-xs" />
          </div>

          <span className="ml-2 xs:ml-3 text-xs xs:text-sm font-medium flex-1 text-left">
            {labels.notifications}
          </span>
        </button>

        {/* My Dashboard */}
        <button
          onClick={() => navigate("/customer-login")}
          className="group flex items-center p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl transition-all duration-200
          bg-white text-gray-700 border border-gray-200/50 hover:text-blue-600 hover:bg-blue-50 active:scale-[0.98]"
        >
          <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <HiHome className="text-[10px] xs:text-xs" />
          </div>

          <span className="ml-2 xs:ml-3 text-xs xs:text-sm font-medium flex-1 text-left">
            {labels.dashboard}
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={() => goToTab("settings")}
          className="group flex items-center p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl transition-all duration-200
          bg-white text-gray-700 border border-gray-200/50 hover:text-blue-600 hover:bg-blue-50 active:scale-[0.98]"
        >
          <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <FaCog className="text-[10px] xs:text-xs" />
          </div>

          <span className="ml-2 xs:ml-3 text-xs xs:text-sm font-medium flex-1 text-left">
            {labels.settings}
          </span>
        </button>

        {/* Divider */}
        <div className="my-0.5 xs:my-1 border-t border-gray-200/60" />

        {/* Logout */}
        <button
          onClick={() => performLogout(dispatch, navigate, "customer")}
          className="group flex items-center p-2 xs:p-2.5 sm:p-3 rounded-lg xs:rounded-xl transition-all duration-200
          bg-white text-gray-700 border border-gray-200/50 hover:text-red-600 hover:bg-red-50 active:scale-[0.98]"
        >
          <div className="w-6 h-6 xs:w-7 xs:h-7 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <FaSignOutAlt className="text-[10px] xs:text-xs" />
          </div>

          <span className="ml-2 xs:ml-3 text-xs xs:text-sm font-medium flex-1 text-left">
            {labels.logout}
          </span>
        </button>
      </div>
    </div>
  );
}