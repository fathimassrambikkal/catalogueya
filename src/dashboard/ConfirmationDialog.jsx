import React from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "info", children }) {
  if (!isOpen) return null;

  const bgColors = {
    danger: "bg-red-50 text-red-500",
    success: "bg-green-50 text-green-500",
    info: "bg-blue-50 text-blue-500",
    warning: "bg-yellow-50 text-yellow-500"
  };

  const buttonColors = {
    danger: "bg-red-500 hover:bg-red-600",
    success: "bg-green-500 hover:bg-green-600",
    info: "bg-blue-500 hover:bg-blue-600",
    warning: "bg-yellow-500 hover:bg-yellow-600"
  };

  const icons = {
    danger: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <HelpCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full overflow-hidden transform transition-all">
        <div className="p-5">
          <div className="text-center">
            <div className={`mx-auto w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${bgColors[type]}`}>
              {icons[type]}
            </div>
            <h3 className="text-base font-medium text-gray-700 mb-1.5">{title}</h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              {message}
            </p>

            {children}

            <div className="flex gap-2 mt-2">
              <button
                onClick={onClose}
                className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium rounded-lg transition-colors border border-gray-200/60"
              >
                {cancelText}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 px-3 py-2 text-white text-xs font-medium rounded-lg shadow-sm transition-all active:scale-95 ${buttonColors[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;