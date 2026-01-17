import React from "react";

function Help() {
  return (
    <div
      className="
        min-h-full  w-full
        
        flex items-center justify-center
        p-3 xs:p-4 sm:p-6
        overflow-x-hidden
      "
    >
      <div className="relative w-full max-w-xs xs:max-w-sm sm:max-w-md">
        {/* Glass card */}
        <div
          className="
            glass-card
            rounded-2xl sm:rounded-3xl
            text-center
            p-4 xs:p-6 sm:p-10
          "
        >
          {/* Support SVG Icon */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="
                text-blue-500 opacity-90
                w-14 h-14
                xs:w-16 xs:h-16
                sm:w-20 sm:h-20
              "
            >
              <path
                d="M32 4C19.85 4 10 13.85 10 26v10c0 3.31 2.69 6 6 6h4V26h-6c0-9.94 8.06-18 18-18s18 8.06 18 18h-6v16h4c3.31 0 6-2.69 6-6V26C54 13.85 44.15 4 32 4Z"
                fill="currentColor"
              />
              <path
                d="M26 44h12v6c0 3.31-2.69 6-6 6s-6-2.69-6-6v-6Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="
              font-bold text-slate-800
              text-xl xs:text-2xl sm:text-4xl
              mb-2 sm:mb-4
              tracking-tight
            "
          >
            Help
          </h1>

          {/* Subtitle */}
          <p
            className="
              text-slate-600
              text-sm xs:text-base sm:text-lg
              mb-6 sm:mb-8
            "
          >
            Coming Soon
          </p>

          {/* Apple-style blue pill */}
          <div
            className="
              inline-flex items-center
              px-3 py-1.5
              xs:px-4 xs:py-2
              sm:px-5 sm:py-2
              bg-blue-500/10
              rounded-full
              border border-blue-400/30
              max-w-full
            "
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
            <span
              className="
                text-blue-600 font-medium
                text-xs xs:text-sm
                tracking-wide
                truncate
              "
            >
              Something Great is Coming
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow:
            0 20px 40px rgba(0, 100, 200, 0.08),
            0 4px 12px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
}

export default Help;
