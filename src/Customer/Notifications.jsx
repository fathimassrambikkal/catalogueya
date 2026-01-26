import React, { useEffect, useMemo, useState } from "react";
import Pusher from "pusher-js";
import { getCustomerNotifications } from "../api";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { log, warn, error } from "../utils/logger";

// FALLBACK IMAGE
const FALLBACK_IMAGE = "/images/product-placeholder.png";


function normalizeNotification(raw, index = 0) {
  if (!raw) return null;

  const title = raw.notification?.title ?? "Notification";
  const body = raw.notification?.body ?? "";
  const data = raw.data ?? {};

  const type =
    data.product_type === "low_stock"
      ? "lowStock"
      : data.product_type === "product"
      ? "promotions"
      : data.type || "main";

  return {
    id: raw.id || `${type}-${index}`,
    name: title,
    preview: body,
    unread: 1,
    type,
    data,
    title,
    body,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: data.items || [],
    order_id: data.order_id,
    product_type: data.product_type,
  };
}

export default function Notifications() {
  const [activeView, setActiveView] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const loadMoreRef = useRef(null);

  // Initialize with empty state immediately
  useEffect(() => {
    // Show empty state immediately
    setNotifications([]);
    
    // Start fetching in background
    const fetchInitialData = async () => {
      try {
        setIsFetching(true);
        const res = await getCustomerNotifications(1);
        
        const data = res.data?.data || [];
        const totalPages = res.data?.last_page || 1;
        const currentPage = res.data?.current_page || 1;
        
        setHasMore(currentPage < totalPages);
        
        const normalized = data.map((n, i) =>
          normalizeNotification(n, i)
        );

        setNotifications(normalized);
      } catch (err) {
        error("Notifications: initial fetch failed", err);
        setHasMore(false);
      } finally {
        setIsFetching(false);
      }
    };

    fetchInitialData();
  }, []);

  // Get user data from localStorage - memoized
  const { token, userId, channelName } = useMemo(() => {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    let user = null;
    
    try {
      user = userRaw ? JSON.parse(userRaw) : null;
    } catch {}
    
    const userId = user?.id;
    const userType = (user?.type || "User").toLowerCase();
    const channelName = userId ? `private-${userType}.${userId}` : null;
    
    return { token, userId, channelName };
  }, []);

  // Filter notifications based on active view
  const filteredNotifications = useMemo(() => {
    if (activeView === "all") return notifications;
    return notifications.filter(n => n.type === activeView);
  }, [notifications, activeView]);

  // Count notifications by type
  const notificationCounts = useMemo(() => ({
    all: notifications.length,
    lowStock: notifications.filter(n => n.type === "lowStock").length,
    promotions: notifications.filter(n => n.type === "promotions").length,
    order: notifications.filter(n => n.type === "order").length,
    main: notifications.filter(n => n.type === "main").length,
  }), [notifications]);

  // Load more notifications
  const loadMoreNotifications = async () => {
    if (isFetching || !hasMore) return;
    
    try {
      setIsFetching(true);
      const nextPage = page + 1;
      const res = await getCustomerNotifications(nextPage);
      
      const data = res.data?.data || [];
      const totalPages = res.data?.last_page || 1;
      const currentPage = res.data?.current_page || 1;
      
      setHasMore(currentPage < totalPages);
      
      const normalized = data.map((n, i) =>
        normalizeNotification(n, i + (nextPage - 1) * 20)
      );

      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = normalized.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNew];
      });
      
      setPage(nextPage);
    } catch (err) {
      error("Notifications: load more failed", err);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) {
          loadMoreNotifications();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [hasMore, isFetching]);

  // Pusher real-time updates - non-blocking
  useEffect(() => {
    if (!token || !channelName) return;

    const pusher = new Pusher("a613271cbafcf4059d6b", {
      cluster: "ap2",
      authEndpoint: "https://catalogueyanew.com.awu.zxu.temporary.site/broadcasting/auth",
      auth: { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
      enabledTransports: ["ws", "wss"],
      forceTLS: true,
    });

    const channel = pusher.subscribe(channelName);
channel.bind("dashboard.notification", (payload) => {
  log("Notifications: realtime payload received", payload);

  const normalized = normalizeNotification(payload, Date.now());
  if (!normalized) {
    warn("Notifications: invalid realtime payload", payload);
    return;
  }

      // Optimistic UI update
      setNotifications(prev => {
        const exists = prev.some(x => x.id === normalized.id);
        return exists ? prev : [normalized, ...prev];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [token, channelName]);

  // Image URL builder
 const getImageUrl = (imgPath) => {
  if (!imgPath) return FALLBACK_IMAGE;

  // already full URL
  if (imgPath.startsWith("http")) return imgPath;

  const clean = imgPath.replace(/^\/+/, "");

  // if already contains products/
  if (clean.startsWith("products/")) {
    return `https://catalogueyanew.com.awu.zxu.temporary.site/${clean}`;
  }

  return `https://catalogueyanew.com.awu.zxu.temporary.site/products/${clean}`;
};



  // Render product items with badge on image
  const renderProductItems = (items) => {
    if (!items || items.length === 0) return null;

    const getBadgeStyles = (badge = "") => {
      const text = badge.toLowerCase();

      if (text.includes("new")) return "bg-blue-600 text-white";
      if (text.includes("low")) return "bg-orange-500 text-white";
      if (text.includes("sale") || text.includes("offer")) return "bg-red-600 text-white";

      return "bg-gray-600 text-white";
    };

    return (
      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
        {items.map((item, idx) => {
          const imageUrl = getImageUrl(item.image);
          
          return (
            <div 
              key={`${item.product_id || idx}-${Date.now()}`}
              className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50/50 rounded-lg sm:rounded-xl border border-gray-200/50"
            >
              {/* Product Image Container */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-white border border-gray-200">
                {/* BADGE (ONLY ONE, NO SVG) */}
                {(item.discount_percent || item.badge) && (
                  <div className="absolute top-0 left-0 z-10">
                    <span
                      className={`
                        ${item.discount_percent
                          ? "bg-green-600 text-white"
                          : getBadgeStyles(item.badge)
                        }
                        text-[9px] sm:text-[10px]
                        font-bold uppercase
                        px-2 py-0.5
                        rounded-br-lg
                        shadow-md
                      `}
                    >
                      {item.discount_percent
                        ? `${item.discount_percent}% OFF`
                        : item.badge}
                    </span>
                  </div>
                )}

                {/* PRODUCT IMAGE */}
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
                      {item.name}
                    </h4>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right mt-1 sm:mt-0">
                    <div className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                      {item.currency || "QAR"} {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </div>
                    {item.old_price && (
                      <div className="text-[10px] sm:text-xs text-gray-500 line-through">
                        {item.currency || "QAR"} {typeof item.old_price === 'number' ? item.old_price.toFixed(2) : item.old_price}
                      </div>
                    )}
                  </div>
                </div>

                {/* View Product Link */}
                {item.product_id && (
                  <div className="mt-2 sm:mt-3">
                    <Link
                      to={`/product/${item.product_id}`}
                      className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Mark as read with optimistic update
  const handleMarkAsRead = () => {
    // Optimistic update - immediately update UI
    setNotifications(prev => prev.map(x => ({ ...x, unread: 0 })));
    
    // No need for API call - we're just changing UI state
  };

  // Handle notification click with optimistic update
  const handleNotificationClick = (notificationId) => {
    setNotifications(prev =>
      prev.map(x => x.id === notificationId ? { ...x, unread: 0 } : x)
    );
  };

  return (
    <div className="min-h-full ">
      {/* Header */}
      <div className="top-0 z-10 backdrop-blur-md border-b border-gray-200/50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col gap-3 sm:gap-4 mt-10">
            <div className="relative mt-10 flex items-center justify-center">
              {/* Center title */}
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                Notifications
              </h1>

              {/* Right-aligned action */}
              <button
                onClick={handleMarkAsRead}
                className="absolute right-0 px-3 py-1.5 sm:px-4 sm:py-2
                         text-xs sm:text-sm font-medium text-gray-600
                         hover:text-gray-900 hover:bg-gray-100
                         rounded-xl transition-colors whitespace-nowrap"
              >
                Mark all as read
              </button>
            </div>
          </div>

          {/* Filter Tabs - Responsive (NO horizontal scroll) */}
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
            {[
              { key: "all", label: "All", count: notificationCounts.all },
              { key: "lowStock", label: "Low Stock", count: notificationCounts.lowStock },
              { key: "promotions", label: "Promotions", count: notificationCounts.promotions },
              { key: "order", label: "Orders", count: notificationCounts.order },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`
                  inline-flex items-center gap-1 sm:gap-2
                  px-3 py-2 sm:px-4 sm:py-2.5
                  rounded-xl sm:rounded-2xl
                  text-xs sm:text-sm font-medium
                  transition-all duration-200
                  ${activeView === tab.key
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }
                `}
              >
                <span>{tab.label}</span>

                {tab.count > 0 && (
                  <span
                    className={`
                      px-1.5 py-0.5 sm:px-2 sm:py-1
                      rounded-full text-[10px] sm:text-xs font-bold
                      ${activeView === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List - Always visible */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
              {isFetching ? "Loading notifications..." : "No notifications"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-md mx-auto">
              {activeView === "all"
                ? isFetching ? "Fetching your notifications..." : "You're all caught up! Check back later for updates."
                : isFetching ? "Loading..." : `No ${activeView} notifications available.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`
                    group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 cursor-pointer
                    transition-all duration-200 hover:shadow-md
                    ${notification.unread > 0
                      ? "bg-gradient-to-r from-blue-50/60 via-white to-blue-50/40 border-2 border-blue-200/40"
                      : "bg-white/80 border border-gray-200/40 backdrop-blur-sm"
                    }
                  `}
                >
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-0.5 line-clamp-1">
                            {notification.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {notification.body}
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap mt-0.5 sm:mt-0">
                          {notification.timestamp}
                        </div>
                      </div>

                      {/* Product Items */}
                      {notification.items.length > 0 && renderProductItems(notification.items)}

                      {/* Order Notification */}
                      {notification.order_id && (
                        <div className="mt-3 sm:mt-4 p-2 sm:p-3 md:p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-200/30">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 md:gap-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="min-w-0">
                                <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                                  Order #{notification.order_id}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                  Your order has been processed successfully
                                </p>
                              </div>
                            </div>
                            <Link
                              to={`/orders/${notification.order_id}`}
                              className="mt-2 sm:mt-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Order
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Sentinel */}
            {hasMore && (
              <div 
                ref={loadMoreRef} 
                className="h-10 sm:h-12"
                aria-label="Load more notifications"
              />
            )}

            {/* Loading indicator for infinite scroll */}
            {isFetching && notifications.length > 0 && (
              <div className="mt-4 sm:mt-5 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/50 border border-gray-200/50">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Loading more...
                  </span>
                </div>
              </div>
            )}

            {/* End of List Message */}
            {!hasMore && filteredNotifications.length > 0 && (
              <div className="text-center py-5 sm:py-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/50 border border-gray-200/50">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    You've reached the end
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}