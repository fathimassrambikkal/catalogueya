import React, { useState, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("Core Management");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const tabs = [
    "Core Management",
    "Sales and Promotions",
    "Insight and Support",
  ];

  const content = {
    "Core Management": [
      {
        feature: "Unlimited Uploads",
        benefit: "Host unlimited product images & videos",
      },
      {
        feature: "Product Tagging & Badges",
        benefit:
          "Highlight items with Sales, New Arrivals, limited editions, or out of stock status",
      },
      {
        feature: "Direct WhatsApp Integration",
        benefit:
          "Instant communication for inquiries from your customers directly via WhatsApp",
      },
    ],
    "Sales and Promotions": [
      {
        feature: "Easily Add Sale Products",
        benefit:
          "Quickly showcase discounted or promotional products with just one click",
      },
    ],
    "Insight and Support": [
      {
        feature: "Performance Analytics",
        benefit: "Track clicks and view detailed product insights",
      },
      {
        feature: "Customer Reviews",
        benefit: "Collect and display genuine feedback to build trust",
      },
      {
        feature: "24/7 Support",
        benefit: "Round-the-clock customer assistance for reliability",
      },
    ],
  };

  const monthlyPrice = 500;
  const yearlyPrice = 3800;

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 py-20 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center justify-center relative overflow-hidden">
      {/* ===== Header ===== */}
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-4">
          Simple Pricing
        </h1>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-sm font-medium ${
              billingCycle === "monthly" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")
            }
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md ${
                billingCycle === "yearly" ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              billingCycle === "yearly" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Yearly
          </span>
        </div>
      </div>

      {/* ===== Title: Benefits of Subscription ===== */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
        Benefits of Subscription
      </h2>

      {/* ===== Tabs ===== */}
      <div
        className="
          flex 
          flex-col 
          md:flex-row 
          items-center 
          justify-center 
          gap-3 
          mb-10 
          bg-white/70 md:bg-white/70 
          rounded-3xl md:rounded-full  
          p-3 md:p-3 
          shadow-sm 
          backdrop-blur
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full md:w-auto text-center px-6 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===== Animated Big Card ===== */}
      <motion.div
        key={activeTab + "-container"}
        className="bg-gradient-to-b from-[#E8E6FF] via-[#FFFCFF] to-[#FFFCFF] w-full max-w-6xl border border-gray-100 shadow-xl rounded-3xl p-10 md:p-16 backdrop-blur-lg flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      >
        {/* LEFT TEXT */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {activeTab.toUpperCase()}
          </span>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            {activeTab === "Core Management" &&
              "Manage your entire product catalog easily"}
            {activeTab === "Sales and Promotions" &&
              "Boost visibility with sales and deals"}
            {activeTab === "Insight and Support" &&
              "Get insights and build customer trust"}
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {activeTab === "Core Management" &&
              "Company profiles will be in both languages."}
            {activeTab === "Sales and Promotions" &&
              "Showcase your best deals instantly and draw customer attention to promotional sections with ease."}
            {activeTab === "Insight and Support" &&
              "Track performance metrics, collect real customer reviews, and offer 24/7 assistance to keep your business trusted and efficient."}
          </p>
        </div>

        {/* RIGHT CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + billingCycle}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="w-full md:w-1/2 bg-white text-gray-900 rounded-3xl p-8 shadow-lg flex flex-col justify-between"
          >
            <div>
              <ul className="space-y-5">
                {content[activeTab].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 items-start"
                  >
                    <IoCheckmark className="mt-1 text-xl text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        {item.feature}
                      </p>
                      <p className="text-gray-500 text-xs md:text-sm">
                        {item.benefit}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* PRICE */}
            <motion.div
              key={billingCycle}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left mt-8"
            >
              <h4 className="text-3xl font-bold text-blue-600">
                {billingCycle === "monthly"
                  ? `${monthlyPrice} QAR`
                  : `${yearlyPrice} QAR`}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                {billingCycle === "monthly" ? "per month" : "per year"}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Pricing;
