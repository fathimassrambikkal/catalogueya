import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

const CallToAction = React.memo(() => {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

  // =============================
  //  MEMOIZED TEXTS
  // =============================
  const CTA_TITLE = useMemo(
    () =>
      settings?.subscribe_title ||
      fixedWords?.subscribe_title ||
      "Let’s Stay",
    [settings?.subscribe_title, fixedWords?.subscribe_title]
  );

  const CTA_SUBTITLE = useMemo(
    () =>
      settings?.subscribe_sub_title ||
      fixedWords?.subscribe_sub_title ||
      "Connected.",
    [settings?.subscribe_sub_title, fixedWords?.subscribe_sub_title]
  );

  const CTA_DESCRIPTION = useMemo(() => {
    return (
      settings?.subscribe_text ||
      "Subscribe to Catalogueya and receive the latest updates, offers, and exclusive insights right in your inbox."
    );
  }, [settings?.subscribe_text]);

  const RIGHT_TITLE = useMemo(
    () =>
      settings?.subscribe_sub_title ||
      fixedWords?.subscribe_sub_title ||
      "Subscribe to get News updates",
    [settings?.subscribe_sub_title, fixedWords?.subscribe_sub_title]
  );

  const EMAIL_PLACEHOLDER = useMemo(
    () => fixedWords?.your_email || "Your email",
    [fixedWords?.your_email]
  );

  const REGISTER_TEXT = useMemo(
    () => fixedWords?.register || "Register",
    [fixedWords?.register]
  );

  const BUSINESS_OWNER_TEXT = useMemo(
    () => fixedWords?.business_owner || "Are you a business owner?",
    [fixedWords?.business_owner]
  );

  // ==================================================
  //    UI DOES NOT CHANGE — Only sources are optimized
  // ==================================================

  return (
    <section className="relative w-full flex justify-center items-center py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-10 bg-neutral-100 overflow-hidden">
      {/* Outer Glassmorphic Container */}
      <div
        className="relative z-10 w-full max-w-7xl bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl 
                   p-6 sm:p-10 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.1)] flex flex-col md:flex-row justify-between 
                   items-center gap-10 sm:gap-14 md:gap-16 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl opacity-80"></div>
        <div className="absolute -bottom-24 -right-24 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-cyan-200/40 rounded-full blur-[100px]"></div>

        {/* LEFT SECTION */}
        <div className="relative max-w-xl md:text-left text-center z-10 flex flex-col items-center md:items-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tighter mb-4 sm:mb-6">
            {CTA_TITLE} <br className="hidden sm:block" /> {CTA_SUBTITLE}
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-md">
            {typeof CTA_DESCRIPTION === "string" ? (
              <>
                Subscribe to{" "}
                <span className="font-medium text-blue-700">Catalogueya</span>{" "}
                and receive the latest updates, offers, and exclusive insights
                right in your inbox.
              </>
            ) : (
              CTA_DESCRIPTION
            )}
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="relative w-full max-w-md p-5 sm:p-6 md:p-8 rounded-3xl 
                     bg-gradient-to-br from-white/30 via-white/10 to-white/5 border border-white/40 backdrop-blur-3xl 
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_32px_rgba(31,38,135,0.1)] 
                     flex flex-col gap-4 sm:gap-6 items-center md:items-start overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/30 via-white/10 to-transparent blur-3xl opacity-40"></div>

          <h3 className="relative z-10 font-semibold text-gray-900 text-lg sm:text-xl text-center md:text-left">
            {RIGHT_TITLE}
          </h3>

          <div className="relative w-full z-10">
            <input
              type="email"
              placeholder={EMAIL_PLACEHOLDER}
              className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-gray-300 bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm pr-28 sm:pr-32 shadow-sm placeholder-gray-500 text-sm sm:text-base"
            />

            <button
              className="absolute top-1/2 right-1 -translate-y-1/2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r 
                         from-blue-600 to-cyan-500 text-white rounded-full font-medium 
                         hover:shadow-md hover:from-blue-700 hover:to-cyan-600 transition text-sm sm:text-base"
            >
              {REGISTER_TEXT}
            </button>
          </div>

          <p className="relative z-10 text-gray-700 font-medium text-center md:text-left text-sm sm:text-base">
            {BUSINESS_OWNER_TEXT}{" "}
            <Link
              to="/register"
              className="text-blue-600 underline cursor-pointer hover:text-blue-700 transition font-semibold"
            >
              {REGISTER_TEXT}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
});

export default CallToAction;
