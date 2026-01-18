import React, { useState, useMemo } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Follower",
      message: "John Doe started following your company",
      type: "info",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Product Update",
      message: "Your product 'Office Chair' has been updated successfully",
      type: "success",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Low Stock Alert",
      message: "Product 'Desk Lamp' is running low on stock",
      type: "warning",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from Sarah Johnson",
      type: "info",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 5,
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2:00 AM",
      type: "warning",
      time: "1 day ago",
      read: true,
    },
  ]);

  /* -----------------------------------------------------
      Derived value (memoized)
  -------------------------------------------------------*/
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  /* -----------------------------------------------------
      Handlers
  -------------------------------------------------------*/
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  /* -----------------------------------------------------
      Helpers
  -------------------------------------------------------*/
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "error":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getStyle = (type, read) => {
    const base = "p-4 rounded-xl border-l-4 transition-all duration-200 min-w-0";
    const readStyle = read ? "bg-gray-50/50" : "bg-white shadow-lg";

    switch (type) {
      case "success":
        return `${base} ${readStyle} border-l-green-500`;
      case "warning":
        return `${base} ${readStyle} border-l-yellow-500`;
      case "error":
        return `${base} ${readStyle} border-l-red-500`;
      default:
        return `${base} ${readStyle} border-l-blue-500`;
    }
  };

  /* -----------------------------------------------------
      JSX
  -------------------------------------------------------*/
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 overflow-x-hidden">
      <div className="max-w-4xl mx-auto min-w-0">
        
        {/* HEADER */}
        <div className="flex flex-row items-center justify-between gap-2 mb-8 min-w-0">
          <div className="flex gap-2 sm:gap-4 items-center min-w-0 overflow-hidden">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Notifications
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm truncate">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
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

            <button
              onClick={clearAll}
              className="
                bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 
                rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg 
                shadow-red-400/30 whitespace-nowrap
              "
            >
              <div className="flex items-center gap-1">
                <FaTrash className="text-xs" /> Clear
              </div>
            </button>
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
            notifications.map((n) => (
              <div key={n.id} className={getStyle(n.type, n.read)}>
                <div className="flex gap-3 sm:gap-4 items-start min-w-0">
                  
                  {/* ICON */}
                  <div className="flex-shrink-0 mt-1">{getIcon(n.type)}</div>

                  {/* TEXT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <h3
                          className={`font-semibold text-sm sm:text-base truncate ${
                            n.read ? "text-gray-700" : "text-gray-900"
                          }`}
                        >
                          {n.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm mt-1 break-words ${
                            n.read ? "text-gray-600" : "text-gray-700"
                          }`}
                        >
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {n.time}
                        </p>
                      </div>

                      {/* ACTION ICONS */}
                      <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="p-1 sm:p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg"
                          >
                            <FaCheck className="text-xs sm:text-sm" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="p-1 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FaTrash className="text-xs sm:text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* UNREAD DOT */}
                {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-3" />}
              </div>
            ))
          )}
        </div>

        {/* CLEAR ALL BOTTOM */}
        {notifications.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearAll}
              className="text-gray-500 hover:text-red-500 text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
