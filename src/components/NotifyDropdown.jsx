import React, { useState, useRef, useEffect } from 'react';
import { FaBell, FaHistory, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const NotifyDropdown = ({ onNotify, onViewHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm hover:bg-blue-100 transition-all text-sm font-bold min-w-[120px]"
      >
        <FaBell className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-12' : ''}`} />
        <span>Notify</span>
        <FaChevronDown className={`ml-1 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[1000] overflow-hidden p-2"
          >
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleOptionClick(onNotify)}
                className="flex items-center gap-3 w-full p-4 text-left rounded-2xl hover:bg-blue-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-white transition-colors">
                  <FaBell className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Notify Customers</p>
                  <p className="text-[10px] font-bold text-gray-400">Send custom alerts</p>
                </div>
              </button>

              <div className="h-px bg-gray-50 mx-2 my-1" />

              <button
                onClick={() => handleOptionClick(onViewHistory)}
                className="flex items-center gap-3 w-full p-4 text-left rounded-2xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-white transition-colors">
                  <FaHistory className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">Sent Notification</p>
                  <p className="text-[10px] font-bold text-gray-400">View sent alerts</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotifyDropdown;
