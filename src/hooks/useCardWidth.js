import { useState, useEffect, useRef } from "react";

export const useCardWidth = () => {
  const [cardWidth, setCardWidth] = useState('220px');
  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const updateCardWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCardWidth('calc(45vw - 20px)');
      } else if (width < 768) {
        setCardWidth('220px');
      } else {
        setCardWidth('240px');
      }
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(updateCardWidth, 50);
    };

    updateCardWidth();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return cardWidth;
};