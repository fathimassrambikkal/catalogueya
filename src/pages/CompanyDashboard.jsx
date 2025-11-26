import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar.jsx";
import Products from "../dashboard/Products.jsx";
import Sales from "../dashboard/Sales.jsx";
import Analytics from "../dashboard/Analytics.jsx";
import Settings from "../dashboard/Settings.jsx";
import Cover from "../dashboard/Cover.jsx";
import Contacts from "../dashboard/Contacts.jsx";
import Followers from "../dashboard/Followers.jsx";
import Notifications from "../dashboard/Notifications.jsx"; // ADD THIS IMPORT
import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { FollowersProvider } from "../context/FollowersContext";

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Products state
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // Company info state
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

  // Render content
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

      case "Followers":
        return <Followers />;

      case "Notifications": // ADD THIS CASE
        return <Notifications />;

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
    <FollowersProvider>
      <div className="flex bg-gray-100 min-h-screen overflow-x-hidden">
        {/* Sidebar - Fixed and hidden by default on desktop */}
        <div
          className={`fixed z-50 top-0 left-0 h-screen transition-all duration-300 w-60 lg:w-48
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-auto`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Sidebar Overlay - Only show on mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content - Fixed spacing issues */}
        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto min-w-0 lg:ml-0">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white text-gray-500 shadow-md hover:bg-gray-100 lg:hidden"
          >
            <TbLayoutSidebarRightFilled size={18} />
          </button>

          {/* Cover only on Products page */}
          {activeTab === "Products" && (
            <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
          )}

          {/* Main content area - removed extra margins and reduced padding */}
          <div className="flex-1 mt-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </FollowersProvider>
  );
}