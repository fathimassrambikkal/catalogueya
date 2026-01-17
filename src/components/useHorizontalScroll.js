import { useEffect } from "react";

export default function useHorizontalScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafLock = false;

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      e.preventDefault();
      if (rafLock) return;

      rafLock = true;
      el.scrollLeft += e.deltaY * 0.8;

      requestAnimationFrame(() => {
        rafLock = false;
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}
