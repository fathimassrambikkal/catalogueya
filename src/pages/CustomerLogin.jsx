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
    <div className="flex w-full h-[calc(100vh-64px)] overflow-hidden  /* 🌊 Apple-style soft blue gradient */
    bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(900px_circle_at_80%_20%,rgba(99,102,241,0.14),transparent_45%),linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.96))]

    /* 🧊 Glass feel */
    backdrop-blur-xl

    /* ✨ Depth without visible borders */
    shadow-[0_20px_60px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]
    
        ">
      {/* ================= Sidebar ================= */}
      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"}
        
bg-gradient-to-br from-blue-500 to-sky-400
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          flex flex-col
          shadow-sm
        `}
      >
        {/* Sidebar Content */}
        <div className="flex-1 min-h-0 ">
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
    fixed top-14 left-6 z-50
    h-10 w-10
    flex items-center justify-center
    rounded-2xl

    bg-white/60
    backdrop-blur-xl

    shadow-[0_10px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]
    hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
    
    transition-all duration-300 ease-out
    active:scale-95
  "
>
  <RiMenu2Fill className="w-4 h-4 text-slate-600" />
</button>

      )}

      {/* ================= Main Content ================= */}
      <main className="flex-1 h-full w-full  bg-white/60
    backdrop-blur-xl overflow-hidden">
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
