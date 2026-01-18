import React, { useState, useEffect, useMemo } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
  FaEnvelopeOpenText
} from "react-icons/fa";
import { getCustomerNotifications, markNotificationRead, markAllNotificationsRead } from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  /* -----------------------------------------------------
      FETCH DATA
  -------------------------------------------------------*/
  const fetchNotifications = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getCustomerNotifications(pageNumber);

      console.log("🔔 Notifications API Response:", res.data);

      const data = res.data?.data || [];
      const meta = res.data; // Top level has pagination info like last_page

      if (pageNumber === 1) {
        setNotifications(data);
      } else {
        setNotifications(prev => [...prev, ...data]);
      }

      // Check if more pages exist
      setHasMore(meta.current_page < meta.last_page);

    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* -----------------------------------------------------
      Derived value (memoized)
  -------------------------------------------------------*/
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read_at).length,
    [notifications]
  );

  /* -----------------------------------------------------
      Handlers
  -------------------------------------------------------*/
  const markAsRead = async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );

    try {
      await markNotificationRead(id);
      console.log("✅ Mark read success:", id);
      // Refresh count in sidebar? Typically requires context or event.
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      console.error("❌ Failed to mark read:", err);
      // Revert if needed, but usually fine to ignore
    }
  };

  const markAllAsRead = async () => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );

    try {
      await markAllNotificationsRead();
      console.log("✅ Mark ALL read success");
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (err) {
      console.error("❌ Failed to mark all read:", err);
    }
  };

  const clearAll = () => {
    // User requested "single read" and "all read". 
    // Usually "Clear" implies delete, but we don't have DELETE endpoint.
    // For now, we will just clear LOCAL view.
    // Or we could trigger "Mark All Read" + Empty List?
    // Let's just empty the list locally.
    setNotifications([]);
  };

  /* -----------------------------------------------------
      Helpers
  -------------------------------------------------------*/
  const getIcon = (type) => {
    switch (type) {
      case "message":
        return <FaEnvelopeOpenText className="text-blue-500" />;
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "error":
        return <FaTimes className="text-red-500" />;
      default:
        // Default based on title analysis if type is missing?
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getStyle = (isRead) => {
    const base = "p-4 rounded-xl border-l-4 transition-all duration-200 min-w-0";
    // Check if read_at is not null
    const readStyle = isRead ? "bg-gray-50/50 border-l-gray-300" : "bg-white shadow-lg border-l-blue-500";
    return `${base} ${readStyle}`;
  };

  /* -----------------------------------------------------
      JSX
  -------------------------------------------------------*/
  if (loading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50/30 p-1 sm:p-2 overflow-x-hidden">
      <div className="max-w-4xl mx-auto min-w-0">

        {/* HEADER */}
        <div className="flex flex-row items-center  justify-between gap-2 mb-8 min-w-0">
          <div className="flex gap-2 sm:gap-4 items-center min-w-0 overflow-hidden">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Notifications
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""
                  }`
                  : "All caught up!"}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="
                  bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg 
                  shadow-blue-400/30 whitespace-nowrap
                "
              >
                <div className="flex items-center gap-1">
                  <FaCheck className="text-xs" /> Read All
                </div>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="
                  bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 
                  rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg 
                  shadow-red-400/30 whitespace-nowrap
                "
              >
                <div className="flex items-center gap-1">
                  <FaTrash className="text-xs" /> Clear View
                </div>
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="space-y-4 min-w-0">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <FaBell className="text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                No notifications
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                You're all caught up! Check back later.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              // Extract data safely
              const isRead = !!n.read_at;
              const title = n.notification?.title || "Notification";
              const body = n.notification?.body || "";
              const type = n.data?.type || "info";
              const time = n.created_at ? new Date(n.created_at).toLocaleString() : "";

              return (
                <div key={n.id || Math.random()} className={getStyle(isRead)}>
                  <div className="flex gap-3 sm:gap-4 items-start min-w-0">

                    {/* ICON */}
                    <div className="flex-shrink-0 mt-1">{getIcon(type)}</div>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 min-w-0">
                        <div className="min-w-0">
                          <h3
                            className={`font-semibold text-sm sm:text-base truncate ${isRead ? "text-gray-700" : "text-gray-900"
                              }`}
                          >
                            {title}
                          </h3>
                          <p
                            className={`text-xs sm:text-sm mt-1 break-words ${isRead ? "text-gray-600" : "text-gray-700"
                              }`}
                          >
                            {body}
                          </p>
                          {n.data?.message && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              "{n.data.message}"
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-2">
                            {time}
                          </p>
                        </div>

                        {/* ACTION ICONS */}
                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          {!isRead && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="p-1 sm:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg"
                              title="Mark as read"
                            >
                              <FaCheck className="text-xs sm:text-sm" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UNREAD DOT */}
                  {!isRead && <div className="w-2 h-2 bg-blue-500 rounded-full mt-3" />}
                </div>
              );
            })
          )}
        </div>

        {/* LOAD MORE */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchNotifications(page + 1)}
              disabled={loading}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
