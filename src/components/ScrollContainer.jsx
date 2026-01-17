import React, { memo, useEffect, useCallback } from "react";

export const HorizontalScrollContainer = memo(({ 
  children, 
  className = "",
  onWheel,
  scrollContainerRef,
  showScrollButtons = true,
  onScrollLeft,
  onScrollRight,
  scrollButtonLeftLabel = "Previous products",
  scrollButtonRightLabel = "Next products",
  isRTL = false
}) => {
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !onWheel) return;

    let wheelTimeout;
    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        if (wheelTimeout) return;
        scrollContainer.scrollLeft += e.deltaY * 0.8;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 16);
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [scrollContainerRef, onWheel]);

  const ScrollButtons = () => (
    <div className="flex justify-end mt-4 gap-3">
      <button
        onClick={isRTL ? onScrollRight : onScrollLeft}
        className="bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600 rounded-full p-1.5 sm:p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] backdrop-blur-sm hover:shadow-2xl group"
        aria-label={isRTL ? "المنتجات التالية" : scrollButtonLeftLabel}
      >
        {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <button
        onClick={isRTL ? onScrollLeft : onScrollRight}
        className="bg-[#E6E7EB] hover:bg-[#DCDDDF] text-gray-600 rounded-full p-1.5 sm:p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] hover:scale-[1.06] active:scale-[0.95] group"
        aria-label={isRTL ? "المنتجات السابقة" : scrollButtonRightLabel}
      >
        {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );

  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto pb-8 -mx-3 sm:-mx-6 md:-mx-10 lg:-mx-16 xl:-mx-24 px-3 sm:px-6 md:px-10 lg:px-16 xl:px-24
                   scrollbar-hide scroll-smooth
                   [scrollbar-width:none] [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden ${className}`}
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex gap-3 sm:gap-4 items-stretch">
          {children}
        </div>
      </div>

      {showScrollButtons && onScrollLeft && onScrollRight && <ScrollButtons />}
    </div>
  );
});