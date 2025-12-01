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

function CustomerLogin() {
  const [activeTab, setActiveTab] = useState("messages");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex bg-gray-100 min-h-screen w-full overflow-x-hidden">

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 max-w-[90%] 
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          bg-white z-50 overflow-y-auto overflow-x-hidden
        `}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Black Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen w-full overflow-y-auto overflow-x-hidden relative">

        {/* Toggle Button */}
        <div className="fixed top-4 left-3 sm:left-6 z-30">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-3 rounded-xl text-sm bg-white text-gray-600 shadow-md hover:bg-gray-100"
          >
            <TbLayoutSidebarRightFilled size={18} />
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 mt-16 w-full max-w-full overflow-x-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
