import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IoCheckmark, IoChevronForward } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { getSubscribeDetails } from "../api";
import { useTranslation } from "react-i18next"; // Add this import

let preloadedSubscription = null;

(async () => {
  try {
    const res = await getSubscribeDetails();
    preloadedSubscription = res?.data || null;
  } catch (err) {
    console.warn("Pre-fetch subscription failed:", err);
  }
})();

const Pricing = () => {
  const [activeTab, setActiveTab] = useState("Core Management");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscriptionDetails, setSubscriptionDetails] = useState(preloadedSubscription || []);
  const [isLoading, setIsLoading] = useState(!preloadedSubscription);
  const { i18n } = useTranslation(); // Add this hook

  // Memoize static tabs and fallback content
  const tabs = useMemo(() => ["Core Management", "Sales & Promotions", "Insight & Support"], []);
  
  const content = useMemo(() => ({
    "Core Management": [
      { feature: "Unlimited Uploads", benefit: "Host unlimited product images & videos" },
      { feature: "Product Tagging & Badges", benefit: "Highlight items with Sales, New Arrivals, limited editions, or out of stock status" },
      { feature: "Direct WhatsApp Integration", benefit: "Instant communication for inquiries from your customers directly via WhatsApp" },
    ],
    "Sales & Promotions": [
      { feature: "Easily Add Sale Products", benefit: "Quickly showcase discounted or promotional products with just one click" },
    ],
    "Insight & Support": [
      { feature: "Performance Analytics", benefit: "Track clicks and view detailed product insights" },
      { feature: "Customer Reviews", benefit: "Collect and display genuine feedback to build trust" },
      { feature: "24/7 Support", benefit: "Round-the-clock customer assistance for reliability" },
    ],
  }), []);

  // Auto-switch tabs with optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = tabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [tabs]);

  // Fetch subscription details from API with preload
  useEffect(() => {
    if (preloadedSubscription) {
      setSubscriptionDetails(preloadedSubscription);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const fetchSubscription = async () => {
      try {
        const res = await getSubscribeDetails();
        if (!mounted) return;
        if (res?.data) {
          setSubscriptionDetails(res.data);
          preloadedSubscription = res.data;
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch subscription details:", err);
        setIsLoading(false);
      }
    };
    fetchSubscription();
    return () => { mounted = false; };
  }, []);

  // Memoized price calculations
  const monthlyPrice = useMemo(() => 
    subscriptionDetails?.monthlyPrice || 350, 
    [subscriptionDetails]
  );
  
  const yearlyPrice = useMemo(() => 
    subscriptionDetails?.yearlyPrice || 3200, 
    [subscriptionDetails]
  );

  // Optimized billing cycle toggle
  const handleBillingToggle = useCallback(() => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  }, []);

  // Optimized tab click handler
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Memoized list items with optimized animations
  const renderListItems = useMemo(() => {
    const listData = subscriptionDetails?.[activeTab]?.length ? subscriptionDetails[activeTab] : content[activeTab];
    
    if (!listData || listData.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          No features available for this category
        </div>
      );
    }

    return listData.map((item, i) => (
      <motion.li
        key={`${activeTab}-${i}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: i * 0.1, 
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className={`flex gap-4 items-start ${i18n.language === "ar" ? "flex-row-reverse text-right" : ""}`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center transform-gpu">
          <IoChevronForward className={`text-white text-sm transform-gpu ${i18n.language === "ar" ? "rotate-180" : ""}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm md:text-base mb-1 leading-tight">
            {item.feature}
          </p>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
            {item.benefit}
          </p>
        </div>
      </motion.li>
    ));
  }, [activeTab, subscriptionDetails, content, i18n.language]);

  // Price display with optimized animations
  const PriceDisplay = useMemo(() => {
    if (isLoading) {
      return (
        <div className="text-center mb-4 flex flex-col items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      );
    }

    return (
      <motion.div
        key={billingCycle}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        className="text-center mb-4 flex flex-col items-center"
        style={{ willChange: 'transform, opacity' }}
      >
        {billingCycle === "monthly" ? (
          <>
            <h2 className="text-2xl font-bold text-blue-500 transform-gpu">
              {monthlyPrice} QAR
            </h2>
            <p className="text-sm text-gray-500 mt-1 transform-gpu">per month</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2 flex-wrap transform-gpu">
              <span className="line-through text-gray-400 text-xl">
                {4200} QAR
              </span>
              {yearlyPrice} QAR
            </h2>
            <p className="text-sm text-gray-500 mt-1 transform-gpu">
              per year (Save 1000 QAR!)
            </p>
          </>
        )}
      </motion.div>
    );
  }, [billingCycle, monthlyPrice, yearlyPrice, isLoading]);

  // Skeleton loader for tabs
  const TabSkeleton = useMemo(() => (
    <div className="flex items-center justify-center gap-3 mb-8 bg-white/70 rounded-3xl p-3 backdrop-blur animate-pulse
      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <div
          key={tab}
          className="flex-1 max-w-[140px] sm:max-w-[160px] md:max-w-[180px] text-center px-4 sm:px-5 py-3 rounded-2xl bg-gray-200
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
        >
          <div className="h-4 bg-gray-300 rounded-xl"></div>
        </div>
      ))}
    </div>
  ), [tabs]);

  // Get correct tab position based on language direction
  const getTabPosition = useCallback((tab) => {
    const isRTL = i18n.language === "ar";
    
    if (tab === "Core Management") {
      return isRTL ? "right-2" : "left-2";
    } else if (tab === "Sales & Promotions") {
      return "left-1/2 -translate-x-1/2";
    } else if (tab === "Insight & Support") {
      return isRTL ? "left-2" : "right-2";
    }
    return "left-2";
  }, [i18n.language]);

  return (
    <section dir={i18n.language === "ar" ? "rtl" : "ltr"} className="bg-neutral-100 py-20 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center relative overflow-hidden">
      <div className="flex flex-col items-center justify-center mb-8 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-4 text-center transform-gpu">
          Simple Pricing
        </h1>

        {/* Toggle Switch with Apple-style design */}
        <div className="flex items-center gap-4 mb-6 transform-gpu p-3 rounded-2xl
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          <span className={`text-sm font-medium transition-colors duration-200 ${
            billingCycle === "monthly" ? "text-blue-600" : "text-gray-500"
          }`}>
            Monthly
          </span>
          <button
            onClick={handleBillingToggle}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 transform-gpu
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] ${
              billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-300"
            }`}
            aria-label={`Switch to ${billingCycle === "monthly" ? "yearly" : "monthly"} billing`}
            style={{ willChange: 'background-color, transform' }}
          >
            <motion.div
              layout
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30 
              }}
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transform-gpu
                shadow-[2px_2px_4px_rgba(0,0,0,0.1)] ${
                billingCycle === "yearly" ? "right-1" : "left-1"
              }`}
              style={{ willChange: 'transform' }}
            />
          </button>
          <span className={`text-sm font-medium transition-colors duration-200 ${
            billingCycle === "yearly" ? "text-blue-600" : "text-gray-500"
          }`}>
            Yearly
          </span>
        </div>

        {PriceDisplay}
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 text-center transform-gpu">
        Benefits of Subscription
      </h2>

      {/* Tabs with Sliding Animation - Fixed for RTL */}
      {isLoading ? (
        TabSkeleton
      ) : (
        <motion.div 
          className="relative flex items-center justify-center gap-1 mb-8 bg-white/70 rounded-2xl p-2 backdrop-blur transform-gpu
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Sliding Background - Fixed positioning for RTL */}
          <div 
            className={`absolute top-2 bottom-2 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 transition-all duration-500 ease-in-out transform-gpu w-[calc(33.333%-12px)] ${
              getTabPosition(activeTab)
            }`}
            style={{ willChange: 'transform, left, right, width' }}
          />
          
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`relative flex-1 max-w-[130px] sm:max-w-[160px] md:max-w-[180px] text-center px-4 sm:px-5 py-3 rounded-2xl text-[11px] sm:text-sm font-medium transition-all duration-300 whitespace-nowrap transform-gpu z-10 ${
                activeTab === tab 
                  ? "text-white scale-105" 
                  : "text-gray-700 hover:text-blue-500 hover:scale-105"
              }`}
              style={{ willChange: 'transform, color' }}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      )}

      <motion.div
        key={activeTab + "-container"}
        className="bg-white w-full max-w-6xl border border-gray-100 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden transform-gpu"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 50, 
          damping: 22 
        }}
        style={{
          boxShadow: `
            20px 20px 60px #d9d9d9,
            -20px -20px 60px #ffffff
          `,
          willChange: 'transform, opacity'
        }}
      >
        <div className={`w-full md:w-1/2 text-center md:text-left transform-gpu ${i18n.language === "ar" ? "md:text-right" : ""}`}>
          <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 transform-gpu">
            {activeTab.toUpperCase()}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 transform-gpu">
            {activeTab === "Core Management" && "Manage your entire product catalog easily"}
            {activeTab === "Sales & Promotions" && "Boost visibility with sales and deals"}
            {activeTab === "Insight & Support" && "Get insights and build customer trust"}
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 font-medium transform-gpu">
            {activeTab === "Core Management" && "Company profiles will be in both languages."}
            {activeTab === "Sales & Promotions" && "Showcase your best deals instantly and draw customer attention to promotional sections with ease."}
            {activeTab === "Insight & Support" && "Track performance metrics, collect real customer reviews, and offer 24/7 assistance to keep your business trusted and efficient."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeTab}
            className="w-full md:w-1/2 bg-white/80 backdrop-blur-md text-gray-900 rounded-3xl p-8 space-y-6 border border-white/50 transform-gpu"
            initial={{ opacity: 0, x: i18n.language === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: i18n.language === "ar" ? 20 : -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              boxShadow: `
                8px 8px 16px #d1d1d1,
                -8px -8px 16px #ffffff,
                inset 2px 2px 5px #f0f0f0,
                inset -2px -2px 5px #ffffff
              `,
              willChange: 'transform, opacity'
            }}
          >
            {renderListItems}
          </motion.ul>
        </AnimatePresence>
      </motion.div>

      {/* neomorphic effect */}
      <style jsx>{`
        .neomorphic-card {
          background: #ffffff;
        }
        @media (max-width: 768px) {
          .neomorphic-card {
            box-shadow: 
              10px 10px 30px #d9d9d9,
              -10px -10px 30px #ffffff !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Pricing;