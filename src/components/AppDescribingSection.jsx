import React from "react";
import mobileImage from "../assets/mobile.avif"; 
import appStoreIcon from "../assets/ios.png";
import playStoreIcon from "../assets/android.png";
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
  className="relative w-full overflow-hidden py-5 sm:py-5 md:py-20 lg:py-24"
>
      {/* Subtle animated glass background ornament */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>

      <div className="mx-auto  px-4 sm:px-6 lg:px-16">
        {/* Mobile/Tablet layout (stacked with large gaps) */}
        <div className="flex flex-col lg:hidden space-y-16 sm:space-y-20 md:space-y-24 ">
          {/* Left Column – Text */}
          <div className="flex flex-col space-y-4 text-center   ">
           <h1
  className={`text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl md:text-5xl ${
    isRTL
      ? "leading-[1.5] sm:leading-[1.5] md:leading-[1.5]"
      : "leading-[1.4] sm:leading-[1.45] md:leading-[1.5]"
  }`}
>
              <span className="block">{fw.qatar_first}</span>
              <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                {fw.verified_services}
              </span>
             
              <span className="block text-slate-900 ">{fw.products_platform}</span>
            </h1>
            <p className="max-w-md mx-auto text-base text-slate-600 sm:text-lg">
             {fw.all_services_and_products}
            </p>
          </div>

          {/* Center Column – 3 Mobile Images */}
          <div className="flex justify-center">
            <div className="relative flex h-[280px] w-full max-w-[420px] items-center justify-center sm:h-[320px] md:h-[360px]">
              {/* Image 1 (left) */}
              <div className="absolute left-0 top-1/2 z-0 w-[45%] -translate-y-1/2 rotate-[-6deg] transform-gpu transition-all duration-300 hover:z-30 hover:rotate-[-4deg] hover:scale-105">
                <div className="glass-deep overflow-hidden rounded-[2rem] shadow-2xl backdrop-blur-md backdrop-saturate-150">
                  <img
                    src={appLeft}
                    alt="App home screen"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Image 2 (center) */}
              <div className="absolute left-1/2 top-1/2 z-20 w-[52%] -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-300 hover:z-30 hover:scale-105">
                <div className="glass-primary overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-white/50 backdrop-blur-md backdrop-saturate-200">
                  <img
                    src={appCenter}
                    alt="App main features"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              {/* Image 3 (right) */}
              <div className="absolute right-0 top-1/2 z-0 w-[45%] -translate-y-1/2 rotate-[6deg] transform-gpu transition-all duration-300 hover:z-30 hover:rotate-[4deg] hover:scale-105">
                <div className="glass-deep overflow-hidden rounded-[2rem] shadow-2xl backdrop-blur-md backdrop-saturate-150">
                  <img
                    src={appRight}
                    alt="App services screen"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* subtle floating glow */}
              <div className="absolute -inset-4 -z-10 rounded-full bg-blue-200/20 blur-3xl"></div>
            </div>
          </div>

          {/* Right Column – Download App */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[260px] rounded-3xl border-2 border-gray-200/60 bg-white/5 p-[1px]">
              {/* Main Glass Panel */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl bg-white p-5 shadow-sm border border-white/60">
                <div className="rounded-3xl bg-white/20 p-5 backdrop-blur-xl border border-white/30">
                  
                  <h3 className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 mb-4">
                    {fw.download_app}
                  </h3>

                  <div className="space-y-2.5">
                    {/* App Store */}
                    <a 
                      href="https://apps.apple.com/qa/app/catalogueya/id6757309240"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/30 p-2.5 transition-all duration-200 hover:bg-white/40 active:scale-[0.98]"
                    >
                      <img src={appStoreIcon} alt=""  className="w-32 sm:w-32 md:w-full h-auto" />
 
                    </a>

                    {/* Google Play */}
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.catalogueya.app&pcampaignid=web_share"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/30 p-2.5 transition-all duration-200 hover:bg-white/40 active:scale-[0.98]"
                    >
                      <img src={playStoreIcon} alt=""  className="w-32 sm:w-32 md:w-full h-auto" />
     
                    </a>
                  </div>

                  <p className="text-center text-[9px] text-gray-400/80 mt-4">
                    {fw.verified_by_qatar}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column – Text */}
          <div
  className={`flex flex-col space-y-4 text-center lg:col-span-4 ${
    isRTL ? "lg:text-right" : "lg:text-left"
  }`}
>
 <h1
  className={`text-2xl font-medium tracking-tighter text-slate-900 sm:text-3xl md:text-4xl ${
    isRTL
      ? "leading-[1.2] sm:leading-[1.45] md:leading-[1.25]"
      : "leading-[1.2] sm:leading-[1.45] md:leading-[1.25]"
  }`}
>
  <span className="block">{fw.qatar_first}</span>

  {fw.verified_services && (
    <>
      {/* verified home services */}
      <span className="block bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
        {fw.verified_services.split("services")[0]}services
      </span>

      {/* & products platform */}
      <span className="block">
        <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          {fw.verified_services.split("services")[1]}
        </span>{" "}
        <span className="text-slate-900">{fw.products_platform}</span>
      </span>
    </>
  )}
</h1>
            <p className="max-w-md text-base text-slate-600 sm:text-lg lg:max-w-sm xl:max-w-md">
             {fw.all_services_and_products}
            </p>
          </div>

          {/* Center Column – 3 Mobile Images */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative flex h-[280px] w-full max-w-[420px] items-center justify-center sm:h-[320px] md:h-[360px] lg:h-[400px]">
              {/* Image 1 (left) */}
              <div className="absolute left-0 top-1/2 z-0 w-[45%] -translate-y-1/2 rotate-[-6deg] transform-gpu transition-all duration-300 hover:z-30 hover:rotate-[-4deg] hover:scale-105">
                <div className="glass-deep overflow-hidden rounded-[2rem] shadow-2xl backdrop-blur-md backdrop-saturate-150">
                  <img
                    src={appLeft}
                    alt="App home screen"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Image 2 (center) */}
              <div className="absolute left-1/2 top-1/2 z-20 w-[52%] -translate-x-1/2 -translate-y-1/2 transform-gpu transition-all duration-300 hover:z-30 hover:scale-105">
                <div className=" glass-deep overflow-hidden rounded-[2rem] shadow-2xl backdrop-blur-md backdrop-saturate-150   ">
                  <img
                    src={appCenter}
                    alt="App main features"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>

              {/* Image 3 (right) */}
              <div className="absolute right-0 top-1/2 z-0 w-[45%] -translate-y-1/2 rotate-[6deg] transform-gpu transition-all duration-300 hover:z-30 hover:rotate-[4deg] hover:scale-105">
                <div className="glass-deep overflow-hidden rounded-[2rem] shadow-2xl backdrop-blur-md backdrop-saturate-150">
                  <img
                   src={appRight}
                    alt="App services screen"
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* subtle floating glow */}
              <div className="absolute -inset-4 -z-10 rounded-full bg-blue-200/20 blur-3xl"></div>
            </div>
          </div>

          {/* Right Column – Download App */}
          <div className="flex justify-center lg:col-span-3">
            <div className="relative w-full max-w-[260px] rounded-3xl border-2 border-gray-200/60 bg-white/5 p-[1px]">
              {/* Main Glass Panel */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl bg-white p-5 shadow-sm border border-white/60">
                <div className="rounded-3xl bg-white/20 p-5 backdrop-blur-xl border border-white/30">
                  
                  <h3 className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 mb-4">
                    {fw.download_app}
                  </h3>

                  <div className="space-y-2.5">
                    {/* App Store */}
                    <a 
                      href="https://apps.apple.com/qa/app/catalogueya/id6757309240"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/30 p-2.5 transition-all duration-200 hover:bg-white/40 active:scale-[0.98]"
                    >
                      <img src={appStoreIcon} alt=""  className="w-32 sm:w-32 md:w-full h-auto" />
                   
                    </a>

                    {/* Google Play */}
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.catalogueya.app&pcampaignid=web_share"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/30 p-2.5 transition-all duration-200 hover:bg-white/40 active:scale-[0.98]"
                    >
                      <img src={playStoreIcon} alt=""  className="w-32 sm:w-32 md:w-full h-auto"/>
                     
                    </a>
                  </div>

                  <p className="text-center text-[9px] text-gray-400/80 mt-4">
                    {fw.verified_by_qatar}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline styles for glass effects */}
      <style >{`
        .glass-primary {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px) saturate(180%);
        }
        .glass-deep {
          background: rgba(255, 255, 255, 0.2);
          box-shadow: 0 25px 40px -16px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(20px) saturate(200%);
        }
      `}</style>
    </section>
  );
};

export default AppDescribingSection;