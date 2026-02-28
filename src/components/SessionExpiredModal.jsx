import React from 'react';
import { FaSignOutAlt, FaHome } from 'react-icons/fa';

export default function SessionExpiredModal({ isOpen, onLogin, onHome }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-sm rounded-[24px] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center transform transition-all animate-[zoomIn_0.3s_ease-out]">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-red-50">
          <FaSignOutAlt className="text-red-500 text-2xl translate-x-0.5" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Session Expired</h3>
        <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
          Your session has timed out. Please log in again to continue accessing your account.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onLogin}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-blue-600/20"
          >
            Go to Login
          </button>
          
          <button
            onClick={onHome}
            className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 border border-gray-200"
          >
            <FaHome className="text-gray-400" />
            Go to Home
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
