import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCalendarAlt } from "./SvgIcons";
import { useFixedWords } from "../hooks/useFixedWords";

function AnalyticsCalendar({ range, setRange }) {
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const ranges = [
    fw.last_7_days || "Last 7 days",
    fw.last_month || "Last month",
    fw.last_3_months || "Last 3 months",
    fw.last_year || "Last year",
  ];

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropdownRef} className="relative max-w-full">
      
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
       group relative flex items-center gap-2
  rounded-xl
  bg-white/90 backdrop-blur-sm
  px-3 py-2
  text-[11px] sm:text-xs font-medium
  text-gray-900
  shadow-sm ring-1 ring-gray-200/50
  hover:ring-blue-200 hover:shadow-md
  transition-all duration-200
  whitespace-nowrap
        "
      >
        {/* Calendar Icon */}
        <div className="p-1 sm:p-1.5 rounded-lg flex items-center justify-center">
          <FaCalendarAlt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
        </div>

        {/* Range Text */}
        <span className="whitespace-nowrap text-[11px] sm:text-xs">
          {range}
        </span>

        {/* Chevron */}
        <FaChevronDown
          className={`
            w-3 h-3 sm:w-3.5 sm:h-3.5
            text-gray-500
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      {open && (
   <div
className="
absolute right-0 mt-1.5
min-w-[160px]
rounded-xl
bg-white/95 backdrop-blur-xl
shadow-2xl
ring-1 ring-gray-200/30
z-50
overflow-hidden
border border-white/50
"
>
          <div className="py-1">
            {ranges.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setRange(item);
                  setOpen(false);
                }}
                className={`
                  w-full
                  px-3 sm:px-4
                  py-2 sm:py-2.5
                  text-left
                  text-[11px] sm:text-xs
                  transition-all duration-150
                  flex items-center gap-2
                  ${
                    range === item
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50/50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50/50"
                  }
                `}
              >
                {range === item && (
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}

                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsCalendar;