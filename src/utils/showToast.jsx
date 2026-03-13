import { toast } from "react-hot-toast";

export const showToast = (message, { rtl = false, id = "global-toast" } = {}) => {
  toast.dismiss(id); // ensure previous toast with same id disappears

  toast.custom(
    (t) => (
      <div
        role="status"
        className={`
          bg-white
          text-neutral-900
          rounded-xl
          border border-blue-200/60
          shadow-[0_12px_40px_rgba(0,0,0,0.06)]
          px-5 py-4
          flex items-center gap-3
          text-[14px] font-medium tracking-tight
          transition-all duration-200 ease-out
          ${rtl ? "flex-row-reverse text-right" : "flex-row text-left"}
          ${t.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2"}
        `}
      >
        <span>{message}</span>
      </div>
    ),
    {
      duration: 2800,
      id,
    }
  );
};