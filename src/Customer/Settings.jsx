import React, { useState, useCallback } from "react";

import PersonalInformation from "./PersonalInformation";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import DeleteConfirm from "./DeleteConfirm";

/* ───────── PREMIUM BOUNCY TOGGLE ───────── */
function PremiumToggle({ checked, onChange, size = "md" }) {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: { track: "h-5 w-10", thumb: "h-3 w-3", translate: "translate-x-5" },
    md: { track: "h-7 w-14", thumb: "h-5 w-5", translate: "translate-x-7" },
    lg: { track: "h-9 w-18", thumb: "h-7 w-7", translate: "translate-x-9" },
  };

  const dim = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative ${dim.track} rounded-full p-1
        transition-all duration-500
        ${checked ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-300/70"}
        border border-white/30 backdrop-blur-sm
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(0,0,0,0.1)]
        focus:outline-none focus:ring-2 focus:ring-blue-500/30
        active:scale-[0.98]
      `}
    >
      <div
        className={`
          absolute inset-0 rounded-full transition-opacity duration-500
          ${checked ? "opacity-100 shadow-[0_0_18px_rgba(72,187,120,0.35)]" : "opacity-0"}
        `}
      />

      <div
        className={`
          relative ${dim.thumb} rounded-full
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${checked ? dim.translate : "translate-x-0"}
          ${isPressed ? "scale-90 duration-150" : ""}
          shadow-[0_2px_8px_rgba(0,0,0,0.15)]
        `}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white to-gray-100" />
      </div>
    </button>
  );
}

/* ───────── SETTINGS PAGE ───────── */
function Settings() {
  const [activeView, setActiveView] = useState("main");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const goMain = useCallback(() => setActiveView("main"), []);
  const openPersonal = useCallback(() => setActiveView("personalInfo"), []);
  const openPassword = useCallback(() => setActiveView("changePassword"), []);
  const openDeleteAccount = useCallback(() => setActiveView("deleteAccount"), []);
  const openDeleteConfirm = useCallback(() => setActiveView("deleteConfirm"), []);

  /* ───────── ROUTING (INSTANT) ───────── */
  if (activeView === "personalInfo") {
    return <PersonalInformation onBack={goMain} />;
  }

  if (activeView === "changePassword") {
    return <ChangePassword onBack={goMain} />;
  }

  if (activeView === "deleteAccount") {
    return <DeleteAccount onBack={goMain} onConfirm={openDeleteConfirm} />;
  }

  if (activeView === "deleteConfirm") {
    return <DeleteConfirm onBack={openDeleteAccount} />;
  }

  /* ───────── MAIN VIEW ───────── */
  return (
    <div
      className="
        min-h-full  
        
        p-4 sm:p-6
      "
    >
      <div className="w-full overflow-hidden">

        {/* Header */}
        <div className="flex justify-center items-center mb-6 mt-10">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Settings
          </h1>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* Navigation */}
          <div className="space-y-3">
            {[
              { label: "Personal Information", onClick: openPersonal },
              { label: "Change Password", onClick: openPassword },
            ].map((item, i) => (
              <div
                key={i}
                onClick={item.onClick}
                role="button"
                tabIndex={0}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/40 hover:bg-white/80 transition cursor-pointer"
              >
                <span className="text-sm sm:text-base font-medium text-gray-900">
                  {item.label}
                </span>
                <span className="text-gray-400">›</span>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-white/40">
            <span className="text-sm sm:text-base font-medium text-gray-900">
              Notifications
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden sm:inline">OFF</span>
              <PremiumToggle
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
                size="md"
              />
              <span className="text-xs text-gray-400 hidden sm:inline">ON</span>
            </div>
          </div>

          {/* Language */}
          <div className="p-4 rounded-2xl bg-white/60 border border-white/40">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Language</span>
              <span className="text-sm text-gray-600">English</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button className="w-full p-4 rounded-2xl bg-white/60 border border-white/40 hover:bg-white/80 transition">
              Sign Out
            </button>

            <div
              onClick={openDeleteAccount}
              role="button"
              tabIndex={0}
              className="w-full p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center cursor-pointer hover:bg-red-100 transition"
            >
              Delete Account
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
