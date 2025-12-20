import React, { useState } from "react";
import fatoraLogo from "../assets/fatoralogo.webp";
import Createfatora from "./Createfatora";
import Pendingfatora from "./Pendingfatora";
import Pastfatora from "./Pastfatora";

const Fatora = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const items = [
    {
      id: "create",
      label: "Create",
      isCreate: true,
    },
    {
      id: "pending",
      label: "Pending Fatora",
    },
    {
      id: "past",
      label: "Past Fatora",
    },
    {
      id: "bank",
      label: "Bank Account",
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
      default:
        return null;
    }
  };

  if (activePage !== "dashboard") return renderPage();

  const handleClick = (itemId) => {
    if (itemId === "bank") {
      // Do nothing for Bank Account - stay on dashboard
      return;
    }
    setActivePage(itemId);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 w-full max-w-2xl mt-10 min-w-0">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-white px-5 py-3 rounded-xl border border-gray-100">
          {/* TEXT */}
          <div className="flex flex-col leading-tight">
            <span className="text-gray-400 text-xs tracking-wide">
              Powered by
            </span>
            <span className="text-blue-600 text-3xl font-semibold tracking-tight">
              Fatora
            </span>
          </div>

          {/* LOGO */}
          <img
            src={fatoraLogo}
            alt="Fatora"
            className="h-12 ml-4 object-contain"
          />
        </div>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isActive = activePage === item.id;
          const isBankAccount = item.id === "bank";

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`flex items-center px-5 py-4 rounded-xl border transition-all
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }
                ${isBankAccount ? "cursor-default" : "cursor-pointer"}
              `}
              disabled={isBankAccount}
            >
              {/* CREATE → TEXT + LOGO */}
              {item.isCreate ? (
                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold tracking-wide">
                    {item.label}
                  </span>

                  <div className="px-2 py-1 rounded-md ">
                    <img
                      src={fatoraLogo}
                      alt="Fatora"
                      className="w-12 h-6 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <span className={`text-base font-medium ${isBankAccount ? "text-gray-500" : ""}`}>
                  {item.label}
                </span>
              )}
              {isBankAccount && (
                <span className="ml-auto text-xs text-gray-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Fatora;