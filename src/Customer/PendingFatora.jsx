import React, { useState } from "react";
import { FaChevronRight, FaClock, FaTimes, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function PendingFatora({ fatoras }) {
 
 const navigate = useNavigate();



  const handlePayNow = (fatora) => {
    navigate("/customer/pay", {
      state: { fatora }
    });
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

    

     
      <style >{`
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