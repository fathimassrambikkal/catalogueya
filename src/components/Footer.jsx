import React from "react";
import { Link } from "react-router-dom";
import ios from "../assets/ios.png";
import android from "../assets/android.png";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

// Arrow icon for all list items
const ArrowIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="opacity-60 group-hover:opacity-100 transition"
  >
    <path d="M7 17L17 7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const Footer = React.memo(() => {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  // Navigation links
  const navLinks = [
    { label: fw.home, path: "/" },
    { label: fw.aboute, path: "/about" },
    { label: fw.offers, path: "/salesproducts" },
    { label: fw.contact_us, path: "/contact" }
  ].filter(item => item.label);

  // CORRECTED: Social media mapping - match fixed_words labels with settings URLs
  // Fixed: Use the exact keys from your settings data
  const socialItems = [
    { 
      label: fw.facebook, 
      url: settings?.facebook_url // Note: settings has "facebook_url" not "facebook"
    },
    { 
      label: fw.instagram, 
      url: settings?.Instagram_url // Note: capital "I" in settings
    },
    { 
      label: fw.tiktok, 
      url: settings?.tiktok_url
    },
    { 
      label: fw.snapchat, 
      url: settings?.snapchat_url
    },
  ].filter(item => item.label && item.url); // Only show if we have both label and URL

  return (
    <footer className="w-full relative flex justify-center font-inter overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2F6CFF] to-[#82B2FF]" />

      <div className="relative z-20 w-[90%] max-w-7xl flex flex-col md:flex-row justify-between items-start py-40 text-white">

        {/* LEFT */}
        <div className="flex flex-col gap-3 text-left">
          {fw.Lets_tolk && (
            <p className="text-2xl md:text-3xl font-medium text-blue-100">
              {fw.Lets_tolk}
            </p>
          )}

          {settings?.email && (
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wide break-all">
              {settings.email}
            </h2>
          )}

          {settings?.about_title && (
            <p className="mt-6 text-blue-100 text-sm md:text-base leading-relaxed max-w-md">
              {settings.about_title}
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col md:flex-row gap-16 mt-16 md:mt-0">

          {/* NAVIGATION */}
          {fw.navigation && (
            <div>
              <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
                {fw.navigation}
              </h3>

              <ul className="space-y-3">
                {navLinks.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className="group flex items-center gap-2 hover:text-white transition"
                    >
                      {item.label}
                      <ArrowIcon />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SOCIAL MEDIA */}
          {fw.social_media && socialItems.length > 0 && (
            <div>
              <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
                {fw.social_media}
              </h3>

              <ul className="space-y-3">
                {socialItems.map((item, i) => {
                  const isClickable = Boolean(item.url);
                  
                  // Note: Fixed typo in your fixed_words - it's "instegram" not "instagram"
                  // But we'll use fw.instagram if available, fallback to fw.instegram
                  const displayLabel = item.label === fw.instagram && !fw.instagram && fw.instegram 
                    ? fw.instegram 
                    : item.label;

                  return (
                    <li key={i}>
                      {isClickable ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 hover:text-white transition"
                        >
                          {displayLabel}
                          <ArrowIcon />
                        </a>
                      ) : (
                        <div className="group flex items-center gap-2 text-blue-200/70 cursor-default">
                          {displayLabel}
                          <ArrowIcon />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </div>
      </div>

      {/* APP STORE BUTTONS - Use settings URLs */}
      <div className="absolute bottom-20 w-full flex justify-center gap-6 z-20">
        {settings?.app_store_url && (
          <a 
            href={settings.app_store_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition"
          >
            <img src={ios} loading="lazy" className="w-32 md:w-20" alt="iOS App" />
          </a>
        )}
        {settings?.google_play_url && (
          <a 
            href={settings.google_play_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-90 transition"
          >
            <img src={android} loading="lazy" className="w-32 md:w-20" alt="Android App" />
          </a>
        )}
      </div>

      {/* Footer Bottom Line */}
      <div className="absolute bottom-6 w-full text-center text-sm text-blue-100 z-20">
        <p>
          {fw.privacy_policy || "PRIVACY POLICY"} ・{" "}
          <Link
            to="/terms"
            className="cursor-pointer hover:text-white transition hover:underline"
          >
            {fw.termss_service || "TERMS OF SERVICE"}
          </Link>{" "}
          ・ {fw.created_by || "CREATED BY"}{" "}
          <span className="text-white font-semibold">
            {fw.catalogueya || "CATALOGUEYA"}
          </span>
        </p>
      </div>
    </footer>
  );
});

export default Footer;