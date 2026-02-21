// Customer/Fatora.jsx
import React, { useState } from "react";
import PendingFatora from "./PendingFatora";
import PastFatora from "./PastFatora";

function Fatora() {
  const [activeFilter, setActiveFilter] = useState("pending");

  return (
    <div className="
      min-h-full
      p-4 sm:p-6 md:p-8 
    ">
      {/* ===== Header Section - Same line for all devices ===== */}
      <div className="mt-28 md:mt-20 mb-8 md:mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Bills
          </h1>
          <div className="flex">
            <div className="
              flex
              bg-white/70 backdrop-blur-md
              rounded-2xl
              border border-gray-200/60
              shadow-sm
              p-1
              gap-1
            ">
              {/* Pending Button */}
              <button
                onClick={() => setActiveFilter("pending")}
                className={`
                  relative
                  px-4 sm:px-8 py-2.5
                  rounded-xl
                  text-xs sm:text-base font-semibold
                  transition-all duration-300
                  whitespace-nowrap
                  ${
                    activeFilter === "pending"
                      ? "bg-blue-500/15 text-blue-600 shadow-inner"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                Pending Bills
              </button>

              {/* Past Button */}
              <button
                onClick={() => setActiveFilter("past")}
                className={`
                  px-4 sm:px-8 py-2.5
                  rounded-xl
                  text-xs sm:text-base font-semibold
                  transition-all duration-300
                  whitespace-nowrap
                  ${
                    activeFilter === "past"
                      ? "bg-blue-500/15 text-blue-600 shadow-inner"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                Past Bills
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ===== End Header Section ===== */}

      {/* Render the appropriate component based on active filter */}
      {activeFilter === "pending" && (
        <PendingFatora />
      )}
      
      {activeFilter === "past" && (
        <PastFatora />
      )}
    </div>
  );
}

export default Fatora;