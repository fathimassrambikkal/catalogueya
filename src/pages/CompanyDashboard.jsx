import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar.jsx";
import Products from "../dashboard/Products.jsx";
import Sales from "../dashboard/Sales.jsx";
import Analytics from "../dashboard/Analytics.jsx";
import Settings from "../dashboard/Settings.jsx";
import Cover from "../dashboard/Cover.jsx";
import Contacts from "../dashboard/Contacts.jsx";
import Followers from "../dashboard/Followers.jsx";
import Notifications from "../dashboard/Notifications.jsx";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { FollowersProvider } from "../context/FollowersContext";  

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Scroll to top when tab changes */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  /* Products state */
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  /* Company info state */
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem("companyInfo");
    return saved
      ? JSON.parse(saved)
      : {
          companyName: "",
          companyDescription: "",
          contactMobile: "",
          address: "",
          specialties: [],
          logo: null,
          coverPhoto: null,
          facebook: "",
          instagram: "",
          youtube: "",
          linkedin: "",
          pinterest: "",
          snapchat: "",
          whatsapp: "",
          google: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("companyInfo", JSON.stringify(companyInfo));
  }, [companyInfo]);

  return (
    <FollowersProvider>
      <div className="flex bg-gray-100 min-h-screen min-w-0 overflow-hidden">

        {/* Sidebar */}
        <div
          className={`
          fixed top-0 left-0 z-50 h-screen w-60 lg:w-48 
          transition-all duration-300 overflow-y-auto overflow-x-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:z-auto
        `}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white text-gray-500 shadow-md hover:bg-gray-100 lg:hidden"
          >
            <TbLayoutSidebarRightFilled size={18} />
          </button>

          {/* Cover only for Products */}
          {activeTab === "Products" && (
            <div className="min-w-0 overflow-hidden">
              <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
            </div>
          )}

          {/* PAGE CONTENT */}
          <div className="flex-1 w-full mt-0 min-w-0 overflow-x-hidden">

            {/* PRODUCTS */}
            <div className={activeTab === "Products" ? "block" : "hidden"}>
              <Products
                products={products}
                setProducts={setProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                companyInfo={companyInfo}
              />
            </div>

            {/* SALES */}
            <div className={activeTab === "Sales" ? "block" : "hidden"}>
              <Sales products={products} setProducts={setProducts} />
            </div>

            {/* ANALYTICS */}
            <div className={activeTab === "Analytics" ? "block" : "hidden"}>
              <Analytics products={products} />
            </div>

            {/* CONTACTS */}
            <div className={activeTab === "Contacts" ? "block" : "hidden"}>
              <Contacts companyInfo={companyInfo} products={products} />
            </div>

            {/* FOLLOWERS */}
            <div className={activeTab === "Followers" ? "block" : "hidden"}>
              <Followers />
            </div>

            {/* NOTIFICATIONS */}
            <div className={activeTab === "Notifications" ? "block" : "hidden"}>
              <Notifications />
            </div>

            {/* SETTINGS */}
            <div className={activeTab === "Settings" ? "block" : "hidden"}>
              <Settings
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
              />
            </div>

          </div>
        </div>
      </div>
    </FollowersProvider>
  );
}
