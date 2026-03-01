const SessionExpiredPopup = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50" />

      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="p-6 sm:p-8">
          
          <div className="flex items-start gap-4">
            
            {/* Icon */}
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v5l3 2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Session expired
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Please log in again to continue your shopping.
              </p>
            </div>
          </div>

          <button
            onClick={onConfirm}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition"
          >
            Login again
          </button>
        </div>
      </div>
    </div>
  );
};