import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

const CallToAction = React.memo(() => {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

  const fw = fixedWords?.fixed_words || {};

  return (
    <section className="relative w-full flex justify-center items-center py-20 px-6 bg-white overflow-hidden">

      <div className="relative z-10 w-full max-w-7xl bg-white/10 backdrop-blur-2xl border border-white/30 
          rounded-3xl p-10 md:p-14 shadow-[0_8px_40px_rgba(0,0,0,0.1)] 
          flex flex-col md:flex-row justify-between items-center gap-16 overflow-hidden">

        {/* Glow Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-3xl opacity-80"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-200/40 rounded-full blur-[120px]"></div>

        {/* LEFT SECTION */}
        <div className="relative z-10 max-w-xl text-center md:text-left">
          
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight tracking-tight mb-6">
            {settings?.subscribe_title}
            <br />
            {settings?.subscribe_sub_title}
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            {settings?.subscribe_text}
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="relative z-10 w-full max-w-md bg-white/20 backdrop-blur-2xl border border-white/40 
            p-8 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_32px_rgba(31,38,135,0.1)]">

          <h3 className="font-semibold text-gray-900 text-xl mb-4">
            {settings?.subscribe_sub_title}
          </h3>

          {/* Email Input */}
          <div className="relative mb-5">
            <input
              type="email"
              placeholder={fw?.your_email}
              className="w-full px-5 py-3 rounded-full border border-gray-300 bg-white/70 
              placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-32"
            />

            <button
              className="absolute top-1/2 right-1 -translate-y-1/2 px-6 py-2 rounded-full 
              bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium hover:opacity-90">
              {fw?.register}
            </button>
          </div>

          <p className="text-gray-700 text-base font-medium">
            {fw?.business_owner}{" "}
            <Link to="/register" className="text-blue-600 underline font-semibold">
              {fw?.register}
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
});

export default CallToAction;
