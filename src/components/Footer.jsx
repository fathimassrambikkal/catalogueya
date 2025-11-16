import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";
import { HiArrowUpRight } from "react-icons/hi2";
import ios from "../assets/ios.png";
import android from "../assets/android.png";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Offers", path: "/salesproducts" },
  { name: "Contact", path: "/contact" },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/share/1BGBgzNm9d/?mibextid=wwXIfr",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    url: "https://www.instagram.com/catalogueya.qa?igsh=b3k0MGY5Z21la3Bz",
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com/@catalogueya.qa?lang=en-GB&is_from_webapp=1&sender_device=mobile&sender_web_id=7569663066179307016",
  },
  {
    name: "Snapchat",
    icon: <FaSnapchatGhost />,
    url: "https://snapchat.com/t/2LvJi7m4",
  },
];

const Footer = React.memo(() => {
  return (
    <footer className="w-full relative flex justify-center font-inter overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#2F6CFF] to-[#82B2FF]" />

      {/* Main Footer Content */}
      <div className="relative z-20 w-[90%] max-w-7xl flex flex-col md:flex-row justify-between items-start py-40 text-white">
        {/* Left Section - Contact */}
        <div className="flex flex-col gap-3 text-left">
          <p className="text-2xl md:text-3xl font-medium text-blue-100">Let's Talk</p>
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
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-3 text-base text-blue-100">
              {navLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 hover:text-white transition-transform transform-gpu"
                  >
                    {item.name} <HiArrowUpRight className="text-sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg text-blue-100 mb-4 uppercase tracking-wider">Social Media</h3>
            <ul className="space-y-3 text-base text-blue-100">
              {socialLinks.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-transform transform-gpu"
                  >
                    {s.icon} {s.name} <HiArrowUpRight className="text-sm" />
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
          PRIVACY POLICY ・ TERMS OF SERVICE ・ CREATED BY{" "}
          <span className="text-white font-semibold">CATALOGUEYA</span>
        </p>
      </div>
    </footer>
  );
});

export default Footer;
