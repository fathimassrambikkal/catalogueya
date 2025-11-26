import React, { useState } from "react";
import {
  FaBell,
  FaCheck,
  FaTrash,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Follower",
      message: "John Doe started following your company",
      type: "info",
      time: "2 min ago",
      read: false
    },
    {
      id: 2,
      title: "Product Update",
      message: "Your product 'Office Chair' has been updated successfully",
      type: "success",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Low Stock Alert",
      message: "Product 'Desk Lamp' is running low on stock",
      type: "warning",
      time: "3 hours ago",
      read: true
    },
    {
      id: 4,
      title: "New Message",
      message: "You have a new message from Sarah Johnson",
      type: "info",
      time: "5 hours ago",
      read: true
    },
    {
      id: 5,
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2:00 AM",
      type: "warning",
      time: "1 day ago",
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
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

  const getNotificationStyle = (type, read) => {
    const baseStyles = "p-4 rounded-xl border-l-4 transition-all duration-200";
    const readStyles = read ? "bg-gray-50/50" : "bg-white shadow-lg";
    
    switch (type) {
      case "success":
        return `${baseStyles} ${readStyles} border-l-green-500`;
      case "warning":
        return `${baseStyles} ${readStyles} border-l-yellow-500`;
      case "error":
        return `${baseStyles} ${readStyles} border-l-red-500`;
      default:
        return `${baseStyles} ${readStyles} border-l-blue-500`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaBell className="text-white text-sm sm:text-lg" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                {unreadCount > 0 
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up!'
                }
              </p>
            </div>
          </div>

          {/* Buttons Container - Always in row */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 bg-blue-500 text-white rounded-xl font-medium 
                  hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/30 
                  hover:shadow-blue-500/50 flex items-center gap-2 text-sm"
              >
                <FaCheck className="text-xs" />
                <span className="hidden sm:inline">Mark All Read</span>
                <span className="sm:hidden">Read All</span>
              </button>
            )}
            <button
              onClick={clearAll}
              className="px-3 py-2 bg-red-500 text-white rounded-xl font-medium 
                hover:bg-red-600 transition-all duration-200 shadow-lg shadow-red-500/30 
                hover:shadow-red-500/50 flex items-center gap-2 text-sm"
            >
              <FaTrash className="text-xs" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">Clear</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBell className="text-gray-400 text-xl sm:text-2xl" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600 text-sm sm:text-base">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={getNotificationStyle(notification.type, notification.read)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm sm:text-base ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <p className={`text-xs sm:text-sm mt-1 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 
                              rounded-lg transition-all duration-200"
                            title="Mark as read"
                          >
                            <FaCheck className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                            rounded-lg transition-all duration-200"
                          title="Delete notification"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unread indicator */}
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clear All Button at Bottom */}
        {notifications.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={clearAll}
              className="text-gray-500 hover:text-red-500 text-xs sm:text-sm font-medium 
                hover:bg-red-50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200"
            >
              Clear all notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;