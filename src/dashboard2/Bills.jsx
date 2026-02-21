import React, { useState } from "react";

import CreateBills from "./CreateBills";
import PendingBills from "./PendingBills";
import PaidBills from "./PaidBills";

import UnpaidBills from "./UnpaidBills";
import DraftBills from "./DraftBills";

import {
  IconCreate,
  IconPending,
  IconPast,
  IconUnpaid,
  IconDraft,
  IconBank,
} from "./CompanySvg";

const Bills = () => {
  const [activePage, setActivePage] = useState("dashboard");

  const items = [
    { id: "create", label: "Create a Bill", icon: IconCreate },
    { id: "pending", label: "Pending Bill", icon: IconPending, count: 50 },
    { id: "past", label: "Paid Bill", icon: IconPast, count: 9 },
    { id: "unpaid", label: "Unpaid Bill", icon: IconUnpaid, count: 3 },

     { id: "draftBills", label: "Draft Bills", icon: IconDraft },
    { id: "bank", label: "Edit Bank Account", icon: IconBank, disabled: true },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "create":
        return <CreateBills onBack={() => setActivePage("dashboard")} />;
      case "pending":
        return <PendingBills onBack={() => setActivePage("dashboard")} />;
      case "past":
        return <PaidBills onBack={() => setActivePage("dashboard")} />;
      case "unpaid":
        return <UnpaidBills onBack={() => setActivePage("dashboard")} />;
     
         case "draftBills":
      return <DraftBills onBack={() => setActivePage("dashboard")} />;
      default:
        return null;
    }
  };

  if (activePage !== "dashboard") return renderPage();

  return (
    <div className=" min-h-screen bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 w-full max-w-7xl mt-10 min-w-0">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
   
      <div className="flex flex-col leading-tight">
  <span className="text-gray-900 text-3xl font-semibold tracking-tight">
    Bills
  </span>


        </div>
      </div>

      {/* MENU */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          //  SPECIAL CASE: BANK (COMING SOON CARD)
          if (item.id === "bank") {
            return (
              <div
                key={item.id}
                className="
                  w-full
                  flex items-center justify-between
                  px-[clamp(12px,3vw,20px)]
                  py-[clamp(12px,3vw,18px)]
                  rounded-[clamp(10px,2vw,14px)]
                  border border-gray-200
                  bg-gray-50/60
                  opacity-80
                  cursor-not-allowed
                "
              >
                <div className="flex items-center gap-[clamp(10px,2vw,16px)]">
                  <Icon className="w-5 h-5 text-gray-400" />

                  <span className="text-gray-700 font-medium">
                    Edit Bank Account
                  </span>
                </div>

                <span
                  className="
                    text-[clamp(11px,2.8vw,13px)]
                    font-medium
                    text-gray-400
                    px-[clamp(8px,2vw,12px)]
                    py-[clamp(4px,1vw,6px)]
                    bg-white/80
                    rounded-full
                    border border-gray-200
                    whitespace-nowrap
                  "
                >
                  Coming Soon
                </span>
              </div>
            );
          }

          // ✅ NORMAL ITEMS
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`
                flex items-center w-full px-5 py-4 rounded-xl border transition-all
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5 mr-4" />

              <span className="text-base font-medium flex-1 text-left">
                {item.label}
              </span>

              {item.count !== undefined && (
                <span className="text-sm text-gray-500">
                  ({item.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Bills;
