import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Notifications from './Notifications';

const NotificationHistoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex justify-center items-center p-2 sm:p-4 z-[2000] animate-in fade-in duration-300">
      <div
        className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in zoom-in duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="bg-white px-8 py-4 flex justify-between items-center border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <NotificationsIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Sent Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <Notifications />
        </div>
      </div>
    </div>
  );
};

// Simple icon component to avoid imports if not needed, or just use FaBell
const NotificationsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export default NotificationHistoryModal;
