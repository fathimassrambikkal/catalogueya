import { toast } from "react-hot-toast";

export const showToast = (message, { rtl = false } = {}) => {
  toast.custom(
    (t) => (
      <div
        className={`
          bg-white/80
          text-gray-900
          rounded-xl
          border border-gray-200/60
          shadow-[0_4px_16px_rgba(0,0,0,0.08)]
          px-4 py-3
          
          flex items-center gap-3
          transition-all duration-300 ease-out
          ${rtl ? "flex-row-reverse text-right" : "flex-row text-left"}
          ${t.visible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-[-8px] opacity-0 scale-95"}
        `}
      >
        <span className="text-sm font-medium leading-snug">
          {message}
        </span>
      </div>
    ),
    {
      duration: 3000,
    }
  );
};
