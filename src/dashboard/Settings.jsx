import React, { useState } from "react";
import SettingsProfile from "./SettingsProfile";
import SettingsPlan from "./SettingsPlan";
import SettingsBillingPage from "./SettingsBillingPage";
import SettingsChangePassword from "./SettingsChangePassword";

import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";
function Settings({ companyId, companyInfo, setCompanyInfo }) {

  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
  const [activePage, setActivePage] = useState("dashboard");

const items = [
  {
    id: "profile",
    label: fw.profile || "Profile",
    description: fw.manage_profile_settings || "Manage your profile settings",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    id: "plans",
    label: fw.plans || "Plans",
    description: fw.manage_plans_settings || "Manage your plans settings",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "billing",
    label: fw.billing || "Billing",
    description: fw.manage_billing_settings || "Manage your billing settings",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
  },
  {
    id: "changePassword",
    label: fw.change_password || "Change Password",
    description: fw.change_password || "Change Password",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1V9a5 5 0 10-10 0v2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

  /* ================= SUB PAGES ================= */

  if (activePage === "profile") {
    return (
      <SettingsProfile
        companyId={companyId}
        companyInfo={companyInfo}
        setCompanyInfo={setCompanyInfo}
        onBack={() => setActivePage("dashboard")}
      />
    );
  }

  if (activePage === "plans") {
    return <SettingsPlan onBack={() => setActivePage("dashboard")} onTabChange={setActivePage} />;
  }
  if (activePage === "billing") {
  return <SettingsBillingPage onBack={() => setActivePage("dashboard")} />;
}

if (activePage === "changePassword") {
  return <SettingsChangePassword onBack={() => setActivePage("dashboard")} />;
}
  /* ================= SETTINGS DASHBOARD ================= */

  return (
    <div
  dir={isRTL ? "rtl" : "ltr"}
  className="w-full min-h-screen flex flex-col overflow-x-hidden p-4 sm:p-6 bg-white pt-16 md:pt-0 mt-4"
>
      <div className="flex-1 flex flex-col min-h-0 ">
        <div className="
         flex-1 overflow-hidden flex flex-col
        ">
          {/* Header */}
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-gray-200/60">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
             {fw.settings || "Settings"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {fw.manage_account_settings_preferences || "Manage your account settings and preferences"}
            </p>
          </div>

          {/* Menu */}
          <div className="divide-y divide-gray-200/60">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className="
                  w-full
                  flex items-center justify-between
                  px-4 sm:px-6 md:px-8
                  py-3 sm:py-4
                  text-left
                  
                  hover:bg-blue-50/60
                  transition-colors
                "
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 rounded-lg bg-blue-50/80 text-blue-600 border border-blue-100/60">
                    {item.icon}
                  </div>

                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-800">
                      {item.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.description}
                    </span>
                  </div>
                </div>

              <svg
  className={`w-4 h-4 text-gray-400 ${isRTL ? "rotate-180" : ""}`}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
>
  <polyline points="9 18 15 12 9 6" />
</svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
