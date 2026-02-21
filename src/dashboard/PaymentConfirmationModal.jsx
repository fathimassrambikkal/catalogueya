import React from "react";
import { Check, X } from "lucide-react";

const PaymentConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Confirm Payment", message = "Did u recive cash payment for this bill?" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed px-4">
            {message}
          </p>
        </div>

        <div className="flex border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-wider"
          >
            No
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-wider"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
