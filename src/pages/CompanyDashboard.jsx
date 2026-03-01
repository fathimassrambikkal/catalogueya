import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar.jsx";
import Products from "../dashboard/Products.jsx";
import Sales from "../dashboard/Sales.jsx";
import Analytics from "../dashboard/Analytics.jsx";
import Settings from "../dashboard/Settings.jsx";
import Cover from "../dashboard/Cover.jsx";
import Contacts from "../dashboard/Contacts.jsx";
import Followers from "../dashboard/Followers.jsx";
import Notifications from "../dashboard/Notifications.jsx";
import Bills from "../dashboard/Bills.jsx";
import { RiMenu2Fill } from "react-icons/ri";
import Messages from "../dashboard/Messages.jsx";
import DashboardReviews from "../dashboard/DashboardReviews.jsx";

import { getCompany } from "../api";
import Pusher from "pusher-js";
import { getConversations, getNotifications, getUnreadNotificationsCount, markAllNotificationsAsRead, getFollowers, getCompanyReviewsDashboard } from "../companyDashboardApi";
import { updateProfile } from "../store/authSlice";


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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useIsMobile();
const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Products");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [targetConversationId, setTargetConversationId] = useState(null);

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    companyDescription: "",
    contactMobile: "",
    address: "",
    specialties: [],
    logo: null,
    coverPhoto: null,
  });

  /* Restore tab when coming back from details - CONSUME AND CLEAR */
  useEffect(() => {
    if (location.state?.restoreTab) {
      setActiveTab(location.state.restoreTab);

      if (location.state?.targetConversationId) {
        setTargetConversationId(location.state.targetConversationId);
      }

      // 🗑 Clear state so it doesn't re-trigger on page refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  /* Load companyId & stored details */
  useEffect(() => {
    // 1. Get basic company info from login session
    const company = JSON.parse(localStorage.getItem("company") || "null");
    if (company?.id) {
      setCompanyId(String(company.id));
    }

    // 2. Try to get cached details
    const stored = JSON.parse(localStorage.getItem("company_details") || "null");

    // 3. Fallback to company session if details are missing
    if (stored) {
      setCompanyInfo(stored);
      setLoading(false);
    } else if (company) {
      // If we have login info but no details cache, use login info as initial state
      const initialInfo = {
        ...company,
        companyName: company.name || company.name_en || "",
        companyDescription: company.description || company.description_en || "",
        coverPhoto: company.cover_photo || company.banner || null,
        logo: company.logo || null,
      };
      setCompanyInfo(initialInfo);
      setLoading(false);
    } else if (!company?.id) {
      setLoading(false);
    }
  }, []);

  /* Fetch company */
  useEffect(() => {
    if (!companyId) return;

    let mounted = true;
    if (!companyInfo.companyName) setLoading(true);

    getCompany(companyId)
      .then((res) => {
        if (!mounted) return;

        const companyData = res?.data?.data?.company || res?.data?.company || res?.data;
        if (!companyData) return;

        setProducts(companyData.products || []);

        const info = {
          ...companyData,
          companyName: companyData.name || companyData.name_en || "",
          companyDescription: companyData.description || companyData.description_en || "",
          coverPhoto: companyData.cover_photo || companyData.banner || null,
          logo: companyData.logo || null,
          phone: companyData.phone || "",
          contactMobile: companyData.phone || companyData.mobile || "",
          address: companyData.address || "",
        };

        setCompanyInfo(info);
        // Ensure Redux is also in sync with latest API data
        dispatch(updateProfile(info));
        localStorage.setItem("company_details", JSON.stringify(info));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [companyId, user?.id]); // Also react if user ID changes

  /* ================= PUSHER & COUNTS ================= */
  const [unreadCounts, setUnreadCounts] = useState({ messages: 0, notifications: 0, followers: 0, reviews: 0 });
  const [lastMessageEvent, setLastMessageEvent] = useState(null);

  // Fetch initial counts
  const fetchCounts = async () => {
    if (!companyId) return;
    try {
      // Notifications
      const notifRes = await getNotifications();
      let notifList = [];
      if (notifRes.data?.data) {
        notifList = Array.isArray(notifRes.data.data) ? notifRes.data.data : (notifRes.data.data.notifications || []);
      } else if (Array.isArray(notifRes.data)) {
        notifList = notifRes.data;
      }
      const notifCount = notifList.filter(n => !n.read && !n.read_at).length;

      // Messages (Only if Messages component is NOT active, otherwise it handles it)
      if (activeTab !== "Messages") {
        const convRes = await getConversations();
        let convList = [];

        // Handle various response structures
        const rawData = convRes.data;
        if (rawData?.data) {
          convList = Array.isArray(rawData.data) ? rawData.data : (rawData.data.conversations || []);
        } else if (Array.isArray(rawData)) {
          convList = rawData;
        }

        const msgCount = convList.reduce((acc, c) => acc + (c.unread_count || 0), 0);
        setUnreadCounts(prev => ({ ...prev, messages: msgCount, notifications: notifCount }));
      } else {
        setUnreadCounts(prev => ({ ...prev, notifications: notifCount }));
      }

      // 👥 Followers Count - FETCH ALWAYS
      const followersRes = await getFollowers();
      let followersCount = 0;
      if (followersRes.data?.data) {
        const list = Array.isArray(followersRes.data.data) ? followersRes.data.data : (followersRes.data.data.followers || []);
        followersCount = list.length;
      } else if (Array.isArray(followersRes.data)) {
        followersCount = followersRes.data.length;
      }

      // ⭐ Reviews Count - FETCH ALWAYS
      const reviewsRes = await getCompanyReviewsDashboard(companyId, user?.id);
      const reviewsCount = reviewsRes.data?.data?.total_reviews_count || reviewsRes.data?.total_reviews_count || 0;

      setUnreadCounts(prev => ({
        ...prev,
        followers: followersCount,
        reviews: reviewsCount
      }));

    } catch (e) {
      console.error("Error fetching dashboard counts", e);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [companyId, activeTab]);


  useEffect(() => {
  if (activeTab !== "Messages") {
    setIsChatOpen(false);
  }
}, [activeTab]);
  // Initialize Pusher
  useEffect(() => {
    if (!companyId) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Use a unique socket ID if possible or just standard init
    const pusher = new Pusher("a613271cbafcf4059d6b", {
      cluster: "ap2",
      encrypted: true,
      authEndpoint: "https://catalogueyanew.com.awu.zxu.temporary.site/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });

    const channelName = `private-company.${companyId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("message.sent", (data) => {
      console.log("📨 Global Pusher Event:", data);

      // Pass event strictly to children who need it
      setLastMessageEvent(data);

      // If Messages tab is NOT active, we must increment the count ourselves
      if (activeTab !== "Messages") {
        setUnreadCounts(prev => ({ ...prev, messages: prev.messages + 1 }));
        // Optional: Play sound or toast
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [companyId, activeTab]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* 🔒 LOCK VIEWPORT */}
      <div className="relative flex w-full h-[calc(100vh-64px)]  overflow-hidden bg-gray-100 ">
        {/* ================= Sidebar ================= */}
<aside
          className={`
            ${isMobile ? "fixed inset-y-0 left-0 z-40" : "relative"}
            bg-white
            transform transition-transform duration-300 ease-out
          ${isMobile
  ? sidebarOpen
    ? "translate-x-0"
    : "-translate-x-full"
  : "translate-x-0"
}
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
            companyInfo={companyInfo}
            unreadCounts={unreadCounts}
            setTargetConversationId={setTargetConversationId}
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
    {isMobile && !sidebarOpen && !isChatOpen && (
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
        <main className="flex-1 flex flex-col overflow-y-auto ">
          {/* Fixed header / cover */}
        {activeTab === "Products" && (
  <Cover companyInfo={companyInfo} setActiveTab={setActiveTab} />
)}

          {/* 🔥 ONLY SCROLL AREA - Conditional for Messages */}
          <div >
            <div className={`max-w-[1600px] mx-auto ${activeTab === "Messages" ? "h-full" : "space-y-6"}`}>
              {activeTab === "Products" && (
                <Products
                  products={products}
                  setProducts={setProducts}
                  editingProduct={editingProduct}
                  setEditingProduct={setEditingProduct}
                  companyId={companyId}
                  companyInfo={companyInfo}
                />
              )}

              {activeTab === "Product Highlights" && (
                <Sales
                  companyId={companyId}
                  companyInfo={companyInfo}
                  user={user}
                  setActiveTab={setActiveTab}
                  setTargetConversationId={setTargetConversationId}
                />
              )}
              {activeTab === "Analytics" && <Analytics companyId={companyId} companyInfo={companyInfo} />}
              {activeTab === "Contacts" && <Contacts companyId={companyId} />}
              {activeTab === "Messages" && (
  <Messages
    companyId={companyId}
    companyInfo={companyInfo}
    lastMessageEvent={lastMessageEvent}
    onUnreadChange={(count) =>
      setUnreadCounts(prev => ({ ...prev, messages: count }))
    }
    targetConversationId={targetConversationId}
    setTargetConversationId={setTargetConversationId}
    onChatOpen={setIsChatOpen}   
  />
)}
              {activeTab === "Followers" && <Followers companyId={companyId} />}
              {activeTab === "Notifications" && (
                <Notifications
                  setActiveTab={setActiveTab}
                  setTargetConversationId={setTargetConversationId}
                />
              )}
              {activeTab === "Reviews" && <DashboardReviews companyId={companyId} />}
              {activeTab === "Bills" && (
                <Bills
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
        </main>
      </div>
    </>
  );
}
