import React, { useState, useEffect, useMemo } from "react";

import { useFixedWords } from "../hooks/useFixedWords";
import { FaUserFriends, FaEye } from "./SvgIcons";

import { useNavigate } from "react-router-dom";

import {
  getCompanySentNotifications,
  getSentNotificationDetails,
  getImageUrl,
  addContact,
  getContacts
} from "../companyDashboardApi";
import { toast } from "react-hot-toast";


const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Notifications({ setActiveTab: setParentActiveTab, setTargetConversationId, initialTab }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab || "all");
  const [expandedCards, setExpandedCards] = useState({});
  const [viewedUsers, setViewedUsers] = useState({});
  const [contacts, setContacts] = useState([]);
  const [companyDetails, setCompanyDetails] = useState(null);
  const navigate = useNavigate();
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};


const isRTL = document?.dir === "rtl";
const TABS = useMemo(() => [
  { id: "all", label: fw.all || "All" },
  { id: "limited_edition", label: fw.limited_edition || "Limited Edition" },
  { id: "best_seller", label: fw.best_seller || "Best Seller" },
  { id: "new_arrivals", label: fw.new_arrivals || "New Arrivals" },
  { id: "sales", label: fw.sales || "Sales" },
  { id: "back_in_stock", label: fw.back_in_stock || "Back in Stock" },
], [fw]);

  useEffect(() => {
    const savedCompany = localStorage.getItem("company_details");
    if (savedCompany) setCompanyDetails(JSON.parse(savedCompany));
    fetchNotifications();
    fetchContacts();
  }, []);

  const fetchNotifications = async (p = 1) => {
    try {
      setLoading(true);
      const res = await getCompanySentNotifications(p);
      const data = res.data?.data?.data || [];
      setNotifications(data);

      data.forEach(n => {
        fetchViewDetails(n.batch_id);
      });
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data?.data || res.data || []);
    } catch (e) {
      console.error("Failed to fetch contacts", e);
    }
  };

  const handleExpandAction = async (batchId, type) => {
    if (type === 'message') {
      const loadingToast = toast.loading(
  fw.opening_conversation || "Opening conversation..."
);
      try {
        const res = await getSentNotificationDetails(batchId);
        const conversationId = res.data?.notification?.data?.conversationId;
        if (conversationId) {
          toast.dismiss(loadingToast);
          setTargetConversationId(conversationId);
          setParentActiveTab("Messages");
          return;
        }
        toast.error(
  fw.conversation_not_found || "Conversation not found"
);
      } catch (e) {
        toast.error(
  fw.failed_open_message || "Failed to open message"
);
      } finally {
        toast.dismiss(loadingToast);
      }
      return;
    }

    const isExpanding = !expandedCards[batchId];
    setExpandedCards(prev => ({ ...prev, [batchId]: isExpanding }));

    if (isExpanding && !viewedUsers[batchId]) {
      fetchViewDetails(batchId);
    }
  };

  const fetchViewDetails = async (batchId) => {
    if (viewedUsers[batchId]?.loading || (viewedUsers[batchId]?.users && viewedUsers[batchId]?.users.length > 0)) return;

    try {
      setViewedUsers(prev => ({ ...prev, [batchId]: { ...prev[batchId], loading: true } }));
      const res = await getSentNotificationDetails(batchId);
      const details = res.data;
      setViewedUsers(prev => ({
        ...prev,
        [batchId]: {
          users: details.viewed_recipients?.data || [],
          products: details.notification?.data?.items || [],
          counts: details.counts || {},
          loading: false
        }
      }));
    } catch (error) {
      console.error("Error fetching notification details", error);
      setViewedUsers(prev => ({ ...prev, [batchId]: { ...prev[batchId], loading: false } }));
    }
  };

  const handleAddContact = async (userId) => {
    try {
      await addContact(userId);
      toast.success(
  fw.added_to_contacts || "Added to contacts"
);
      fetchContacts();
    } catch (e) {
      toast.error(
  fw.failed_add_contact || "Failed to add contact"
);
    }
  };

  const isUserInContacts = (userId) => {
    return contacts.some(c => String(c.contact_user_id) === String(userId) || String(c.id) === String(userId));
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    const tabMap = {
      limited_edition: "limited_stocks",
      best_seller: "best_seller",
      low_in_stock: "low_in_stock",
      out_of_stock: "out_of_stock",
      new_arrivals: "new_arrivals",
      sales: "sales"
    };
    const targetType = tabMap[activeTab] || activeTab;
    return notifications.filter(n => n.type === targetType);
  }, [notifications, activeTab]);



  return (
    <div className="h-full overflow-hidden bg-white flex flex-col ">
      <div className="p-4 sm:p-5 lg:p-6 flex-shrink-0 mt-24 md:mt-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header - Minimal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">{fw.notifications || "Notifications"}</h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{fw.history || "Track your sent alerts"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-xs font-medium text-gray-600">{notifications.length}{fw.total || "total"}</span>
              </div>
              <button className="text-xs font-medium text-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
               {fw.mark_all_read || "Mark all read"}
              </button>
            </div>
          </div>

          {/* Tabs - Pill Style */}
          <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-gray-100 inline-flex flex-wrap gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg transition-all text-xs font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === "all" && notifications.length > 0 && (
                  <span className={`text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-medium ${
                    activeTab === tab.id ? "bg-white text-blue-500" : "bg-gray-200 text-gray-600"
                  }`}>
                    {notifications.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 no-scrollbar">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 gap-3">
            {filteredNotifications.map((n, idx) => (
              <div
                key={n.batch_id}
                className="animate-fadeIn relative z-10 hover:z-[100]"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <NotificationCard
                  notification={n}
                  details={viewedUsers[n.batch_id]}
                  isExpanded={!!expandedCards[n.batch_id]}
                  onExpandAction={() => handleExpandAction(n.batch_id, n.type)}
                  onAddContact={handleAddContact}
                  isUserInContacts={isUserInContacts}
                  companyDetails={companyDetails}
                  navigate={navigate}
                   isRTL={isRTL}
                />
              </div>
            ))}

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl py-16 sm:py-20 text-center border border-dashed border-gray-200 animate-fadeIn">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  
                </div>
                <h3 className="text-sm font-medium text-gray-900">{fw.no_notifications || "No notifications"}</h3>
                <p className="text-xs text-gray-400 mt-1">{fw.no_products_found || "Nothing to show"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function NotificationCard({
  notification,
  details,
  isExpanded,
  onExpandAction,
  onAddContact,
  isUserInContacts,
  companyDetails,
  navigate,
   isRTL
}) {
  const [showUsersSheet, setShowUsersSheet] = useState(false);
  const isMessage = notification.type === 'message';

  const viewCount = details?.counts?.view_count ?? notification.view_count ?? 0;
  const sentCount = details?.counts?.recipients_count ?? notification.recipients_count ?? 0;

  const recipient = details?.users?.[0];
  const entityImage = isMessage ? recipient?.image : (companyDetails?.logo || companyDetails?.image);
  const entityName = isMessage ? (recipient?.name || "User") : (companyDetails?.name || "Company");
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};
const CATEGORY_LABELS = {
  sales: fw.sales || "Sales",

  new_arrivals: fw.new_arrivals || "New Arrivals",

  best_seller: fw.best_seller || "Best Seller",
  best_sellers: fw.best_seller || "Best Seller",

  limited_stocks: fw.limited_edition || "Limited Edition",

  back_in_stock: fw.back_in_stock || "Back in Stock",
  back_in_stocks: fw.back_in_stock || "Back in Stock",

  low_in_stock: fw.low_in_stock || "Low in Stock",
  low_in_stocks: fw.low_in_stock || "Low in Stock"
};
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'shadow-sm ring-1 ring-blue-500/20' : 'hover:border-gray-200'
    }`}>
      <div className="p-4 sm:p-5">
        {/* Main Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
          {/* Avatar + Info */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
              <img
                src={getImageUrl(entityImage)}
                alt={entityName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entityName)}&background=f0f0f0&color=666&size=40`; }}
              />
            </div>
            <div className="flex-1  w-full min-w-0">
              <h3 className="font-medium text-sm text-gray-900 truncate">{entityName}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                {CATEGORY_LABELS[notification.category] || notification.category?.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-gray-50/80 rounded-lg p-4  w-full">
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 pr-8">
  {notification.type === "message"
    ? (fw.new_message_received || "You have received a new message")
    : notification.body}
</p>

              <div className="flex items-center justify-between mt-3">
                {!isMessage ? (
                  <button
                    onClick={onExpandAction}
                    className="flex items-center gap-1.5 text-blue-500 text-[10px] font-medium hover:text-blue-600 transition-colors"
                  >
                    <span>
                    {isExpanded 
                      ? (fw.hide || "Hide") 
                      : (fw.show_products || "Show products")}
                  </span>
                    <span className="text-[8px]">{isExpanded ? "▲" : "▼"}</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-300">{fw.message || "Message"}</span>
                )}
                <span className="text-[9px] text-gray-300">
                  {formatDate(notification.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className={`flex flex-row lg:flex-col items-center justify-end gap-4 lg:w-40 ${isRTL ? "lg:border-r lg:pr-5" : "lg:border-l lg:pl-5"} border-gray-100`}>
            {isMessage ? (
              <button
                onClick={onExpandAction}
                className="text-xs font-medium text-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                
                {fw.view || "View"} {isRTL ? "←" : "→"}
              </button>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {/* Sent */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaUserFriends className="w-3.5 h-3.5 text-blue-500" />

                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-900">{sentCount}</span>
                      <p className="text-[8px] text-gray-300 uppercase tracking-wider">{fw.sent || "Sent"}</p>
                    </div>
                  </div>

                  {/* Views with Hover */}
                  <div className="relative">
                    <div
                      onMouseEnter={() => setShowUsersSheet(true)}
                      onMouseLeave={() => setShowUsersSheet(false)}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                       <FaEye className="w-3.5 h-3.5 text-blue-500" />

                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-900">{viewCount}</span>
                        <p className="text-[8px] text-gray-300 uppercase tracking-wider">{fw.views || "Views"}</p>
                      </div>
                    </div>

                    {/* Users Tooltip */}
                    {showUsersSheet && (
                      <div
  onMouseEnter={() => setShowUsersSheet(true)}
  onMouseLeave={() => setShowUsersSheet(false)}
  className={`absolute z-[999] ${isRTL ? "left-0" : "right-0"} top-full mt-3 
  w-[clamp(220px,25vw,320px)] max-h-[clamp(200px,35vh,350px)] 
  bg-white rounded-xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.3)] 
  border border-gray-100 overflow-hidden flex flex-col`}
  style={{
    animation: "fadeIn 0.2s ease-out forwards",
    transformOrigin: isRTL ? "top left" : "top right"
  }}
>
                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                          <h4 className="text-xs font-medium text-gray-900">
                          {fw.viewed_by || "Viewed by"}
                        </h4>
                          <span className="text-[8px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                            {viewCount}
                          </span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 no-scrollbar">
                          {details?.loading ? (
                            <div className="text-center py-8">
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                          ) : details?.users?.length > 0 ? (
                            details.users.map((user, uidx) => (
                              <div key={user.id || uidx} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                  <img
                                    src={getImageUrl(user.image)}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=24`; }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">{user.name}</p>
                                  <p className="text-[8px] text-gray-400">{user.read_at ? (fw.read || "Read") : (fw.viewed || "Viewed")}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isUserInContacts(user.id)) onAddContact(user.id);
                                  }}
                                  className={`p-1 rounded-md transition-colors text-[10px] ${
                                    isUserInContacts(user.id)
                                      ? "text-green-500"
                                      : "text-blue-500 hover:bg-blue-50"
                                  }`}
                                >
                                  {isUserInContacts(user.id) ? "✓" : "+"}
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-xs text-gray-300">{fw.no_viewers || "No viewers yet"}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Expanded Products Section */}
        {isExpanded && !isMessage && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-slideDown">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-gray-900 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                {fw.linked_products || "Linked Products"}
              </h4>
              <p className="text-[9px] text-gray-300">{details?.products?.length || 0} {fw.items || "items"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
              {details?.loading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                details?.products?.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/product/${p.product_id}`)}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 cursor-pointer transition-all hover:shadow-sm animate-fadeIn"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-gray-900 truncate mb-0.5">
  {isRTL
    ? (p.name_ar || p.name)
    : (p.name || p.name_ar)}
</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-500">{fw.qar || "QAR"} {p.price}</span>
                        <span className="text-[8px] text-gray-300">
  {isRTL ? "←" : "→"}
</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style >{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 

