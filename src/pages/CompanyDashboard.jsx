import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getCompany } from "../api";

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);

  /* ✅ PRODUCTS STATE */
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  /* ✅ COMPANY INFO */
  const [companyInfo, setCompanyInfo] = useState({
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
  });

  /* ✅ Load companyId from localStorage */
  useEffect(() => {
    const companyData = localStorage.getItem("company");

    if (!companyData) {
      alert("Please login first.");
      navigate("/company-login");
      return;
    }

    try {
      const company = JSON.parse(companyData);

      if (!company?.id) {
        navigate("/company-login");
        return;
      }

      setCompanyId(company.id);
      localStorage.setItem("companyId", company.id.toString());
    } catch {
      navigate("/company-login");
    }
  }, [navigate]);

  /* ✅ Fetch company from API */
  useEffect(() => {
    if (!companyId) return;

    let mounted = true;

    getCompany(companyId)
      .then((res) => {
        if (!mounted) return;

        const company =
          res?.data?.data?.company ||
          res?.data?.company ||
          res?.data;

        if (!company) return;

        if (Array.isArray(company.products)) {
          setProducts(company.products);
        }

        setCompanyInfo({
          companyName: company.name || "",
          companyDescription: company.description || "",
          contactMobile: company.mobile || "",
          address: company.address || "",
          specialties: Array.isArray(company.specialties)
            ? company.specialties
            : [],
          logo: company.logo || null,
          coverPhoto: company.cover_photo || null,
          facebook: company.facebook || "",
          instagram: company.instagram || "",
          youtube: company.youtube || "",
          linkedin: company.linkedin || "",
          pinterest: company.pinterest || "",
          snapchat: company.snapchat || "",
          whatsapp: company.whatsapp || "",
          google: company.google || "",
        });
      })
      .catch((err) => {
        console.error("❌ Failed to fetch company:", err);
      });

    return () => {
      mounted = false;
    };
  }, [companyId]);

  /* ✅ 🔥 LISTEN FOR PRODUCT UPDATES (FIX) */
  useEffect(() => {
    const handleProductsUpdated = (event) => {
      if (event.detail?.companyId !== companyId) return;

      if (Array.isArray(event.detail.products)) {
        console.log("✅ Dashboard received product updates");
        setProducts(event.detail.products);
      }
    };

    window.addEventListener("productsUpdated", handleProductsUpdated);

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated);
    };
  }, [companyId]);

  /* ✅ Scroll to top when tab changes */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  /* ✅ Loading state */
  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <FollowersProvider>
      <div className="flex bg-gray-100 min-h-screen w-full overflow-x-hidden">

        {/* SIDEBAR */}
        <div
          className={`fixed lg:static top-0 left-0 z-50 h-screen w-60 lg:w-48
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
        >
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow lg:hidden"
          >
            <TbLayoutSidebarRightFilled size={18} />
          </button>

          {/* COVER */}
          {activeTab === "Products" && (
            <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
          )}

          {/* TABS */}
          <div className="flex-1">
            {activeTab === "Products" && (
              <Products
                products={products}
                setProducts={setProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
                companyId={companyId}
              />
            )}

            {activeTab === "Sales" && (
              <Sales products={products} setProducts={setProducts} />
            )}

            {activeTab === "Analytics" && (
              <Analytics products={products} />
            )}

            {activeTab === "Contacts" && (
              <Contacts companyInfo={companyInfo} products={products} />
            )}

            {activeTab === "Followers" && <Followers />}

            {activeTab === "Notifications" && <Notifications />}

            {activeTab === "Settings" && (
              <Settings
                companyId={companyId}
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
              />
            )}
          </div>
        </div>
      </div>
    </FollowersProvider>
  );
}
