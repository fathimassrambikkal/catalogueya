import React, { useState } from "react";
import { FaChevronRight, FaClock, FaFileInvoice, FaBuilding, FaCalendarAlt, FaTimes, FaWallet } from "react-icons/fa";

function PendingFatora({ fatoras }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedFatora, setSelectedFatora] = useState(null);
  const [tipOption, setTipOption] = useState("no");
  const [tipAmount, setTipAmount] = useState("");

  const handlePayNow = (fatora) => {
    setSelectedFatora(fatora);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setTipOption("no");
    setTipAmount("");
    setSelectedFatora(null);
  };

  if (fatoras.length === 0) {
    return (
      <div className="
        text-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20
        bg-white/95 backdrop-blur-2xl
        rounded-2xl sm:rounded-3xl
        border border-white/80
        shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_40px_rgba(0,0,0,0.05),0_2px_8px_rgba(0,0,0,0.02)]
        mx-auto w-full max-w-md lg:max-w-lg
        glass-effect
      ">
        <div className="
          w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
          bg-gradient-to-br from-white to-blue-50/30
          rounded-full 
          flex items-center justify-center 
          mx-auto mb-4 sm:mb-6
          shadow-[inset_0_0_20px_rgba(255,255,255,0.8),0_4px_20px_rgba(59,130,246,0.08)]
          border border-white/60
        ">
          <div className="text-2xl sm:text-3xl text-blue-300">
            📄
          </div>
        </div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 mb-2 sm:mb-3 tracking-tight">
          No Pending Invoices
        </h3>
        <p className="text-gray-400 text-sm sm:text-base px-4 font-light">
          All your invoices are up to date
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
        {fatoras.map((fatora) => (
          <div
            key={fatora.id}
            className="
              bg-white/95 backdrop-blur-xl
              rounded-xl sm:rounded-2xl
              border border-white/80
              shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_24px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]
              overflow-hidden
              transition-all duration-300
              hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.06)]
              glass-effect
            "
          >
            {/* ===== COMPACT HEADER ===== */}
            <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4">
              {/* Left: Status with icon */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="
                  w-7 h-7 sm:w-9 sm:h-9
                  rounded-lg sm:rounded-xl
                  bg-gradient-to-br from-blue-50 to-blue-100/30
                  flex items-center justify-center
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]
                  border border-blue-100/50
                ">
                  <FaClock className="text-xs sm:text-base text-blue-500/80" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-gray-500 font-light">
                    Received
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex flex-row sm:items-center gap-2">
                      <span className="text-[11px] sm:text-base font-medium text-gray-800">
                        {fatora.receivedDate}
                      </span>
                      {fatora.receivedTime && (
                        <>
                          <span className="hidden sm:inline text-xs text-gray-400">•</span>
                          <span className="text-xs sm:text-sm text-gray-600">
                            {fatora.receivedTime}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Time remaining */}
              <div className="
                px-2 py-1.5 sm:px-4 sm:py-2
                rounded-lg
                bg-gradient-to-r from-blue-500/5 to-blue-500/10
                backdrop-blur-sm
                border border-blue-200/30
              ">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FaClock className="text-[10px] sm:text-xs text-blue-500/70" />
                  <span className="text-xs sm:text-sm font-medium text-blue-600">
                    {fatora.remainingTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Ultra thin divider */}
            <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />

            {/* ===== COMPACT MAIN CONTENT ===== */}
            <div className="
              px-4 sm:px-5 md:px-6 py-4 md:py-5
              gap-3 sm:gap-4 md:gap-5
            ">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-3 sm:mb-4">
                    <p className="
                      text-sm sm:text-base md:text-lg
                      text-gray-600 font-normal
                      truncate
                    ">
                      {fatora.companyName}
                    </p>
                  </div>

                  <div className="mb-1 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="
                        text-sm sm:text-base md:text-md
                        font-medium text-gray-900
                        truncate
                      ">
                        FN: {fatora.fatoraNumber}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="w-full sm:w-auto mt-4 sm:mt-0">
                  <button
                    onClick={() => handlePayNow(fatora)}
                    className="
                      w-full sm:w-auto
                      px-2 py-2.5 sm:px-6 sm:py-3 md:px-4 md:py-2
                      rounded-lg sm:rounded-xl md:rounded-2xl
                      bg-gradient-to-r from-blue-500 to-blue-600
                      text-white
                      text-sm sm:text-base md:text-lg font-medium
                      shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      active:scale-[0.98]
                      transition-all duration-200
                      flex items-center justify-center
                      gap-1.5 sm:gap-2
                      whitespace-nowrap
                      group
                    "
                  >
                    <span>Pay Now</span>
                    <FaChevronRight className="text-xs sm:text-sm opacity-70 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ultra Glass Modal */}
      {showModal && selectedFatora && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          p-4 sm:p-6
          bg-black/40 backdrop-blur-sm
          animate-fadeIn
        ">
          <div 
            className="
              relative
              w-full max-w-md
              bg-white/95 backdrop-blur-2xl
              rounded-2xl sm:rounded-3xl
              border border-white/90
              shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_32px_64px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.4)]
              overflow-hidden
              animate-scaleIn
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="
                absolute top-4 right-4
                w-8 h-8
                flex items-center justify-center
                rounded-full
                bg-white/90 backdrop-blur-sm
                border border-white/80
                shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]
                text-gray-500
                hover:text-gray-700
                hover:bg-white
                active:scale-95
                transition-all duration-200
                z-10
              "
            >
              <FaTimes className="text-sm" />
            </button>

            {/* Modal Header */}
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="
                w-16 h-16
                rounded-full
                bg-gradient-to-br from-blue-50 to-blue-100/30
                flex items-center justify-center
                mx-auto mb-4
                shadow-[inset_0_0_20px_rgba(255,255,255,0.9),0_4px_16px_rgba(59,130,246,0.1)]
                border border-blue-100/50
              ">
                <FaWallet className="text-2xl text-blue-500/80" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                Complete Payment
              </h2>
           
            </div>

            <div className="h-[0.5px] bg-gradient-to-r from-transparent via-gray-200/40 to-transparent" />

            {/* Modal Content */}
            <div className="px-6 py-6">
              {/* Company Info */}
              <div className="mb-6">
               
               

                {/* Tip Selection */}
                <div className="mb-6">
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Would you like to add a tip?
                  </h4>
                  
                  <div className="flex gap-3 mb-4">
                    {/* Yes Button */}
                    <button
                      onClick={() => setTipOption("yes")}
                      className={`
                        flex-1 py-3
                        rounded-xl
                        border
                        text-base font-medium
                        transition-all duration-200
                        ${tipOption === "yes" 
                          ? "bg-blue-50 border-blue-500/50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300/50 hover:bg-blue-50/50"
                        }
                      `}
                    >
                      Yes
                    </button>

                    {/* No Button */}
                    <button
                      onClick={() => {
                        setTipOption("no");
                        setTipAmount("");
                      }}
                      className={`
                        flex-1 py-3
                        rounded-xl
                        border
                        text-base font-medium
                        transition-all duration-200
                        ${tipOption === "no" 
                          ? "bg-blue-50 border-blue-500/50 text-blue-600 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300/50 hover:bg-blue-50/50"
                        }
                      `}
                    >
                      No
                    </button>
                  </div>

                  {/* Tip Amount Input */}
                  {tipOption === "yes" && (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Enter tip amount
                      </label>
                      <div className="relative">
                        <div className="
                          absolute left-4 top-1/2 -translate-y-1/2
                          text-gray-400
                        ">
                          QAR
                        </div>
                        <input
                          type="text"
                          value={tipAmount}
                          onChange={(e) => setTipAmount(e.target.value)}
                          placeholder=""
                          className="
                            w-full
                            pl-12 pr-4 py-4
                            rounded-xl
                            bg-white
                            border border-gray-200
                            text-lg font-medium text-gray-900
                            placeholder:text-gray-400
                            focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                            transition-all duration-200
                          "
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Amount */}
                <div className="
                  p-4
                  rounded-xl
                  bg-gradient-to-r from-blue-50/50 to-blue-100/20
                  border border-blue-100/50
                  mb-6
                ">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-gray-700">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      {selectedFatora.amount || "250 QAR"}
                      {tipAmount && ` + ${tipAmount} QAR`}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="
                      flex-1 py-3
                      rounded-xl
                      bg-white
                      border border-gray-200
                      text-gray-700 font-medium
                      hover:bg-gray-50
                      active:scale-[0.98]
                      transition-all duration-200
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle payment logic here
                      closeModal();
                    }}
                    className="
                      flex-1 py-3
                      rounded-xl
                      bg-gradient-to-r from-blue-500 to-blue-600
                      text-white font-medium
                      shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      active:scale-[0.98]
                      transition-all duration-200
                      relative overflow-hidden
                    "
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Confirm Payment</span>
                  </button>
                </div>
              </div>
            </div>

            
         
          </div>
        </div>
      )}

      {/* Add these animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default PendingFatora;