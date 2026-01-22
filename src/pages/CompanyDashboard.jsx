import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar.jsx";
import Products from "../dashboard/Products.jsx";
import Sales from "../dashboard/Sales.jsx";
import Analytics from "../dashboard/Analytics.jsx";
import Settings from "../dashboard/Settings.jsx";
import Cover from "../dashboard/Cover.jsx";
import Contacts from "../dashboard/Contacts.jsx";
import Followers from "../dashboard/Followers.jsx";
import Notifications from "../dashboard/Notifications.jsx";
import Fatora from "../dashboard/Fatora.jsx";
import { RiMenu2Fill } from "react-icons/ri";
import { FollowersProvider } from "../context/FollowersContext";
import { getCompany } from "../api";

/* ================= Utilities ================= */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
};

export default function CompanyDashboard() {
  const location = useLocation();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    companyDescription: "",
    contactMobile: "",
    address: "",
    specialties: [],
    logo: null,
    coverPhoto: null,
  });

  /* Restore tab when coming back from details */
  useEffect(() => {
    if (location.state?.restoreTab) {
      setActiveTab(location.state.restoreTab);
    }
  }, [location.state]);

  /* Load companyId */
  useEffect(() => {
    const company = JSON.parse(localStorage.getItem("company") || "null");
    if (!company?.id) {
      setLoading(false);
      return;
    }
    setCompanyId(String(company.id));
  }, []);

  /* Fetch company */
  useEffect(() => {
    if (!companyId) return;

    let mounted = true;
    setLoading(true);

    getCompany(companyId)
      .then((res) => {
        if (!mounted) return;
        const company =
          res?.data?.data?.company || res?.data?.company || res?.data;
        if (!company) return;

        setProducts(company.products || []);
        setCompanyInfo({
          companyName: company.name || "",
          companyDescription: company.description || "",
          coverPhoto: company.cover_photo || null,
          logo: company.logo || null,
        });
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [companyId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <FollowersProvider>
      {/* 🔒 LOCK VIEWPORT */}
      <div className="relative flex w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-100">

        {/* ================= Sidebar ================= */}
        <aside
          className={`
            ${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"}
           
            bg-white
            transform transition-transform duration-300 ease-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            shadow-lg
          `}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (isMobile) setSidebarOpen(false);
            }}
            onCloseSidebar={() => setSidebarOpen(false)}
            isMobile={isMobile}
          />
        </aside>

        {/* ================= Overlay (mobile) ================= */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30"
          />
        )}

        {/* ================= Mobile Menu Button ================= */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="
              fixed top-20 left-3 z-50
              h-10 w-10
              flex items-center justify-center
              rounded-2xl
              bg-white/70 backdrop-blur-xl
              shadow-lg
              active:scale-95
            "
          >
            <RiMenu2Fill className="w-4 h-4 text-gray-700" />
          </button>
        )}

        {/* ================= Main ================= */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">

          {/* Fixed header / cover */}
          {activeTab === "Products" && (
            <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
          )}

          {/* 🔥 ONLY SCROLL AREA */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {activeTab === "Products" && (
              <Products
                products={products}
                setProducts={setProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                companyId={companyId}
              />
            )}

            {activeTab === "Sales" && <Sales products={products} />}
            {activeTab === "Analytics" && <Analytics products={products} />}
            {activeTab === "Contacts" && (
              <Contacts companyInfo={companyInfo} products={products} />
            )}
            {activeTab === "Followers" && <Followers />}
            {activeTab === "Notifications" && <Notifications />}
            {activeTab === "Fatora" && (
              <Fatora
                companyId={companyId}
                companyInfo={companyInfo}
                products={products}
              />
            )}
            {activeTab === "Settings" && (
              <Settings
                companyId={companyId}
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
              />
            )}
          </div>
        </main>
      </div>
    </FollowersProvider>
  );
}
