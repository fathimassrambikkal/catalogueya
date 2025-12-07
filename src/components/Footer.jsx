import React from "react";
import { Link } from "react-router-dom";
import ios from "../assets/ios.png";
import android from "../assets/android.png";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";

const Footer = React.memo(() => {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();

  const navLinks = [
    { name: fixedWords?.home || "Home", path: "/" },
    { name: fixedWords?.about || "About", path: "/about" },
    { name: fixedWords?.offers || "Offers", path: "/salesproducts" },
    { name: fixedWords?.contact || "Contact", path: "/contact" },
  ];

  const socialLinks = [
    {
      name: fixedWords?.facebook || "Facebook",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      ),
      url: settings?.facebook || "https://www.facebook.com/share/1BGBgzNm9d/?mibextid=wwXIfr",
    },
    {
      name: fixedWords?.instagram || "Instagram",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      ),
      url: settings?.instagram || "https://www.instagram.com/catalogueya.qa?igsh=b3k0MGY5Z21la3Bz",
    },
    {
      name: fixedWords?.tiktok || "TikTok",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
      ),
      url: settings?.tiktok || "https://www.tiktok.com/@catalogueya.qa",
    },
    {
      name: fixedWords?.snapchat || "Snapchat",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5.83 9.81c-2.12 2.13-2.3 5.78-.42 7.67 1.88 1.88 5.54 1.7 7.66-.42 2.13-2.12 2.3-5.78.42-7.67-1.88-1.89-5.54-1.7-7.66.42zM11.7 12.23a.63.63 0 00-.45.38.63.63 0 01-1.16-.01.63.63 0 00-1.15.5c.08.34.35.6.67.67a.63.63 0 01-.01 1.16.63.63 0 00.5 1.15c.34-.08.6-.35.67-.67a.63.63 0 011.16.01.63.63 0 001.15-.5.63.63 0 01.01-1.16.63.63 0 00-.5-1.15c-.34.08-.6.35-.67.67a.63.63 0 01-1.16-.01.63.63 0 00-.67-.67zm8.94-5.06c-2.12-2.13-5.78-2.3-7.67-.42-1.88 1.88-1.7 5.54.42 7.66 2.12 2.13 5.78 2.3 7.67.42 1.88-1.88 1.7-5.54-.42-7.66zm-3.63 3.64a.63.63 0 00-.45.38.63.63 0 01-1.16-.01.63.63 0 00-1.15.5c.08.34.35.6.67.67a.63.63 0 01-.01 1.16.63.63 0 00.5 1.15c.34-.08.6-.35.67-.67a.63.63 0 011.16.01.63.63 0 001.15-.5.63.63 0 01.01-1.16.63.63 0 00-.5-1.15c-.34.08-.6.35-.67.67a.63.63 0 01-1.16-.01.63.63 0 00-.67-.67z" />
        </svg>
      ),
      url: settings?.snapchat || "https://snapchat.com/t/2LvJi7m4",
    },
  ];

  return (
    <footer className="w-full relative flex justify-center font-inter overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2F6CFF] to-[#82B2FF]" />

      {/* Main Footer Content */}
      <div className="relative z-20 w-[90%] max-w-7xl flex flex-col md:flex-row justify-between items-start py-40 text-white">
        {/* Left Section - Contact */}
        <div className="flex flex-col gap-3 text-left">
          <p className="text-2xl md:text-3xl font-medium text-blue-100">
            {fixedWords?.lets_talk || "Let's Talk"}
          </p>

          <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-white tracking-wide break-all">
            {settings?.email || "ux@catalogueya.com"}
          </h2>

          <p className="mt-6 text-blue-100 text-sm md:text-base leading-relaxed max-w-md">
            {settings?.about_us ||
              "We're here to help you grow your brand. Get in touch for partnerships, collaborations, or support."}
          </p>
        </div>

        {/* Right Section - Navigation + Socials */}
        <div className="flex flex-col md:flex-row gap-16 mt-16 md:mt-0">
          {/* Navigation */}
          <div>
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
              {fixedWords?.navigation || "Navigation"}
            </h3>
            <ul className="space-y-3 text-base text-blue-100">
              {navLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-white transition-transform transform-gpu"
                  >
                    {item.name}
                    {/* Arrow Up Right SVG */}
                    <svg className="w-4 h-4 text-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
              {fixedWords?.social_media || "Social Media"}
            </h3>

            <ul className="space-y-3 text-base text-blue-100">
              {socialLinks.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-transform transform-gpu"
                  >
                    {s.icon} {s.name}
                    {/* Arrow Up Right SVG */}
                    <svg className="w-4 h-4 text-sm" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* App Store Icons */}
      <div className="absolute bottom-20 w-full flex justify-center gap-6 z-20">
        <img
          src={ios}
          alt="Download on iOS"
          loading="lazy"
          className="w-32 md:w-20 hover:scale-105 transition-transform duration-300 transform-gpu"
        />
        <img
          src={android}
          alt="Get it on Android"
          loading="lazy"
          className="w-32 md:w-20 hover:scale-105 transition-transform duration-300 transform-gpu"
        />
      </div>

      {/* Footer Bottom Line */}
      <div className="absolute bottom-6 w-full text-center text-sm text-blue-100 z-20">
        <p>
          PRIVACY POLICY ・{" "}
          <span
            onClick={() => window.location.href = "/terms"}
            className="cursor-pointer  hover:text-white transition hover:underline"
          >
            TERMS OF SERVICE
          </span>{" "}
          ・ CREATED BY{" "}
          <span className="text-white font-semibold">CATALOGUEYA</span>
        </p>
      </div>
    </footer>
  );
});

export default Footer;