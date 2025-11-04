"use client";
import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export const Lens = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
  disableOnMobile = true, // 👈 new prop
}) => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [localIsHovering, setLocalIsHovering] = useState(false);
  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMove = (x, y, rect) => {
    const relX = x - rect.left;
    const relY = y - rect.top;
    setMousePosition({ x: relX, y: relY });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e) => {
    if (!e.touches.length) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(touch.clientX, touch.clientY, rect);
  };

  // Disable zoom on mobile if requested
  if (isMobile && disableOnMobile) {
    return <div className="relative overflow-hidden rounded-lg">{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg z-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsHovering(true)}
      onTouchEnd={() => setIsHovering(false)}
      onTouchMove={handleTouchMove}
    >
      {children}

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
