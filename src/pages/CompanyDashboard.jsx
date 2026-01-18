import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
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
import DashboardReviews from "../dashboard/DashboardReviews.jsx";
import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { FollowersProvider } from "../context/FollowersContext";
import { getCompany } from "../api";
import Cookies from "js-cookie";

/* ✅ HELPERS */
const getImageUrl = (path) => {
  if (!path || path === "null") return "";
  let finalPath = path;
  if (typeof finalPath === 'string' && finalPath.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(finalPath);
      finalPath = parsed.webp || parsed.avif || parsed[Object.keys(parsed)[0]];
    } catch (e) { }
  } else if (typeof finalPath === 'object' && finalPath !== null) {
    finalPath = finalPath.webp || finalPath.avif || finalPath[Object.keys(finalPath)[0]];
  }
  if (!finalPath || typeof finalPath !== 'string' || finalPath === "null") return "";
  if (finalPath.startsWith("http")) return finalPath;
  const lang = Cookies.get("lang") || "en";
  const cleanPath = finalPath.startsWith('/') ? finalPath.substring(1) : finalPath;
  return `https://catalogueyanew.com.awu.zxu.temporary.site/${lang}/storage/${cleanPath}`;
};

const normalizeProducts = (apiProducts) => {
  if (!Array.isArray(apiProducts)) return [];
  const lang = Cookies.get("lang") || "en";

  return apiProducts.map(p => {
    let tags = [];
    try {
      if (p.special_marks && typeof p.special_marks === 'string' && p.special_marks !== "null") {
        tags = JSON.parse(p.special_marks);
      } else if (Array.isArray(p.special_marks)) {
        tags = p.special_marks;
      } else if (p.tags) {
        tags = Array.isArray(p.tags) ? p.tags : [p.tags];
      }
    } catch (e) { }

    let albums = [];
    try {
      if (p.albums && typeof p.albums === 'string' && p.albums !== "null") {
        albums = JSON.parse(p.albums);
      } else if (Array.isArray(p.albums)) {
        albums = p.albums;
      }
    } catch (e) { }

    return {
      ...p,
      name: lang === 'ar' ? (p.name_ar || p.name) : (p.name_en || p.name),
      description: lang === 'ar' ? (p.description_ar || p.description) : (p.description_en || p.description),
      stock: p.quantity !== undefined ? p.quantity : p.stock,
      tags: tags,
      albums: albums,
      hidden: p.status === "0" || p.status === "hidden"
    };
  });
};

export default function CompanyDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

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
    id: null,
  });

  /* ✅ Load companyId from Redux or localStorage */
  useEffect(() => {
    console.log("🔍 Checking for company ID...", { reduxUser: user });

    // Priority 1: Redux Auth User
    if (user?.id) {
      console.log("✅ Found ID from Redux:", user.id);
      setCompanyId(user.id);
      return;
    }

    // Priority 2: LocalStorage "user"
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id) {
          console.log("✅ Found ID from LocalStorage (user):", parsed.id);
          setCompanyId(parsed.id);
          return;
        }
      }
    } catch (e) {
      console.error("Error parsing stored user:", e);
    }

    // Priority 3: Legacy "company" key
    try {
      const companyData = localStorage.getItem("company");
      if (companyData) {
        const company = JSON.parse(companyData);
        if (company?.id) {
          console.log("✅ Found ID from LocalStorage (company - legacy):", company.id);
          setCompanyId(company.id);
          return;
        }
      }
    } catch (error) {
      console.error("Error parsing company data:", error);
    }

    // If no ID found, stop loading
    console.warn("⚠️ No company ID found anywhere. Stopping loading.");
    setLoading(false);
  }, [user]);

  /* ✅ Fetch company from API - No fallback */
  useEffect(() => {
    if (!companyId) {
      // Don't modify loading here if it's already false/handled by previous effect logic
      // But if we have no ID, we definitely aren't loading data.
      return;
    }

    let mounted = true;
    setLoading(true);

    console.log("🔄 Fetching company data for ID:", companyId);

    getCompany(companyId)
      .then((res) => {
        if (!mounted) return;

        console.log("📥 API Response received");

        const company =
          res?.data?.data?.company ||
          res?.data?.company ||
          res?.data;

        if (!company) {
          console.error("❌ No company data received from API structure", res.data);
          return;
        }

        console.log("✅ Company processed:", company.name);

        if (Array.isArray(company.products)) {
          setProducts(normalizeProducts(company.products));
        }

        const lang = Cookies.get("lang") || "en";
        setCompanyInfo({
          companyName: (lang === 'ar' ? company.name_ar : company.name_en) || company.name || "",
          companyDescription: (lang === 'ar' ? company.description_ar : company.description_en) || company.description || "",
          contactMobile: company.mobile || company.phone || "",
          address: company.address || "",
          specialties: Array.isArray(company.specialties) ? company.specialties : [],
          logo: getImageUrl(company.logo),
          coverPhoto: getImageUrl(company.cover_photo),
          facebook: company.facebook || "",
          instagram: company.instagram || "",
          youtube: company.youtube || "",
          linkedin: company.linkedin || "",
          pinterest: company.pinterest || "",
          snapchat: company.snapchat || "",
          whatsapp: company.whatsapp || "",
          google: company.google || "",
          id: company.id || null,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        console.error("❌ Failed to fetch company:", err);
      })
      .finally(() => {
        if (mounted) {
          console.log("🏁 Loading finished");
          setLoading(false);
        }
      });

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn("⚠️ Forced loading timeout");
        setLoading(false);
      }
    }, 10000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [companyId]);

  /* ✅ Handle sign out */
  const handleSignOut = () => {
    // 1. Clear Redux
    dispatch(logout());

    // 2. Clear LocalStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    localStorage.removeItem("company");
    localStorage.removeItem("companyId");

    // 3. Navigate to Sign page
    navigate("/sign");
  };

  /* ✅ LISTEN FOR PRODUCT UPDATES */
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
  if (loading) {
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
      <div className="flex bg-gray-100 h-[100dvh] w-full overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`fixed lg:static top-0 left-0 z-50 h-full w-60 lg:w-48 flex-shrink-0
            transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 bg-white border-r`}
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSignOut={handleSignOut}
          />
        </div>

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT - min-h-0 is CRITICAL for nested scrolling */}
        <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden relative bg-gray-100">

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="absolute top-4 left-4 z-50 p-2 bg-white rounded-xl shadow lg:hidden"
          >
            <TbLayoutSidebarRightFilled size={18} />
          </button>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto h-full scroll-smooth">
            {/* COVER - Scrolls with content */}
            {activeTab === "Products" && (
              <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
            )}

            {/* TABS CONTENT */}
            <div className="p-4 sm:p-6 lg:p-8">
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

              {activeTab === "Reviews" && <DashboardReviews />}

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
          </div>
        </div>
      </div>
    </FollowersProvider>
  );
}