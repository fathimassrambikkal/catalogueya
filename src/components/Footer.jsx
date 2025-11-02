import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
// import Iridescence from "../ui/Iridescence"; // 📴 Temporarily disabled

import ios from "../assets/ios.png";
import android from "../assets/android.png";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center font-inter relative overflow-hidden ">
      {/* 🌈 Gradient Background (Static) */}
      <div className="absolute inset-0 z-0">
        {/* Base Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2F6CFF] to-[#82B2FF]" />
        
        {/* Iridescence Animation (Commented Out)
        <div className="absolute inset-0 opacity-40">
          <Iridescence
            color={[0.529, 0.808, 0.922]}
            amplitude={0.1}
            speed={0.3}
            mouseReact={false}
          />
        </div>
        */}
      </div>

      {/* 🌟 Main Footer Content */}
      <div className="relative z-20 w-[90%] max-w-7xl flex flex-col md:flex-row justify-between items-start py-40 text-white">
        {/* Left Section - Contact */}
        <div className="flex flex-col gap-3 text-left">
          <p className="text-2xl md:text-3xl font-medium text-blue-100">
            Let's Talk
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-white tracking-wide break-all">
            ux@catalogueya.com
          </h2>

          <p className="mt-6 text-blue-100 text-sm md:text-base leading-relaxed max-w-md">
            We’re here to help you grow your brand. Get in touch for partnerships,
            collaborations, or support.
          </p>
        </div>

        {/* Right Section - Navigation + Socials */}
        <div className="flex flex-col md:flex-row gap-16 mt-16 md:mt-0">
          {/* Navigation */}
          <div>
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-3 text-base text-blue-100">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Offers", path: "/offers" },
                { name: "Contact", path: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-white transition-all"
                  >
                    {item.name} <HiArrowUpRight className="text-sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">
              Social Media
            </h3>
            <ul className="space-y-3 text-base text-blue-100">
              {[
                {
                  name: "Twitter",
                  icon: <FaTwitter />,
                  url: "https://twitter.com/",
                },
                {
                  name: "LinkedIn",
                  icon: <FaLinkedinIn />,
                  url: "https://linkedin.com/",
                },
                {
                  name: "Instagram",
                  icon: <FaInstagram />,
                  url: "https://instagram.com/",
                },
              ].map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-all"
                  >
                    {s.icon} {s.name} <HiArrowUpRight className="text-sm" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 📱 App Store Icons Section */}
      <div className="absolute bottom-20 w-full flex justify-center gap-6 z-20">
        <img
          src={ios}
          alt="Download on iOS"
          className="w-32 md:w-20 hover:scale-105 transition-transform duration-300"
        />
        <img
          src={android}
          alt="Get it on Android"
          className="w-32 md:w-20 hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Footer Bottom Line */}
      <div className="absolute bottom-6 w-full text-center text-sm text-blue-100 z-20">
        <p>
          PRIVACY POLICY ・ TERMS OF SERVICE ・ CREATED BY{" "}
          <span className="text-white font-semibold">CATALOGUEYA</span>
        </p>
      </div>
    </footer>
  );
}
