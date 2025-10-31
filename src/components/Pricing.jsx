import React from "react";
import { IoCheckmark } from "react-icons/io5";
import {
  PiCirclesThreeBold,
  PiCirclesFour,
  PiCirclesThreePlusBold,
} from "react-icons/pi";

function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$39",
      desc: "Great for individuals starting small. Ideal for personal projects and small teams.",
      icon: (
        <PiCirclesThreeBold className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl bg-white border-2 border-gray-50 p-2 rounded-xl text-blue-500 shadow-md" />
      ),
      btnText: "Try Basic",
      features: [
        "2 GB Image Storage",
        "No Video Storage",
        "Basic Views Counter",
        "Email Support",
        "No Offer Visibility",
      ],
      buttonStyle:
        "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50",
    },
    {
      name: "Standard",
      price: "$99",
      desc: "Perfect balance for growing teams. Includes priority support and analytics.",
      icon: (
        <PiCirclesFour className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl bg-white border-2 border-gray-50 p-2 rounded-xl text-blue-500 shadow-lg" />
      ),
      topGradient:
        "bg-gradient-to-b from-lavender via-[#FFFCFF] to-[#FFFCFF] shadow-lg",
      btnText: "Try Standard",
      features: [
        "10 GB Image Storage",
        "10 hours (3 GB) Video Storage",
        "Advanced Analytics (Views, Clicks)",
        "2 Photo Sessions (3 hrs each)",
        "Priority Chat & Email Support",
      ],
      buttonStyle: "bg-blue-500 text-white hover:bg-blue-600",
    },
    {
      name: "Premium",
      price: "$299",
      desc: "Designed for pros who demand more. Full access to all features and support.",
      icon: (
        <PiCirclesThreePlusBold className="text-3xl sm:text-3xl md:text-3xl lg:text-4xl bg-white border-2 border-gray-50 p-2 rounded-xl text-blue-500 shadow-md" />
      ),
      btnText: "Try Premium",
      features: [
        "50 GB Image Storage",
        "20 hours (5 GB) Video Storage",
        "Advanced Analytics (Views, Clicks)",
        "4 Photo Sessions (3 hrs each)",
        "Priority Chat & Email Support",
      ],
      buttonStyle:
        "bg-white text-blue-500 border border-blue-500 hover:bg-blue-50",
    },
  ];

  return (
    <section
      id="pricing"
      className="flex flex-col items-center justify-center bg-gray-50 py-20 px-4 sm:px-6 md:px-10 lg:px-20 font-inter"
    >
      {/* Heading Section */}
      <div className="text-center mb-14 max-w-3xl">
     

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 leading-tighter">
          Simple pricing
        </h1>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col border p-4 md:p-3 lg:p-5 rounded-3xl shadow-md gap-2 transition-all duration-300 
              ${plan.name === "Standard" ? "bg-gray-50" : "bg-white"} 
              hover:shadow-lg w-full max-w-sm mx-auto md:max-w-none`}
          >
            {/* Top Section */}
            <div
              className={`flex flex-col justify-start py-4 px-4 space-y-2 rounded-2xl ${
                plan.topGradient ? plan.topGradient : "bg-gray-50"
              }`}
            >
              {plan.icon}
              <h4 className="text-base md:text-lg font-semibold text-gray-800">
                {plan.name}
              </h4>
              <p className="text-gray-600 text-xs leading-snug">{plan.desc}</p>
              <h4 className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-semibold text-black">
                  {plan.price}
                </span>
                <span className="text-xs text-gray-700">/Month</span>
              </h4>
            </div>

            {/* Features */}
            <ul className="flex-1 text-gray-700 space-y-1 text-xs px-4 py-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <IoCheckmark className="text-blue-500 w-4 h-4" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <div className="px-4 pb-4">
              <button
                className={`rounded-full font-medium px-5 py-2 w-full transition text-xs md:text-sm ${plan.buttonStyle}`}
              >
                {plan.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
