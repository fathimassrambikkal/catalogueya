import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar.jsx";
import Products from "../dashboard/Products.jsx";
import Sales from "../dashboard/Sales.jsx";
import Analytics from "../dashboard/Analytics.jsx";
import Settings from "../dashboard/Settings.jsx";
import Cover from "../dashboard/Cover.jsx";
import Contacts from "../dashboard/Contacts.jsx"; 
import { TbLayoutSidebarRightFilled } from "react-icons/tb";

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  ADDED — scroll to top when tab changes (Fixes Edit button)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);
  // END FIX

  // ============================
  // PRODUCTS (Already Working)
  // ============================
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ======================================
  // COMPANY INFO (FIXED + LOCAL STORAGE)
  // ======================================
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

  // ======================================
  // RENDER CONTENT
  // ======================================
  const renderContent = () => {
    switch (activeTab) {
      case "Products":
        return (
          <Products
            products={products}
            setProducts={setProducts}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            companyInfo={companyInfo}
          />
        );

      case "Sales":
        return <Sales products={products} setProducts={setProducts} />;

      case "Analytics":
        return <Analytics products={products} />;

      case "Contacts": 
        return <Contacts companyInfo={companyInfo} products={products} />;

      case "Settings":
        return (
          <Settings
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed z-50 top-0 left-0 h-screen transition-all duration-300 w-60 md:relative md:h-auto md:min-h-full ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:min-h-screen overflow-y-auto transition-all duration-300 min-w-0">

        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="fixed top-4 left-4 z-50 p-3 rounded-xl text-sm bg-white text-gray-500 shadow-md hover:bg-gray-100 md:hidden"
        >
          <TbLayoutSidebarRightFilled size={18} />
        </button>

        {/* Cover only on Products page */}
        {activeTab === "Products" && (
          <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
        )}

        <div className="flex-1 p-6">{renderContent()}</div>
      </div>
    </div>
  );
}