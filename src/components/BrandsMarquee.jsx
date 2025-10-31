import React from "react";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.png";
import logo5 from "../assets/logo5.png";
import logo6 from "../assets/logo6.png";

const logos = [logo1, logo2, logo3, logo4, logo5, logo6];

export default function BrandsMarquee() {
  return (
    <section className="py-12 bg-gray-50 relative overflow-hidden">
      {/* Left & Right masking/fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>

      {/* Marquee container */}
      <div className="overflow-hidden">
        <div className="flex animate-marquee gap-12">
          {/* Repeat logos twice for smooth infinite scroll */}
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="flex-shrink-0 w-40 h-24 flex items-center justify-center">
              <img src={logo} alt={`logo-${index}`} className="max-h-full object-contain" loading="lazy"/>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee animation */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-marquee {
            display: flex;
            gap: 3rem;
            animation: marquee 20s linear infinite;
          }
        `}
      </style>
    </section>
  );
}
