import React from "react";

export default function VisaCard() {
  return (
    <div className="
      w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px]
      h-[170px] sm:h-[190px] md:h-[220px] lg:h-[230px] xl:h-[240px]
      rounded-xl sm:rounded-2xl
      p-4 sm:p-5 md:p-6
      relative overflow-hidden
      group hover:scale-[1.02]
      transition-all duration-300
      cursor-pointer
      
    ">
      {/* 3D Card Background with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-700/70 rounded-xl sm:rounded-2xl" />
      
      {/* Subtle embossed pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
      
      {/* Card shine/glare effect */}
      <div className="absolute top-0 left-0 right-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-white/20 to-transparent opacity-30 rounded-t-xl sm:rounded-t-2xl" />
      
      {/* 3D embossed edges */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-amber-800/40 shadow-xl sm:shadow-2xl shadow-amber-900/30" />
      <div className="absolute inset-[1px] rounded-xl sm:rounded-2xl border border-amber-300/10" />
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px sm:90px 90px md:100px 100px'
        }}
      />
      
      {/* Holographic stripe effect */}
      <div className="absolute top-12 sm:top-14 md:top-16 left-4 sm:left-5 md:left-6 right-4 sm:right-5 md:right-6 h-6 sm:h-7 md:h-8 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent blur-sm opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 text-white h-full flex flex-col justify-between">
        {/* Top row - Correct positioning */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Visa Logo with 3D effect */}
            <div className="relative">
              <div className="
                text-xl sm:text-2xl md:text-3xl
                font-bold tracking-wider sm:tracking-widest
                bg-gradient-to-b from-amber-300 to-amber-600
                bg-clip-text text-transparent
              ">
                VISA
              </div>
              <div className="
                absolute inset-0
                text-xl sm:text-2xl md:text-3xl
                font-bold tracking-wider sm:tracking-widest
                text-white/30 blur-sm
              ">
                VISA
              </div>
            </div>
            <span className="text-[10px] sm:text-xs text-amber-300/80 font-medium tracking-wide">
              PLATINUM
            </span>
          </div>

          {/* Minus symbol button */}
          <div className="
            w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8
            rounded-full
            bg-gradient-to-b from-amber-800/50 to-amber-900/70
            flex items-center justify-center
            border border-amber-700/50
            shadow-inner
            group-hover:bg-amber-800/60
            transition-colors
          ">
            <div className="w-2 sm:w-2.5 md:w-3 h-0.5 bg-amber-200 rounded-full" />
          </div>
        </div>

        {/* Chip and Contactless symbol - Proper card layout */}
        <div className="flex items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
          {/* Chip */}
          <div className="
            w-10 h-7 sm:w-11 sm:h-8 md:w-12 md:h-9
            bg-gradient-to-br from-amber-400/40 to-amber-600/40
            rounded sm:rounded-md
            border border-amber-300/40
            shadow-inner
          ">
            <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-0.5 p-0.5 sm:p-1">
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-300/50 rounded-[1px] sm:rounded-sm"></div>
              <div className="bg-amber-400/50 rounded-[1px] sm:rounded-sm"></div>
            </div>
          </div>
          
          {/* Contactless symbol */}
          <div className="flex items-center">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
              <div className="absolute inset-0 border border-white/50 rounded-full"></div>
              <div className="absolute inset-0.5 sm:inset-1 border border-white/50 rounded-full"></div>
              <div className="absolute inset-1 sm:inset-1.5 md:inset-2 border border-white/50 rounded-full"></div>
            </div>
            <span className="ml-1.5 sm:ml-2 text-[10px] sm:text-xs text-white/70 font-medium tracking-wide">
              CONTACTLESS
            </span>
          </div>
        </div>

        {/* Card number with embossed effect - Better positioning */}
        <div className="mt-2 sm:mt-3 md:mt-4">
          <div className="relative">
            <div className="
              absolute -inset-0.5 sm:-inset-1
              text-base sm:text-lg md:text-xl lg:text-2xl
              tracking-[0.2em] sm:tracking-[0.25em]
              font-bold text-black/20 blur-sm
            ">
              1520 0100 3356 6888
            </div>
            <p className="
              text-base sm:text-lg md:text-xl lg:text-2xl
              tracking-[0.2em] sm:tracking-[0.25em]
              font-bold text-amber-50
              relative pl-0.5 sm:pl-1
            ">
              1520&nbsp;&nbsp;0100&nbsp;&nbsp;3356&nbsp;&nbsp;6888
            </p>
          </div>
        </div>

        {/* Bottom info - Proper credit card layout */}
        <div className="flex justify-between items-end mt-4 sm:mt-5 md:mt-6">
          <div className="flex-1 min-w-0">
            <p className="
              text-amber-200/70
              text-[10px] sm:text-xs
              uppercase tracking-wider
              mb-0.5 sm:mb-1
              truncate
            ">
              CARD HOLDER
            </p>
            <p className="
              font-semibold
              text-sm sm:text-base
              text-amber-50
              tracking-wider
              truncate
            ">
              JOHN SMITH
            </p>
          </div>

          <div className="flex-1 text-right min-w-0 mr-3 sm:mr-4">
            <p className="
              text-amber-200/70
              text-[10px] sm:text-xs
              uppercase tracking-wider
              mb-0.5 sm:mb-1
              truncate
            ">
              VALID THRU
            </p>
            <p className="
              font-semibold
              text-sm sm:text-base
              text-amber-50
            ">
              11/24
            </p>
          </div>
        </div>
        
        {/* Signature strip - Better positioned */}
        <div className="
          absolute bottom-3 sm:bottom-4
          left-4 sm:left-5 md:left-6
          right-24 sm:right-28 md:right-32
          h-4 sm:h-5
          bg-gradient-to-r from-amber-900/50 to-transparent
          border-t border-amber-700/40
          rounded-br sm:rounded-br-md
        ">
          <div className="h-full flex items-center px-1.5 sm:px-2">
            <div className="w-full h-2.5 sm:h-3 bg-gradient-to-r from-amber-800/60 to-amber-600/40 rounded-sm flex items-center justify-end pr-0.5 sm:pr-1">
              <span className="text-[8px] sm:text-[10px] text-amber-200/40 font-mono tracking-widest">
                CVV ●●●
              </span>
            </div>
          </div>
        </div>
        
        {/* Visa hologram - Better positioned */}
        <div className="
          absolute bottom-3 sm:bottom-4
          right-4 sm:right-5 md:right-6
          w-12 h-8 sm:w-13 sm:h-9 md:w-14 md:h-10
          bg-gradient-to-br from-amber-300/20 via-transparent to-amber-600/20
          rounded-sm
          border border-amber-400/30
          shadow-lg
        ">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse"></div>
          <div className="absolute inset-0.5 sm:inset-1 flex items-center justify-center">
            <div className="
              text-[7px] sm:text-[8px]
              font-bold text-amber-200/60
              tracking-wider
              rotate-[-15deg]
            ">
              VISA
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D Shadow */}
      <div className="
        absolute -bottom-1.5 sm:-bottom-2
        left-3 sm:left-4
        right-3 sm:right-4
        h-3 sm:h-4
        bg-gradient-to-b from-amber-900/40 to-transparent
        rounded-full blur-md
      "></div>
    </div>
  );
}