import React, { useState, useEffect } from "react";
import Sidebar from "../Customer/Sidebar.jsx";
import Messages from "../Customer/Messages.jsx";
import Notifications from "../Customer/Notifications.jsx";
import Reviews from "../Customer/Reviews.jsx";
import Fav from "../Customer/Fav.jsx";
import Following from "../Customer/Following.jsx";
import Settings from "../Customer/Settings.jsx";
import Help from "../Customer/Help.jsx";
import Fatora from "../Customer/Fatora.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setCustomerTab } from "../store/authSlice";

import { RiMenu2Fill } from "react-icons/ri";

function CustomerLogin() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.auth.customerActiveTab);
  const setActiveTab = (tab) => dispatch(setCustomerTab(tab));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

 

  /* ✅ ensure a default tab */
  useEffect(() => {
    if (!activeTab) {
      setActiveTab("messages");
    }
  }, [activeTab, setActiveTab]);

  /* Detect mobile / desktop */
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden  bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30
        backdrop-blur-[2px]
       
        border border-white/80
        shadow-[0_8px_32px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.8)]
       
    
        ">
      {/* ================= Sidebar ================= */}
      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"}
          h-full
          bg-white
          border-r border-gray-200/80
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          flex flex-col
          shadow-sm
        `}
      >
        {/* Sidebar Content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            onCloseSidebar={() => isMobile && setSidebarOpen(false)}
            isMobile={isMobile}
          />
        </div>
      </aside>

      {/* ================= Overlay (mobile) ================= */}
      {isMobile && (
        <div
          onClick={() => setSidebarOpen(false)}
          className={`
            fixed inset-0 bg-black/40 z-30
            transition-opacity duration-300
            ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }
          `}
        />
      )}

      {/* ================= Mobile Menu Button ================= */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="
            fixed left-2 top-12 z-50
            p-2
            flex items-center justify-center
            rounded-xl
            bg-white/90 backdrop-blur
            border border-gray-200
            shadow-sm
            hover:shadow-md hover:bg-white
            active:scale-95
            transition-all duration-200
          "
        >
          <RiMenu2Fill size={18} className="text-gray-700" />
        </button>
      )}

      {/* ================= Main Content ================= */}
      <main className="flex-1 h-full w-full bg-gray-50 overflow-hidden">
        {/* ✅ FIX 2: SINGLE SCROLL CONTAINER */}
        <div className="h-full overflow-y-auto">
          {activeTab === "messages" && <Messages />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "reviews" && <Reviews />}
          {activeTab === "fav" && <Fav />}
          {activeTab === "following" && <Following />}
          {activeTab === "fatora" && <Fatora />}
          {activeTab === "settings" && <Settings />}
          {activeTab === "help" && <Help />}
        </div>
      </main>
    </div>
  );
}

export default CustomerLogin;
