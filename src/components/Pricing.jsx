import React, { useState, useEffect, useCallback } from "react";
import { getSubscribeDetails } from "../api";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";
const API_BASE_URL = "https://catalogueyanew.com.awu.zxu.temporary.site";

// SVG Icons to replace IoChevronForward
const ChevronIcon = ({ isRTL = false }) => (
  <svg
    className={`w-4 h-4 text-white ${isRTL ? 'rotate-180' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

// Pre-fetch data immediately when module loads
let preloadedSubscription = null;

(async () => {
  try {
    const res = await getSubscribeDetails();
    preloadedSubscription = res?.data?.data || null;
  } catch {
    preloadedSubscription = null;
  }
})();

// Static constants to prevent recreation
const TABS = ["Core Management", "Sales & Promotions", "Insight & Support"];
const FALLBACK_CONTENT = {
  "Core Management": [
    { feature: "Unlimited Uploads", benefit: "Host unlimited product images & videos" },
    { feature: "Product Tagging & Badges", benefit: "Highlight items with Sales, New Arrivals, limited editions, or out of stock status" },
    { feature: "Direct WhatsApp Integration", benefit: "Instant communication for inquiries from your customers directly via WhatsApp" },
  ],
  "Sales & Promotions": [
    { feature: "Quick Sale Setup", benefit: "Add sale items with one click." },
    { feature: "Show Special Deals", benefit: "Display promotions to customers." },
    { feature: "Boost Sales", benefit: "Increase revenue with offers." }
  ],
  "Insight & Support": [
    { feature: "Performance Analytics", benefit: "Track clicks and view detailed product insights" },
    { feature: "Customer Reviews", benefit: "Collect and display genuine feedback to build trust" },
    { feature: "24/7 Support", benefit: "Round-the-clock customer assistance for reliability" },
  ],
};
const TAB_DESCRIPTIONS = {
  "Core Management": "Company profiles will be in both languages.",
  "Sales & Promotions": "Showcase your best deals instantly and draw customer attention to promotional sections with ease.",
  "Insight & Support": "Track performance metrics, collect real customer reviews, and offer 24/7 assistance to keep your business trusted and efficient."
};
const TAB_TITLES = {
  "Core Management": "Manage your entire product catalog easily",
  "Sales & Promotions": "Boost visibility with sales and deals",
  "Insight & Support": "Get insights and build customer trust"
};

const Pricing = () => {
  const { fixedWords } = useFixedWords();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscriptionDetails, setSubscriptionDetails] = useState(preloadedSubscription || {});
  const [isLoading, setIsLoading] = useState(!preloadedSubscription);
  const [currentFeatures, setCurrentFeatures] = useState([]);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { fixed_words: fw = {} } = fixedWords || {};


  // Auto-switch tabs with optimized timing
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = TABS.indexOf(prev);
        return TABS[(currentIndex + 1) % TABS.length];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        
        const subscriptionData = res?.data?.data;
        if (subscriptionData) {
          setSubscriptionDetails(subscriptionData);
          preloadedSubscription = subscriptionData;
        } else {
          setSubscriptionDetails({});
        }
        setIsLoading(false);
      } catch {
        if (mounted) setIsLoading(false);
      }
    };
    fetchSubscription();
    return () => { mounted = false; };
  }, []);

  // Get features from API data or fallback
  const getFeaturesForTab = useCallback((tab) => {
    if (subscriptionDetails?.features?.length) {
      const apiFeatures = subscriptionDetails.features.filter(
        feature => feature.category === tab
      );
      
      if (apiFeatures.length > 0) {
        return apiFeatures.map(feat => ({
          feature: feat.title || feat.name || "Feature",
          benefit: feat.description || feat.detail || "Benefit description"
        }));
      }
    }
    
    return FALLBACK_CONTENT[tab] || [];
  }, [subscriptionDetails]);

  // Update features when tab changes
  useEffect(() => {
    const features = getFeaturesForTab(activeTab);
    setCurrentFeatures(features);
  }, [activeTab, getFeaturesForTab]);

  // Get the first subscription plan for pricing
  const firstSubscription = subscriptionDetails?.subscribes?.[0] || null;

  // Calculate prices
  const monthlyPrice = firstSubscription ? parseFloat(firstSubscription.price) || 350 : 350;
  const yearlyPrice = firstSubscription ? Math.round(monthlyPrice * 12 * 0.8) : 3200;
  const yearlySavings = monthlyPrice * 12 - yearlyPrice;

  // Optimized handlers
  const handleBillingToggle = useCallback(() => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  }, []);

  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Get tab position for slider animation
  const getTabPosition = () => {
    return TABS.indexOf(activeTab);
  };
  
  useEffect(() => {
    console.log("✅ Pricing FixedWords:", {
      simple_pricing: fw.simple_pricing,
      monthly: fw.monthly,
      yearly: fw.yearly,
      qar: fw.qar,
      per_month: fw.per_month,
      per_year: fw.per_year,
      benefits_of_subscription: fw.benefits_of_subscription,
      full_fixedWords: fixedWords,
    });
  }, [fw, fixedWords]);

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"} 
      className="bg-white py-20 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center relative overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center mb-8 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-4 text-center">
          {fw.simple_pricing}
        </h1>

        {/* Toggle Switch */}
        <div className="flex items-center gap-4 mb-6 p-3 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/60">
          <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-blue-600" : "text-gray-500"}`}>
            {fw.monthly}
          </span>

          <button
            onClick={handleBillingToggle}
            className={`relative w-16 h-8 rounded-full ${billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-300"}`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                billingCycle === "yearly"
                  ? isRTL ? "left-1" : "right-1"
                  : isRTL ? "right-1" : "left-1"
              }`}
            />
          </button>

          <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-blue-600" : "text-gray-500"}`}>
            {fw.yearly}
          </span>
        </div>

        {/* Price Display */}
        {isLoading ? (
          <div className="text-center mb-4">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        ) : (
          <div className="text-center mb-4">
            {billingCycle === "monthly" ? (
              <>
                <h2 className="text-2xl font-bold text-blue-500">
                  {monthlyPrice} {fw.qar}
                </h2>
                <p className="text-sm text-gray-500">{fw.per_month}</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-600">
                  <span className="line-through text-gray-400 mr-2">
                    {monthlyPrice * 12} {fw.qar}
                  </span>
                  {yearlyPrice} {fw.qar}
                </h2>
                <p className="text-sm text-gray-500">
                  {fw.per_year} ({yearlySavings} {fw.qar})
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">
        {fw.benefits_of_subscription}
      </h2>

      {/* Tabs with Sliding Animation */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 mb-8 bg-white/70 rounded-3xl p-3 backdrop-blur">
          {TABS.map((tab) => (
            <div key={tab} className="flex-1 max-w-[140px] sm:max-w-[160px] md:max-w-[180px] text-center px-4 sm:px-5 py-3 rounded-2xl bg-gray-200 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
              <div className="h-4 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative flex items-center justify-center gap-1 mb-8 bg-white/70 rounded-2xl p-2 backdrop-blur shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] tabs-container">
          {/* Sliding Background */}
          <div 
            className={`absolute top-2 bottom-2 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 tab-slider tab-${getTabPosition()}`}
            style={{ width: 'calc(33.333% - 12px)' }}
          />
          
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`relative flex-1 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] text-center px-5 sm:px-5 py-3 rounded-2xl text-[10px] sm:text-sm font-medium transition-all duration-300 whitespace-nowrap z-10 ${activeTab === tab ? "text-white scale-105" : "text-gray-700 hover:text-blue-500 hover:scale-105"}`}
              data-index={index}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Main Container with Blurred Border Effect */}
      <div className="w-full max-w-6xl">
        {/* 🌟 OUTER BLURRED BORDER WRAPPER (Similar to Contact page) */}
        <div
          className="
            p-[7px]
            rounded-[34px]
            bg-white/5
            backdrop-blur-3xl
            border-[2px]
          "
        >
          {/* 🌟 MAIN CARD WITH NEUMORPHIC EFFECT */}
          <div
            className="
              bg-white
              rounded-[30px]
              p-8 md:p-12
              flex flex-col md:flex-row
              gap-8
              shadow-[8px_8px_25px_rgba(0,0,0,0.12),-8px_-8px_25px_rgba(255,255,255,0.8)]
            "
          >
            {/* Left Content */}
            <div className={`w-full md:w-1/2 text-center md:text-left ${isRTL ? 'md:text-right' : ''}`}>
              <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {activeTab.toUpperCase()}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {TAB_TITLES[activeTab]}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {TAB_DESCRIPTIONS[activeTab]}
              </p>
            </div>

            {/* Right Content - Feature Card with Centered Content */}
            <div className="w-full md:w-1/2">
              <div className="bg-white/80 backdrop-blur-md text-gray-900 rounded-3xl p-8 border border-white/50 feature-card min-h-[300px] flex flex-col justify-center">
                {currentFeatures.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No features available for this category
                  </div>
                ) : (
                  <ul className="space-y-5">
                    {currentFeatures.map((item, index) => {
                      const feature = item.feature || item.title || item.name || "Feature";
                      const benefit = item.benefit || item.description || item.detail || "Benefit description";
                      
                      return (
                        <li
                          key={index}
                          className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ${isRTL ? 'order-2 ml-2' : 'mr-2'}`}>
                            <ChevronIcon isRTL={isRTL} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm md:text-base mb-1 leading-tight">
                              {feature}
                            </p>
                            <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                              {benefit}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        /* Smooth animations */
        .toggle-handle {
          transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        /* Tab slider animation */
        .tab-slider {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Position tabs based on LTR/RTL */
        .tab-slider.tab-0 {
          left: ${isRTL ? 'calc(100% - calc(33.333% - 12px) - 4px)' : '4px'};
        }
        
        .tab-slider.tab-1 {
          left: calc(50% - calc(calc(33.333% - 12px) / 2));
        }
        
        .tab-slider.tab-2 {
          left: ${isRTL ? '4px' : 'calc(100% - calc(33.333% - 12px) - 4px)'};
        }
        
        /* Feature card shadow and transitions */
        .feature-card {
          box-shadow: 
            8px 8px 16px #d1d1d1,
            -8px -8px 16px #ffffff,
            inset 2px 2px 5px #f0f0f0,
            inset -2px -2px 5px #ffffff;
          transition: all 0.3s ease;
        }
        
        /* Media queries for responsive tab positioning */
        @media (min-width: 768px) {
          .tab-slider.tab-0 {
            left: ${isRTL ? 'calc(100% - calc(33.333% - 12px) - 4px)' : '4px'};
          }
          
          .tab-slider.tab-1 {
            left: calc(50% - calc(calc(33.333% - 12px) / 2));
          }
          
          .tab-slider.tab-2 {
            left: ${isRTL ? '4px' : 'calc(100% - calc(33.333% - 12px) - 4px)'};
          }
        }
        
        /* Button hover effects */
        .tabs-container button:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
        
        .tabs-container button.active {
          transform: scale(1.05);
        }
      `}</style>
    </section>
  );
};

export default React.memo(Pricing);