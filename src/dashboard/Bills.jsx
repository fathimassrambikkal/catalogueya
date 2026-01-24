import React, { useState } from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import Createfatora from "./Createfatora";
import Pendingfatora from "./Pendingfatora";
import Pastfatora from "./Pastfatora";
import Draftfatora from "./Draftfatora";

const IconCreate = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconPending = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M7 9h10M7 13h6" />
  </svg>
);

const IconPast = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M14 2v6h6" />
  </svg>
);

const IconDraft = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconBank = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M3 10h18" />
    <path d="M5 10v10M9 10v10M15 10v10M19 10v10" />
    <path d="M2 10l10-6 10 6" />
  </svg>
);

const Bills = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const items = [
    { id: "create", label: "Create a Bill", icon: IconCreate },
    { id: "pending", label: "Pending Fatora", icon: IconPending, count: 50 },
    { id: "past", label: "Past Fatora", icon: IconPast, count: 9 },
    { id: "draft", label: "Draft Fatora", icon: IconDraft, count: 4 },
    {
      id: "bank",
      label: "Edit Bank Account",
      icon: IconBank,
      disabled: true,
      badge: "Coming Soon",
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "create":
        return <Createfatora onBack={() => setActivePage("dashboard")} />;
      case "pending":
        return <Pendingfatora onBack={() => setActivePage("dashboard")} />;
      case "past":
        return <Pastfatora onBack={() => setActivePage("dashboard")} />;
      case "draft":
        return <Draftfatora onBack={() => setActivePage("dashboard")} />;
      default:
        return null;
    }
  };

  if (activePage !== "dashboard") return renderPage();

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 w-full max-w-2xl mt-10 min-w-0">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-white px-5 py-3 rounded-xl border border-gray-100">
          <div className="flex flex-col leading-tight">
            <span className="text-gray-400 text-xs tracking-wide">Powered by</span>
            <span className="text-blue-600 text-3xl font-semibold tracking-tight">
              Fatora
            </span>
          </div>
          <img src={fatoraLogo} alt="Fatora" className="h-12 ml-4 object-contain" />
        </div>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              <button
                disabled={item.disabled}
                onClick={item.disabled ? undefined : () => setActivePage(item.id)}
                className={`flex items-center w-full px-5 py-4 rounded-xl border transition-all
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }
                  ${item.disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <Icon className={`w-5 h-5 mr-4 ${item.disabled ? "text-gray-400" : ""}`} />

                <span className="text-base font-medium flex-1 text-left">
                  {item.label}
                </span>

                {item.count !== undefined && (
                  <span className="text-sm text-gray-500">
                    ({item.count})
                  </span>
                )}
              </button>

              {/* TOOLTIP */}
              {item.disabled && (
                <div className="absolute top-1/2 right-[-6px] translate-x-full -translate-y-1/2
                  opacity-0 group-hover:opacity-100 transition
                  bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap
                ">
                  Coming soon
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bills;
