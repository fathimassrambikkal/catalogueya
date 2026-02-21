import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { log, warn, error } from "../utils/logger";
import Pusher from "pusher-js";
import { UnmuteIcon, MuteIcon, ReadAllIcon } from "./Svgicons";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingRead, setMarkingRead] = useState(false);
  const notificationsRef = useRef(null);
  const [showUnmuteModal, setShowUnmuteModal] = useState(false);
  const [showReadAllModal, setShowReadAllModal] = useState(false);

  const token = localStorage.getItem("token") || "";
  const channelName = useMemo(() => {
    const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
    return userId ? `private-user.${userId}` : "";
  }, []);

  const categories = [
    { id: "all", name: "All" },
    { id: "message", name: "Messages" },
    { id: "best_sellers", name: "Best Sellers" },
    { id: "limited_stocks", name: "Low Stock" },
    { id: "on_sales", name: "On Sale" },
    { id: "out_of_stock", name: "Out of Stock" },
    { id: "others", name: "Others" },
  ];

  const normalizeNotification = (notification, timestamp, category) => {
    try {
      const notificationData = notification.data || {};
      const notificationInfo = notification.notification || {};
      const payloadData = notification.data || notification;
      const payloadNotification = notification.notification || {};

      const finalData =
        Object.keys(notificationData).length > 0 ? notificationData : payloadData;
      const finalInfo =
        Object.keys(notificationInfo).length > 0
          ? notificationInfo
          : payloadNotification;

      const items = finalData?.items || [];
      const sender = finalData?.sender || {};

      return {
        id: `${category}_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
        title: finalInfo.title || "New Notification",
        body: finalInfo.body || "You have a new update",
        category: category,
        type: finalData?.type || "notification",
        timestamp: new Date(timestamp).toISOString(),
        read: false,
        data: {
          items: Array.isArray(items)
            ? items.map((item) => ({
                ...item,
                image: (() => {
                  if (typeof item?.image !== "string") return item?.image;
                  try {
                    return JSON.parse(item.image);
                  } catch {
                    return item.image;
                  }
                })(),
              }))
            : [],
          sender: sender,
          senderId: finalData?.senderId,
          messageId: finalData?.messageId,
          conversationId: finalData?.conversationId,
          senderType: finalData?.senderType,
          category: finalData?.category,
        },
        link: generateNotificationLink(finalData, category),
      };
    } catch (err) {
      error("Error normalizing notification:", err, notification);
      return null;
    }
  };

  const generateNotificationLink = (data, category) => {
    const companyId =
      data?.sender?.id || data?.senderId || data?.company_id || null;

    if (category === "message") {
      return data?.conversationId
        ? `/customer-login/chat/${data.conversationId}`
        : "/customer-login/messages";
    }

    if (
      [
        "limited_stocks",
        "best_sellers",
        "low_in_stock",
        "on_sales",
        "out_of_stock",
      ].includes(category) &&
      companyId
    ) {
      return `/company/products/${category}/${companyId}`;
    }

    return "/";
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setErrorState(null);

      const response = await fetch(
        "https://catalogueyanew.com.awu.zxu.temporary.site/en/api/customer/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      log("Notifications API response:", result);

      const allNotifications = [];

      Object.keys(result.data || {}).forEach((category) => {
        const categoryNotifications = result.data[category] || [];
        categoryNotifications.forEach((notification) => {
          const normalized = normalizeNotification(notification, Date.now(), category);
          if (normalized) allNotifications.push(normalized);
        });
      });

      allNotifications.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setNotifications(allNotifications);
      updateUnreadCount(allNotifications);
    } catch (err) {
      error("Error fetching notifications:", err);
      setErrorState("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setMarkingRead(true);
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        updateUnreadCount(updated);
        return updated;
      });
    } catch (err) {
      error("Error marking notification as read:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setMarkingRead(true);
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, read: true }));
        updateUnreadCount(updated);
        return updated;
      });
    } catch (err) {
      error("Error marking all notifications as read:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  const updateUnreadCount = (notificationsList) => {
    const count = notificationsList.filter((n) => !n.read).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(
        notifications.filter((notif) => notif.category === selectedCategory)
      );
    }
  }, [notifications, selectedCategory]);

  useEffect(() => {
    if (!token || !channelName) return;

    const pusher = new Pusher("a613271cbafcf4059d6b", {
      cluster: "ap2",
      authEndpoint:
        "https://catalogueyanew.com.awu.zxu.temporary.site/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
      enabledTransports: ["ws", "wss"],
      forceTLS: true,
    });

    const channel = pusher.subscribe(channelName);

    channel.bind("dashboard.notification", (payload) => {
      log("Notifications: realtime payload received", payload);
      const category = payload.category || payload.data?.category || "others";
      const normalized = normalizeNotification(payload, Date.now(), category);
      if (!normalized) {
        warn("Notifications: invalid realtime payload", payload);
        return;
      }
      setNotifications((prev) => {
        const exists = prev.some((x) => x.id === normalized.id);
        if (exists) return prev;
        const updated = [normalized, ...prev];
        updateUnreadCount(updated);
        return updated;
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [token, channelName]);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getLogoUrl = (logo) => {
    if (!logo) return null;
    if (typeof logo === "string") {
      if (logo.startsWith("companies/logo/")) {
        return `https://catalogueyanew.com.awu.zxu.temporary.site/${logo}`;
      }
      return logo;
    }
    if (typeof logo === "object") {
      const baseUrl = "https://catalogueyanew.com.awu.zxu.temporary.site/";
      if (logo.webp) return baseUrl + logo.webp;
      if (logo.avif) return baseUrl + logo.avif;
      if (logo.png || logo.jpg || logo.jpeg) return baseUrl + (logo.png || logo.jpg || logo.jpeg);
    }
    return null;
  };

  // 🧊 BLUE GLASS MODAL
  const GlassModal = ({ show, onClose, title, description, onConfirm, confirmText = "Confirm" }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl ">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
            {description && <p className="text-sm text-slate-600 mb-6">{description}</p>}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-xl bg-white/80 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 h-10 rounded-xl bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-sm bg-white  border border-white/50 rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-600 mb-6">Please log in to view your notifications.</p>
          <Link
            to="/login"
            className=" w-full h-11 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 🧊 GLASS CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 mt-28 md:mt-10">
        {/* HEADER – COMPACT & GLASS */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold  text-gray-900">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg shadow-blue-600/30">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
                {/* SECOND ROW: Actions (right aligned) */}
            <div className="flex justify-end">
              <div
                className="
                  flex items-center
                  gap-[clamp(0.25rem,1.5vw,0.5rem)]
                bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-lg shadow-blue-500/5
                  p-[clamp(0.25rem,1.5vw,0.5rem)]
                 
                "
              >
                {/* Unmute */}
                <button
                  onClick={() => setShowUnmuteModal(true)}
                  className="
                   items-center
                    gap-[clamp(0.25rem,1.2vw,0.5rem)]
                    px-[clamp(0.4rem,2vw,1rem)]
                    py-[clamp(0.35rem,1.5vw,0.5rem)]
                 flex  text-slate-600 hover:bg-blue-600/10 hover:text-blue-700 rounded-xl transition-all
                    min-w-0
                  "
                >
                  <UnmuteIcon className="w-[clamp(0.9rem,3vw,1.25rem)] h-[clamp(0.9rem,3vw,1.25rem)]" />
                  <span className="text-[clamp(0.65rem,2.4vw,0.875rem)] font-medium whitespace-nowrap">
                    Unmute
                  </span>
                </button>

                <div className="w-px h-[clamp(1rem,4vw,1.5rem)] bg-gray-200" />

                {/* Mute */}
                <button
                  className="
                    inline-flex items-center
                    gap-[clamp(0.25rem,1.2vw,0.5rem)]
                    px-[clamp(0.4rem,2vw,1rem)]
                    py-[clamp(0.35rem,1.5vw,0.5rem)]
                   text-slate-600 hover:bg-blue-600/10 hover:text-blue-700 rounded-xl transition-all
                    min-w-0
                  "
                >
                  <MuteIcon className="w-[clamp(0.9rem,3vw,1.25rem)] h-[clamp(0.9rem,3vw,1.25rem)]" />
                  <span className="text-[clamp(0.65rem,2.4vw,0.875rem)] font-medium whitespace-nowrap">
                    Mute
                  </span>
                </button>

                <div className="w-px h-[clamp(1rem,4vw,1.5rem)] bg-gray-200" />

                {/* Read all */}
                <button
                  onClick={() => setShowReadAllModal(true)}
                  className="
                    inline-flex items-center
                    gap-[clamp(0.25rem,1.2vw,0.5rem)]
                    px-[clamp(0.45rem,2.2vw,1rem)]
                    py-[clamp(0.35rem,1.5vw,0.5rem)]
                   bg-blue-600/90 backdrop-blur-sm text-white rounded-xl shadow-md shadow-blue-600/30 hover:bg-blue-700 transition-all
                    min-w-0
                  "
                >
                  <ReadAllIcon className="w-[clamp(0.9rem,3vw,1.25rem)] h-[clamp(0.9rem,3vw,1.25rem)]" />
                  <span className="text-[clamp(0.65rem,2.4vw,0.875rem)] font-medium whitespace-nowrap">
                    Read all
                  </span>
                </button>
              </div>
            </div> 
        </div>

        {/* CATEGORY FILTER – GLASS TABS */}
        <div className="mb-6 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-1 shadow-lg shadow-blue-500/5">
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? notifications.length
                  : notifications.filter((n) => n.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/90 backdrop-blur-sm text-white shadow-md shadow-blue-600/30"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  {cat.name}
                  {count > 0 && (
                    <span
                      className={`absolute -top-1 -right-1 text-[0.65rem] px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white text-blue-700"
                          : "bg-blue-100/80 text-blue-700"
                      }`}
                    >
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATIONS LIST – GLASS CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl shadow-blue-500/5 overflow-hidden">
          {errorState && (
            <div className="p-4 m-4 bg-red-50/80 backdrop-blur-sm border border-red-200/60 rounded-2xl flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-red-700"> {errorState}</span>
              <button
                onClick={fetchNotifications}
                className="text-xs font-medium text-red-700 bg-red-100/80 px-3 py-1.5 rounded-xl hover:bg-red-200/80 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-7 h-7 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-600">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-blue-100/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl text-blue-500/80">📭</span>
              </div>
              <h3 className="text-base font-medium text-slate-800 mb-1">All caught up!</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                {selectedCategory === "all"
                  ? "No new notifications at the moment."
                  : `No ${categories.find((c) => c.id === selectedCategory)?.name.toLowerCase()} notifications`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/60" ref={notificationsRef}>
              {filteredNotifications.map((notif) => {
                const logoUrl = getLogoUrl(notif.data.sender?.logo);
                return (
                  <div
                    key={notif.id}
                    className={`relative px-4 sm:px-5 py-4 transition-all hover:bg-blue-50/30 ${
                      !notif.read ? "bg-blue-50/40" : ""
                    }`}
                  >
                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
                    )}

                    <div className="flex gap-3">
                      {/* AVATAR - compact glass */}
                      {notif.data.sender?.name && (
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl flex items-center justify-center shadow-sm">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt=""
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML =
                                    '<span class="text-slate-400 text-xs"></span>';
                                }}
                              />
                            ) : (
                              <span className="text-slate-400 text-xs"></span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center flex-wrap gap-1.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-lg text-[0.65rem] font-medium capitalize ${
                                notif.category === "message"
                                  ? "bg-blue-100/70 text-blue-800"
                                  : notif.category === "best_sellers"
                                  ? "bg-green-100/70 text-green-800"
                                  : notif.category === "limited_stocks"
                                  ? "bg-amber-100/70 text-amber-800"
                                  : notif.category === "on_sales"
                                  ? "bg-red-100/70 text-red-800"
                                  : notif.category === "out_of_stock"
                                  ? "bg-slate-200/70 text-slate-800"
                                  : "bg-slate-100/70 text-slate-700"
                              }`}
                            >
                              {notif.category.replace("_", " ")}
                            </span>
                            {notif.data.sender?.name && (
                              <span className="text-[0.65rem] text-slate-500">
                                {notif.data.sender.name}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[0.65rem] text-slate-400">
                              {formatTime(notif.timestamp)}
                            </span>
                            <button
                              onClick={() =>
                                setNotifications((prev) =>
                                  prev.filter((n) => n.id !== notif.id)
                                )
                              }
                              className="text-slate-600 hover:text-slate-900 transition-colors bg-gray-100 rounded-full p-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <h4 className="text-sm font-medium text-slate-800 mb-1">
                          {notif.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {notif.body}
                        </p>

                        {/* PRODUCT IMAGES - minimal */}
                        {notif.data.items?.length > 0 && (
                          <div className="flex items-center gap-1.5 mb-3">
                            {notif.data.items.slice(0, 3).map((item, idx) => {
                              const imgSrc =
                                typeof item.image === "object"
                                  ? item.image.webp || item.image.avif || item.image.png || item.image.jpg
                                  : item.image;
                              return (
                                <div
                                  key={idx}
                                  className="w-8 h-8 bg-white/80 backdrop-blur-sm border border-white/40 rounded-lg overflow-hidden shadow-sm"
                                >
                                  {imgSrc ? (
                                    <img
                                      src={
                                        imgSrc.startsWith("http")
                                          ? imgSrc
                                          : `https://catalogueyanew.com.awu.zxu.temporary.site/${imgSrc}`
                                      }
                                      alt=""
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.parentElement.innerHTML =
                                          '<div class="w-full h-full flex items-center justify-center"><span class="text-slate-400 text-xs">📦</span></div>';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <span className="text-slate-400 text-xs">📦</span>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {notif.data.items.length > 3 && (
                              <span className="text-[0.65rem] text-slate-400">
                                +{notif.data.items.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* ACTIONS - clean */}
                        <div className="flex items-center justify-end gap-3">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              disabled={markingRead}
                              className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          <Link
                            to={notif.link}
                            className="text-xs font-medium text-blue-700 hover:text-blue-800 inline-flex items-center gap-0.5 transition-colors"
                          >
                            View More
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BLUE GLASS MODALS */}
      <GlassModal
        show={showReadAllModal}
        onClose={() => setShowReadAllModal(false)}
        onConfirm={() => {
          markAllAsRead();
          setShowReadAllModal(false);
        }}
        title="Read all notifications?"
        description="This will mark every notification as read. You can't undo this."
        confirmText="Read all"
      />

      <GlassModal
        show={showUnmuteModal}
        onClose={() => setShowUnmuteModal(false)}
        onConfirm={() => {
          // unmute logic
          setShowUnmuteModal(false);
        }}
        title="Unmute notifications?"
        description="You will start receiving push alerts again."
        confirmText="Unmute"
      />
    </div>
  );
};

export default Notifications;