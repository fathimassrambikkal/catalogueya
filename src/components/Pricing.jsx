import React, { useState, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscribeDetails } from "../api";

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("Core Management");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);

  const tabs = ["Core Management", "Sales & Promotions", "Insight & Support"];

  const content = {
    "Core Management": [
      { feature: "Unlimited Uploads", benefit: "Host unlimited product images & videos" },
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
    "Sales & Promotions": [
      {
        feature: "Easily Add Sale Products",
        benefit:
          "Quickly showcase discounted or promotional products with just one click",
      },
    ],
    "Insight & Support": [
      { feature: "Performance Analytics", benefit: "Track clicks and view detailed product insights" },
      { feature: "Customer Reviews", benefit: "Collect and display genuine feedback to build trust" },
      { feature: "24/7 Support", benefit: "Round-the-clock customer assistance for reliability" },
    ],
  };

  const monthlyPrice = subscriptionDetails?.monthlyPrice || 350;
  const yearlyPrice = subscriptionDetails?.yearlyPrice || 3200;

  // Auto-switch tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch subscription details from API
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await getSubscribeDetails();
        if (res?.data) setSubscriptionDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription details:", err);
      }
    };
    fetchSubscription();
  }, []);

  return (
    <section className="bg-neutral-100 py-20 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center relative overflow-hidden">
      {/* ===== Header ===== */}
      <div className="flex flex-col items-center justify-center mb-8 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-4 text-center">
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
            className={`relative w-14 h-7 rounded-full transition-colors duration-500 ${
              billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
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

        {/* ===== Price Display ===== */}
        <motion.div
          key={billingCycle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-4 flex flex-col items-center"
        >
          {billingCycle === "monthly" ? (
            <>
              <h2 className="text-2xl font-bold text-blue-600">{monthlyPrice} QAR</h2>
              <p className="text-sm text-gray-500 mt-1">per month</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2 flex-wrap">
                <span className="line-through text-gray-400">{4200} QAR</span>
                {yearlyPrice} QAR
              </h2>
              <p className="text-sm text-gray-500 mt-1">per year (Save 1000 QAR!)</p>
            </>
          )}
        </motion.div>
      </div>

      {/* ===== Title ===== */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center">
        Benefits of Subscription
      </h2>

      {/* ===== Tabs ===== */}
      <div className="flex items-center justify-center gap-2 mb-4 bg-white/70 rounded-3xl md:rounded-full p-2 md:p-3 shadow-sm backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px] text-center px-5 sm:px-6 py-2 rounded-full text-[10px] sm:text-[11px] md:text-base font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:scale-105"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===== Main Card ===== */}
      <motion.div
        key={activeTab + "-container"}
        className="bg-gradient-to-b from-[#E8E6FF] via-[#FFFCFF] to-[#FFFCFF] w-full max-w-6xl border border-gray-100 shadow-xl rounded-3xl p-10 md:p-16 backdrop-blur-lg flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 50, damping: 22 }}
      >
        {/* ===== LEFT CONTENT ===== */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {activeTab.toUpperCase()}
          </span>

          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            {activeTab === "Core Management" &&
              "Manage your entire product catalog easily"}
            {activeTab === "Sales & Promotions" &&
              "Boost visibility with sales and deals"}
            {activeTab === "Insight & Support" &&
              "Get insights and build customer trust"}
          </h3>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            {activeTab === "Core Management" &&
              "Company profiles will be in both languages."}
            {activeTab === "Sales & Promotions" &&
              "Showcase your best deals instantly and draw customer attention to promotional sections with ease."}
            {activeTab === "Insight & Support" &&
              "Track performance metrics, collect real customer reviews, and offer 24/7 assistance to keep your business trusted and efficient."}
          </p>
        </div>

        {/* ===== RIGHT CARD ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            className="w-full md:w-1/2 bg-white text-gray-900 rounded-3xl p-8 shadow-lg"
          >
            <ul className="space-y-5">
              {subscriptionDetails?.[activeTab]?.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex gap-3 items-start"
                >
                  <IoCheckmark className="mt-1 text-xl text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-700 text-sm md:text-base">
                      {item.feature}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">{item.benefit}</p>
                  </div>
                </motion.li>
              ))}

              {/* Fallback content if API data is empty */}
              {(!subscriptionDetails?.[activeTab] || subscriptionDetails[activeTab].length === 0) &&
                content[activeTab].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-3 items-start"
                  >
                    <IoCheckmark className="mt-1 text-xl text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-700 text-sm md:text-base">
                        {item.feature}
                      </p>
                      <p className="text-gray-500 text-xs md:text-sm">{item.benefit}</p>
                    </div>
                  </motion.li>
                ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Pricing;
