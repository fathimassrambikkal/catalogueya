import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { performLogout } from "../lib/authUtils";
import { setCustomerTab } from "../store/authSlice";
import { useFixedWords } from "../hooks/useFixedWords";

/* ================================
   SAFE SVG BASE COMPONENT
================================ */

const SvgIcon = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    {children}
  </svg>
);

/* =========================
   Icons (ClickUp Style)
========================= */

const UserIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
  </SvgIcon>
);

const BellIcon = () => (
  <SvgIcon>
    <path d="M18 10a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </SvgIcon>
);

const DashboardIcon = () => (
  <SvgIcon>
    <rect x="4" y="4" width="6" height="6" rx="2" />
    <rect x="14" y="4" width="6" height="6" rx="2" />
    <rect x="4" y="14" width="6" height="6" rx="2" />
    <rect x="14" y="14" width="6" height="6" rx="2" />
  </SvgIcon>
);

const LoginIcon = () => (
  <SvgIcon>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </SvgIcon>
);

const SignupIcon = () => (
  <SvgIcon>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3.5 19a6 6 0 0 1 11 0" />
    <path d="M19 8v6M16 11h6" />
  </SvgIcon>
);

const HomeIcon = () => (
  <SvgIcon>
    <path 
      d="M4.5 10.5L12 4.5L19.5 10.5V19.5H4.5V10.5Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9.5 19.5V13.5H14.5V19.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

const InfoIcon = () => (
  <SvgIcon>
    <circle 
      cx="12" 
      cy="12" 
      r="8.25" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M12 11.5V16.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <circle 
      cx="12" 
      cy="8" 
      r="0.75" 
      fill="currentColor" 
      stroke="none"
    />
  </SvgIcon>
);

const SettingsIcon = () => (
  <SvgIcon>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1v.2a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-.4-1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1-.4h-.2a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.5l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1v-.2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 .4 1 1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 20.5 7.04l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1 .4h.2a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1 .4 1.7 1.7 0 0 0-.6 1z" />
  </SvgIcon>
);

const MailIcon = () => (
  <SvgIcon>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 7l9 6 9-6" />
  </SvgIcon>
);

const LogoutIcon = () => (
  <SvgIcon>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </SvgIcon>
);

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 rtl:rotate-180"
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

const WelcomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

/* ================================
   MAIN COMPONENT
================================ */

export default function CustomerAccountDropdown({
  onClose,
  isAuthenticated,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Guest";

  const goToTab = (tab) => {
    dispatch(setCustomerTab(tab));
    navigate("/customer-login");
    onClose?.();
  };

  const MenuItem = ({
    onClick,
    icon,
    label,
    isDestructive,
    rightElement,
    showChevron = true,
  }) => (
    <button
      onClick={onClick}
      className={`
        group flex items-center w-full px-2 py-1.5
        text-[13px] font-semibold rounded-2xl 
        transition-all duration-150 tracking-tight
        ${
          isDestructive
            ? "text-red-600 hover:bg-red-50 hover:text-red-700"
            : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
        }
      `}
    >
      <span className="flex items-center justify-center w-6 h-6 ltr:mr-2 rtl:ml-2 flex-shrink-0 text-gray-500 group-hover:text-gray-700">
        {icon}
      </span>

      <span className="flex-1 text-start truncate tracking-tight">{label}</span>

      {rightElement && (
        <span className="ltr:mr-1.5 rtl:ml-1.5 flex-shrink-0">
          {rightElement}
        </span>
      )}

      {showChevron && <ChevronIcon />}
    </button>
  );

  return (
    <div className="absolute top-full mt-1 ltr:right-0 rtl:left-0 w-[240px] bg-white  rounded-xl   border-2 border-gray-200 z-50 py-1 shadow-lg">
 {/* Welcome Section - Visible ONLY when logged in */}
{isAuthenticated && (
  <div className="px-3 py-3">
    <div className="flex flex-col gap-3">
      
      {/* Welcome */}
      <p className="text-[14px] font-semibold text-gray-900 tracking-tight">
        {fw.welcome || "Welcome"}
      </p>

      <div className="flex items-start gap-3">
        
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white shadow-sm">
          <span className="text-sm font-medium tracking-tight">
            {displayName?.charAt(0)?.toUpperCase()}
          </span>
        </div>

        {/* Name + Email */}
        <div className="flex flex-col leading-tight">
          <p className="text-[13px] font-semibold text-gray-900 tracking-tight">
            {displayName}
          </p>
          <p className="text-[12px] text-gray-600 truncate">
            {user?.email}
          </p>
        </div>

      </div>
    </div>
  </div>
)}
      {isAuthenticated && (
        <>
          <div className="px-3 py-2"></div>
          <div className="my-1 border-t border-gray-200/70" />
        </>
      )}

      <div className="py-0.5">
        {isAuthenticated ? (
          <>
            <MenuItem icon={<BellIcon />} label={fw.notifications || "Notifications"} onClick={() => goToTab("notifications")} />
            <MenuItem icon={<DashboardIcon />} label={fw.my_dashboard || "Dashboard"} onClick={() => { navigate("/customer-login"); onClose?.(); }} />
            <MenuItem icon={<SettingsIcon />} label={fw.settings || "Settings"} onClick={() => goToTab("settings")} />
          </>
        ) : (
          <>
            <MenuItem icon={<LoginIcon />} label={fw.login || "Sign In"} onClick={() => { navigate("/sign"); onClose?.(); }} />
            {/* Sign Up removed from here - moved to bottom */}
          </>
        )}
      </div>

      <div className="my-1 border-t border-gray-200/70" />

      <div className="py-0.5">
        <MenuItem icon={<HomeIcon />} label={fw.home || "Home"} onClick={() => { navigate("/"); onClose?.(); }} />
        <MenuItem icon={<InfoIcon />} label={fw.aboute || "About"} onClick={() => { navigate("/about"); onClose?.(); }} />
        <MenuItem icon={<MailIcon />} label={fw.contact_us || "Contact"} onClick={() => { navigate("/contact"); onClose?.(); }} />
      </div>

      {!isAuthenticated && (
        <>
          <div className="my-1 border-t border-gray-200/70" />
          <div className="px-3 py-2">
            <button
              onClick={() => {
                navigate("/signup");
                onClose?.();
              }}
              className="
                w-full
                bg-blue-500
                text-white
                text-[13px]
                font-semibold
                py-2.5
                rounded-3xl
                shadow-lg
                hover:shadow-lg
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-200
                tracking-tight
              "
            >
              {fw.singup || "Sign Up"}
            </button>
          </div>
        </>
      )}

      {isAuthenticated && (
        <>
          <div className="my-1 border-t border-gray-200/70" />
          <div className="py-0.5">
            <MenuItem 
              icon={<LogoutIcon />} 
              label={fw.logout || "Log out"} 
              isDestructive 
              showChevron={false} 
              onClick={() => performLogout(dispatch, navigate, "customer")} 
            />
          </div>
        </>
      )}
    </div>
  );
}