import React, { useState } from "react";

import CreateBills from "./CreateBills";
import PendingBills from "./PendingBills";
import PaidBills from "./PaidBills";

import UnpaidBills from "./UnpaidBills";
import DraftBills from "./DraftBills";


import {
  getPendingBills,
  getPaidBills,
  getUnpaidBills,
  getDraftBills
} from "../companyDashboardApi";

const Bills = ({ companyId, companyInfo, products }) => {
  const [activePage, setActivePage] = useState("create");
  const [editingBillId, setEditingBillId] = useState(null);

  const [counts, setCounts] = useState({
    pending: 0,
    past: 0,
    unpaid: 0,
    draftBills: 0
  });

  React.useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [pendingRes, paidRes, unpaidRes, draftRes] = await Promise.all([
        getPendingBills(),
        getPaidBills(),
        getUnpaidBills(),
        getDraftBills()
      ]);

      const getCount = (res) => {
        if (Array.isArray(res.data)) return res.data.length;
        if (res.data?.data && Array.isArray(res.data.data)) return res.data.data.length;
        if (res.data?.bills && Array.isArray(res.data.bills)) return res.data.bills.length;
        return 0;
      };

      setCounts({
        pending: getCount(pendingRes),
        past: getCount(paidRes),
        unpaid: getCount(unpaidRes),
        draftBills: getCount(draftRes)
      });
    } catch (error) {
      console.error("Error fetching bill counts:", error);
    }
  };

  const handleEditBill = (billId) => {
    setEditingBillId(billId);
    setActivePage("create");
  };

  const handleBackToDashboard = () => {
    setActivePage("create"); 
    setEditingBillId(null);
    fetchCounts();
  };

  const tabs = [
    { id: "create", label: "CREATING", count: null, color: "bg-blue-600" }, 
    { id: "pending", label: "PENDING", count: counts.pending, color: "bg-gray-400" },
    { id: "unpaid", label: "UNPAID", count: counts.unpaid, color: "bg-gray-400" },
    { id: "past", label: "PAID", count: counts.past, color: "bg-gray-400" },
    
  ];

  const renderContent = () => {
    switch (activePage) {
      case "create":
        return (
          <CreateBills
            onBack={handleBackToDashboard}
            products={products}
            editBillId={editingBillId}
          />
        );
      case "pending":
        return <PendingBills onBack={handleBackToDashboard} refreshCounts={fetchCounts} />;
      case "past":
        return <PaidBills onBack={handleBackToDashboard} />;
      case "unpaid":
        return <UnpaidBills onBack={handleBackToDashboard} />;
      case "draftBills":
        return <DraftBills onBack={handleBackToDashboard} onEdit={handleEditBill} />;
      default:
        return null;
    }
  };

return (
  <div className="min-h-screen bg-white w-full  ">
    <div className="flex items-center px-6 sm:px-10 lg:px-16 py-4 sm:py-6 ">
      <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mt-20 md:mt-4">Bills Status</h1>
      <button
        onClick={() => setActivePage('draftBills')}
        className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-blue-500 transition"
      >
        {/* View Drafts ({counts.draftBills}) */}
      </button>
    </div>

    {/* GHOST PILL WITH SLIDING INDICATOR */}
    <div className="flex justify-start mb-8 sm:mb-12 px-6 sm:px-10 lg:px-16">
      <div className="relative inline-flex bg-gray-100 p-1 rounded-full w-full max-w-md sm:max-w-lg md:max-w-xl">
        {/* Sliding background indicator */}
        <div 
          className="absolute top-1 bottom-1 rounded-full bg-blue-500 shadow-sm transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${tabs.findIndex(tab => tab.id === activePage) * 100}%)`,
          }}
        />
        
  {/* Tabs */}
{tabs.map((tab) => {
  const isActive = activePage === tab.id;
  return (
    <button
      key={tab.id}
      onClick={() => setActivePage(tab.id)}
      className={`
        relative flex-1
        px-[clamp(6px,1.2vw,16px)]
        py-[clamp(4px,1.5vw,10px)]
        rounded-full
        text-[clamp(9px,1vw,14px)]
        font-medium
        transition-colors duration-200
        z-10
        whitespace-nowrap
        ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-900'}
      `}
    >
      <span className="flex items-center justify-center gap-[clamp(4px,0.6vw,8px)]">
        {tab.label}
        {tab.count > 0 && (
          <div
    className={`
      absolute top-1 right-1
      text-[10px] w-5 h-5
      flex items-center justify-center
      rounded-full
      transition-colors duration-200
      ${isActive
        ? "bg-white text-blue-500"
        : "bg-blue-500 text-white"}
    `}
  >
            {tab.count}
          </div>
        )}
      </span>
    </button>
  );
})}
      </div>
    </div>

    {/* CONTENT */}
    <div className="mt-4 sm:mt-6 px-6 sm:px-10 lg:px-16">
      {renderContent()}
    </div>
  </div>
);
};

export default Bills;
