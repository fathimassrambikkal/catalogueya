import React from 'react';
import { FaClock, FaSignOutAlt } from 'react-icons/fa';

const SessionExpiredPopup = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    {/* Simple Backdrop */}
    <div className="absolute inset-0 bg-blue-950/20" />
    
    {/* Modal - Responsive width */}
    <div className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-xl border border-blue-100 mx-4">
      <div className="p-6 sm:p-8 flex flex-col items-center">
        {/* Simple Blue Icon Container */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl text-blue-500 border border-blue-100">
            <FaClock />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Session Expired</h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-[280px] sm:max-w-sm">
            Your session has expired for security reasons. Please login again to continue.
          </p>
        </div>

        {/* Simple Blue Button */}
        <button
          onClick={onConfirm}
          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FaSignOutAlt className="text-sm sm:text-base" />
          <span>RETURN TO LOGIN</span>
        </button>
      </div>
    </div>
  </div>
);
};

export default SessionExpiredPopup;
