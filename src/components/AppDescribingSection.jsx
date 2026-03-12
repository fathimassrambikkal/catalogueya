import React from "react";
import appStoreIcon from "../assets/appstore.svg";
import playStoreIcon from "../assets/playstore.svg";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
import appCenter from "../assets/center.png";
import appLeft from "../assets/left.png";
import appRight from "../assets/right.png";

const AppDescribingSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="relative w-full bg-white py-[clamp(3rem,7vw,7rem)]"
    >
      {/* subtle background pattern */}
 <div className="absolute inset-0 -z-10 "></div>

      <div className="mx-auto max-w-[1400px] px-[clamp(1rem,4vw,3rem)]">

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-[clamp(3rem,6vw,6rem)] gap-x-[clamp(3rem,7vw,8rem)] items-center">
<div className="lg:col-span-2 text-center max-w-[820px] mx-auto px-[clamp(12px,3vw,24px)]">

<h1 className="font-semibold tracking-[-0.02em] leading-[1.05] text-gray-900 break-words text-balance text-[clamp(1.6rem,4vw,3.6rem)]">

  {/* Line 1 */}
  <span className="block">
    {fw.qatar_first}
  </span>

  {/* Line 2 */}
  <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
    {fw.verified_services?.split("&")[0]}
  </span>

  {/* Line 3 */}
  <span className="block">
    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
      & {fw.verified_services?.split("&")[1]?.trim()}
    </span>{" "}
    <span className="text-slate-900">
      {fw.products_platform}
    </span>
  </span>

</h1>

<p className="mt-[clamp(0.9rem,1.6vw,1.6rem)] text-gray-500 text-[clamp(0.85rem,1.2vw,1.25rem)] max-w-[640px] mx-auto text-balance">
  {fw.all_services_and_products}
</p>

</div>

          {/* PHONE IMAGES */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="
              relative flex items-center justify-center
              h-[clamp(260px,34vw,420px)]
              w-[clamp(280px,32vw,500px)]
            "
            >
              {/* left phone */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 rotate-[-8deg] w-[42%] transition-all duration-500 hover:scale-105 hover:rotate-[-4deg]">
                <div className="overflow-hidden ">
                  <img src={appLeft} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* center phone */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[50%] transition-all duration-500 hover:scale-105">
                <div className="overflow-hidden ">
                  <img src={appCenter} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* right phone */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-[8deg] w-[42%] transition-all duration-500 hover:scale-105 hover:rotate-[4deg]">
                <div className="overflow-hidden ">
                  <img src={appRight} className="w-full h-auto object-cover" />
                </div>
              </div>

              {/* glow */}
              <div className="absolute -inset-8 -z-10 rounded-full bg-blue-50 blur-3xl opacity-70"></div>
            </div>
          </div>
{/* DOWNLOAD CARD - responsive */}
<div className="flex justify-center lg:justify-start">
  <div className="w-[clamp(200px,22vw,280px)]">

    <div className="bg-white/90 backdrop-blur-sm rounded-[clamp(22px,3vw,32px)] border border-gray-100/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-[clamp(1.2rem,2vw,2rem)] transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">

      <h3 className="text-center uppercase tracking-[0.3em] text-gray-400 text-[clamp(9px,0.8vw,11px)] mb-[clamp(1.2rem,2vw,2rem)] font-light">
        {fw.download_app}
      </h3>

      <div className="space-y-[clamp(0.7rem,1.2vw,1rem)]">

        {/* APP STORE */}
        <a
          href="https://apps.apple.com/qa/app/catalogueya/id6757309240"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-start gap-[clamp(0.5rem,1vw,0.8rem)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>

            <img
              src={appStoreIcon}
              alt="App Store"
              className="relative h-[clamp(28px,2.5vw,40px)] w-auto rounded-full border border-gray-200/80 bg-white p-[clamp(4px,0.6vw,8px)] shadow-sm group-hover:shadow-md group-hover:border-gray-300/80 transition-all duration-300"
            />
          </div>

          <span className="text-gray-700 font-medium tracking-tight text-[clamp(13px,1vw,15px)] group-hover:text-gray-900 transition-colors duration-300">
            App Store
          </span>
        </a>

        {/* PLAY STORE */}
        <a
          href="https://play.google.com/store/apps/details?id=com.catalogueya.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-start gap-[clamp(0.5rem,1vw,0.8rem)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>

            <img
              src={playStoreIcon}
              alt="Google Play"
              className="relative h-[clamp(28px,2.5vw,40px)] w-auto rounded-full border border-gray-200/80 bg-white p-[clamp(4px,0.6vw,8px)] shadow-sm group-hover:shadow-md group-hover:border-gray-300/80 transition-all duration-300"
            />
          </div>

          <span className="text-gray-700 font-medium tracking-tight text-[clamp(13px,1vw,15px)] group-hover:text-gray-900 transition-colors duration-300">
            Google Play
          </span>
        </a>

      </div>

  {/* VERIFIED TEXT */}
<div className="relative mt-[clamp(1.2rem,2vw,2rem)] flex items-center justify-center gap-2">
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[clamp(40px,6vw,60px)] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
  </div>

  <p className="relative px-3 text-center text-gray-400 text-[clamp(9px,0.8vw,11px)] font-light bg-white/90 ">
    {fw.verified_home_services_products}
  </p>
</div>

    </div>
  </div>
</div>
</div>
      </div>
    </section>
  );
};

export default AppDescribingSection;