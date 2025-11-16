import React from "react";
import {
  FaTags,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: "Products", icon: <FaTags /> },
    { label: "Sales", icon: <FaShoppingCart /> },
    { label: "Analytics", icon: <FaChartLine /> },
    { label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="w-60 bg-white h-screen shadow-md flex flex-col pt-6">
      <div className="text-2xl font-bold text-center mb-6"></div>

      <nav className="flex-1">
        {tabs.map((t) => (
          <button
            key={t.label}
            onClick={() => setActiveTab(t.label)}
            className={`flex items-center gap-3 px-6 py-3 text-sm w-full text-left 
              ${
                activeTab === t.label
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 border-t">
        <FaSignOutAlt />
        Sign Out
      </button>
    </div>
  );
};

export default Sidebar;
