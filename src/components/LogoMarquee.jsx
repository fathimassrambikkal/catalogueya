import React, { memo } from "react";
import SmartImage from "./SmartImage"; // ✅ Import SmartImage
import { log, warn, error } from "../utils/logger";

// Simple Logo Item with RTL support and SmartImage
const LogoItem = memo(({ logo, index, isRTL = false, useSmartImage = false }) => (
  <div 
    className={`flex-shrink-0 w-48 h-32 ${isRTL ? 'rtl-logo' : ''}`}
    dir={isRTL ? "rtl" : "ltr"}
  >
    {useSmartImage ? (
      <SmartImage
        image={logo}
        alt={`client-logo-${index}`}
        className="w-full h-full object-contain"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          error(`LogoMarquee: SmartImage failed`, { index, logo });
          e.target.style.opacity = '0';
        }}
        onLoad={() => {
          log(`LogoMarquee: SmartImage loaded`, { index });
        }}
      />
    ) : (
      <img
  src={logo}
  alt={`client-logo-${index}`}
  className="w-full h-full object-contain"
  loading="lazy"
  decoding="async"
  onError={(e) => {
    warn("LogoMarquee: fallback image failed", { index, logo });
    e.target.style.opacity = "0";
  }}
/>

    )}
  </div>
));

// RTL-Compatible CSS-Only LogoMarquee with SmartImage support
const LogoMarquee = memo(({ 
  logos, 
  isRTL = false, 
  speed = "fast", // Options: "slow" | "normal" | "fast" | "very-fast" | number (seconds)
  useSmartImage = false // ✅ New prop to enable SmartImage
}) => {
  const safeLogos = Array.isArray(logos) ? logos.slice(0, 20) : [];
  
  if (safeLogos.length === 0) {
    warn("LogoMarquee: No logos provided");
    return (
      <div className="w-full text-center py-8 text-gray-400">
        No logos to display
      </div>
    );
  }
  
  log("LogoMarquee init", {
  logoCount: safeLogos.length,
  isRTL,
  useSmartImage
});

  
  // Map speed to duration
  const getDuration = () => {
    if (typeof speed === 'number') return speed;
    
    switch(speed) {
      case 'slow': return 60;
      case 'normal': return 30;
      case 'fast': return 15;
      case 'very-fast': return 8;
      default: return 15;
    }
  };
  
  const duration = getDuration();
  
  // Duplicate for seamless loop
  const duplicatedLogos = [...safeLogos, ...safeLogos];
  
  // Dynamic gradient direction based on RTL
  const leftGradient = isRTL 
    ? 'linear-gradient(to left, white, transparent)' 
    : 'linear-gradient(to right, white, transparent)';
  
  const rightGradient = isRTL 
    ? 'linear-gradient(to right, white, transparent)' 
    : 'linear-gradient(to left, white, transparent)';
  
  return (
    <div 
      className="relative w-full overflow-hidden py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Dynamic gradient fade edges based on RTL */}
      <div 
        className="absolute inset-y-0 start-0 w-32 z-10 pointer-events-none"
        style={{
          background: leftGradient
        }}
      />
      <div 
        className="absolute inset-y-0 end-0 w-32 z-10 pointer-events-none"
        style={{
          background: rightGradient
        }}
      />
      
      <div 
        className={`flex gap-8 ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'}`}
        style={{ 
          animationDuration: `${duration}s`,
          animationPlayState: 'running',
          willChange: 'transform'
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <LogoItem 
            key={`logo-${index}`} 
            logo={logo} 
            index={index}
            isRTL={isRTL}
            useSmartImage={useSmartImage} // ✅ Pass useSmartImage prop
          />
        ))}
      </div>
      
   
      {/* RTL-Compatible CSS */}
      <style  >{`
        /* LTR Animation */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% - 4rem)); }
        }
        
        /* RTL Animation (reversed) */
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(100% + 4rem)); }
        }
        
        /* RTL-aware animations */
        .animate-marquee {
          animation: marquee linear infinite;
          will-change: transform;
        }
        
        .animate-marquee-rtl {
          animation: marquee-rtl linear infinite;
          will-change: transform;
        }
        
        /* Pause on hover for both */
        .animate-marquee:hover, 
        .animate-marquee-rtl:hover {
          animation-play-state: paused;
        }
        
        /* RTL-specific adjustments */
        [dir="rtl"] .animate-marquee,
        [dir="rtl"] .animate-marquee-rtl {
          /* Any RTL-specific adjustments here */
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee,
          .animate-marquee-rtl {
            animation-duration: 60s !important;
          }
        }
      `}</style>
    </div>
  );
});

export default LogoMarquee;