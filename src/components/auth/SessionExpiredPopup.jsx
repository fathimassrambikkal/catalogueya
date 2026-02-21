import React from 'react';
import { FaClock, FaSignOutAlt } from 'react-icons/fa';

const SessionExpiredPopup = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/20">
        <div className="p-10 flex flex-col items-center">
          {/* Glowing Green Icon Container */}
          <div className="relative mb-8">
            {/* The "Glow" effect */}
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-40 animate-pulse" />
            
            <div className="relative w-24 h-24 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center text-4xl shadow-xl shadow-green-100 border-4 border-white">
              <FaClock className="animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-3 mb-8">
            <h2 className="text-3xl font-black text-gray-900">Session Expired</h2>
            <p className="text-gray-500 font-medium">Your session has expired for security reasons. Please login again to continue.</p>
          </div>

          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-2xl text-base font-black shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <FaSignOutAlt />
            <span>RETURN TO LOGIN</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredPopup;
