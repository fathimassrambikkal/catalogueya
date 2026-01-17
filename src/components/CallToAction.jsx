import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";
import { createSubscribeUser } from "../api";

const CallToAction = React.memo(() => {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  /* ------------------------------
     Stable handlers (perf critical)
  ------------------------------ */
  const onEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleSubscribe = useCallback(async () => {
    if (!email.trim()) {
      setMessage({
        type: "error",
        text: fw?.enter_email || "Please enter email",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await createSubscribeUser(email);

      setMessage({
        type: "success",
        text:
          res?.data?.message ||
          fw?.subscribed_success ||
          "Subscribed successfully",
      });

      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.response?.data?.message ||
          fw?.something_wrong ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }, [email, fw]);

  return (
    <section className="relative w-full flex justify-center items-center py-20 px-6 bg-white overflow-hidden">
      <div
        className="relative z-10 w-full max-w-7xl bg-white/10 backdrop-blur-2xl border border-white/30 
        rounded-3xl p-8 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.1)] 
        flex flex-col md:flex-row justify-between items-center gap-12 md:gap-16 overflow-hidden"
        style={{ contain: "layout paint" }} // performance hint
      >
        {/* Glow Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl opacity-80"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-200/40 rounded-full blur-[120px]"></div>

        {/* LEFT SECTION */}
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 leading-tight tracking-tight mb-4 sm:mb-6">
            {settings?.subscribe_title}
          </h2>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {settings?.subscribe_text}
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-2xl border border-white/40 
          p-6 sm:p-8 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_rgba(31,38,135,0.1)]"
          style={{ contain: "layout paint" }}
        >
          <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-4">
            {settings?.subscribe_sub_title}
          </h3>

          {/* Email Input */}
          <div className="relative mb-5">
            <input
              type="email"
              value={email}
              onChange={onEmailChange}
              placeholder={fw?.your_email}
              className="
                w-full
                px-4
                py-2.5 sm:py-3
                rounded-full
                border border-gray-300
                bg-white/70
                placeholder-gray-500
                text-[10px] sm:text-sm md:text-base
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
                pr-24 sm:pr-32
                min-w-0
              "
            />

            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="
                absolute top-1/2 right-1 -translate-y-1/2 
                px-3 sm:px-8 
                py-1.5 sm:py-3 
                rounded-full 
                bg-gradient-to-r from-blue-600 to-cyan-500 
                text-white 
                font-medium 
                text-xs sm:text-sm
                hover:opacity-90
                min-w-[70px] sm:min-w-[85px]
                whitespace-nowrap
              "
            >
              {loading ? "..." : fw?.register}
            </button>
          </div>

          <p className="text-gray-700 text-sm sm:text-base font-medium">
            {fw?.business_owner}{" "}
            <Link
              to="/register"
              className="text-blue-600 underline font-semibold whitespace-nowrap"
            >
              {fw?.register}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
});

export default CallToAction;
