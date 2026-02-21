import React from "react";

const CancelBillModal = ({ isOpen, onClose, onSubmit, companyName }) => {
  const [reason, setReason] = React.useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with ultra-thin blur - Apple style */}
      <div 
        className="absolute inset-0 bg-black/5 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal - Apple blue glass theme */}
      <div className="
        relative
        w-full max-w-md
        bg-white/80 backdrop-blur-2xl
        rounded-3xl
        shadow-[0_20px_50px_-8px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset,0_0_0_1px_rgba(0,0,0,0.05)]
        border border-white/50
        overflow-hidden
        animate-scaleIn
      ">
        {/* Glass highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative p-8">
          {/* Close button with SVG only */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <svg 
              className="w-5 h-5 text-gray-500" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Icon - Apple style blue circle with SVG */}
          <div className="
            w-14 h-14
            bg-gradient-to-br from-blue-500 to-blue-600
            rounded-2xl
            flex items-center justify-center
            shadow-[0_10px_20px_-5px_rgba(0,122,255,0.3)]
            mb-6
          ">
            <svg 
              className="w-7 h-7 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          {/* Title */}
          <h2 className="
            text-2xl
            font-semibold
            text-gray-900
            tracking-tight
            mb-2
          ">
            Tell us why you cancel your bill
          </h2>

          {/* Optional company name subtitle */}
          {companyName && (
            <p className="text-gray-500 text-sm mb-6">
              for {companyName}
            </p>
          )}

          {/* Textarea - Apple style */}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason..."
            className="
              w-full
              h-32
              p-4
              bg-white/90 backdrop-blur-sm
              border border-gray-200/80
              rounded-2xl
              text-gray-900
              text-base
              placeholder:text-gray-400
              focus:outline-none
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-500/10
              transition-all duration-200
              resize-none
              shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
            "
            autoFocus
          />

          {/* Action Buttons - Apple style */}
          <div className="flex items-center justify-end gap-3 mt-6">
            {/* Cancel button */}
            <button
              onClick={onClose}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-gray-100/80
                backdrop-blur-sm
                text-gray-600
                text-sm
                font-medium
                border border-gray-200/50
                hover:bg-gray-200/80
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              Cancel
            </button>

            {/* Send button */}
            <button
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white
                text-sm
                font-medium
                shadow-[0_8px_20px_-8px_rgba(0,122,255,0.5)]
                hover:shadow-[0_12px_25px_-8px_rgba(0,122,255,0.7)]
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:shadow-[0_8px_20px_-8px_rgba(0,122,255,0.5)]
                transition-all duration-200
                active:scale-[0.98]
                relative overflow-hidden group
              "
            >
              <div className="
                absolute inset-0
                bg-gradient-to-r from-transparent via-white/20 to-transparent
                -translate-x-full
                group-hover:translate-x-full
                transition-transform duration-700
              " />
              <span className="relative">Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframes - add to your global CSS or component style */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.2, 0, 0, 1);
        }
      `}</style>
    </div>
  );
};

export default CancelBillModal;