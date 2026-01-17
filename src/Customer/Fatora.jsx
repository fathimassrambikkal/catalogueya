// Customer/Fatora.jsx
import React, { useState } from "react";
import PendingFatora from "./PendingFatora";
import PastFatora from "./PastFatora";

function Fatora() {
  const [activeFilter, setActiveFilter] = useState("pending");

  // Sample data for pending fatoras
  const pendingFatoras = [
    {
      id: 1,
      receivedDate: "Dec 07",
      receivedTime: "11:00",
      remainingTime: "2 days",
      companyName: "Aljazeel plantery",
      fatoraNumber: "1349987674024005",
      status: "pending"
    },
    {
      id: 2,
      receivedDate: "Dec 04",
      receivedTime: "11:00",
      remainingTime: "4 Hours",
      companyName: "AlHermiz cleaning",
      fatoraNumber: "4045753154665",
      status: "pending"
    }
  ];

  // Sample data for past fatoras
  const pastFatoras = [
    {
      id: 3,
      date: "Dec 07",
      time: "11:00 am",
      companyName: "Aljazeel plantery",
      fatoraNumber: "1349987674024005",
      amount: "250 QR",
      status: "paid"
    },
    {
      id: 4,
      date: "Nov 07",
      time: "09:55 am",
      companyName: "Aljazeel plantery",
      fatoraNumber: "1349987674024005",
      amount: "250 QR",
      status: "not-paid"
    }
  ];

  return (
    <div className="
      min-h-full
      
      p-4 sm:p-6 md:p-8
    ">
      {/* ===== Updated Header Section ===== */}
      <div className="relative mt-10 mb-8 md:mb-10">
        {/* Center title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Fatora
          </h1>
        </div>

        {/* Tabs */}
        <div
          className="
            mt-4 md:mt-0
            flex justify-center md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2
          "
        >
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
                px-5 md:px-8 py-2.5
                rounded-xl
                text-[10px] md:text-base font-semibold
                transition-all duration-300
                ${
                  activeFilter === "pending"
                    ? "bg-blue-500/15 text-blue-600 shadow-inner"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              Pending Fatora
            </button>

            {/* Past Button */}
            <button
              onClick={() => setActiveFilter("past")}
              className={`
                px-5 md:px-8 py-2.5
                rounded-xl
                text-[10px] md:text-base font-semibold
                transition-all duration-300
                ${
                  activeFilter === "past"
                    ? "bg-blue-500/15 text-blue-600 shadow-inner"
                    : "text-gray-600 hover:text-gray-800"
                }
              `}
            >
              Past Fatora
            </button>
          </div>
        </div>
      </div>
      {/* ===== End Header Section ===== */}

      {/* Render the appropriate component based on active filter */}
      {activeFilter === "pending" && (
        <PendingFatora fatoras={pendingFatoras} />
      )}
      
      {activeFilter === "past" && (
        <PastFatora fatoras={pastFatoras} />
      )}
    </div>
  );
}

export default Fatora;