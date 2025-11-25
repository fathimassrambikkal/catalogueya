import React, { useState, useEffect } from "react";
import Sidebar from "../Customer/Sidebar.jsx";
import Messages from "../Customer/Messages.jsx";
import Notifications from "../Customer/Notifications.jsx";
import Reviews from "../Customer/Reviews.jsx";
import Fav from "../Customer/Fav.jsx";
import Following from "../Customer/Following.jsx";
import Settings from "../Customer/Settings.jsx";
import Help from "../Customer/Help.jsx"; 
import { TbLayoutSidebarRightFilled } from "react-icons/tb";

export default function CustomerLogin() {
  const [activeTab, setActiveTab] = useState("messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <Messages />;
      case "notifications":
        return <Notifications />;
      case "reviews":
        return <Reviews />;
      case "fav": 
        return <Fav />;
      case "following":
        return <Following />;
      case "settings":
        return <Settings />;
      case "help":
        return <Help />;
      default:
        return <Messages />;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-screen transition-all duration-300 w-60 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar Overlay for when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300 min-w-0">

        {/* Sidebar Toggle Button - Visible on ALL screens */}
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="fixed top-4 left-6 z-50 p-3 rounded-xl text-sm bg-white text-gray-500 shadow-md hover:bg-gray-100"
        >
          <TbLayoutSidebarRightFilled size={18} />
        </button>

        <div className="flex-1 p-6 mt-16">{renderContent()}</div>
      </div>
    </div>
  );
}