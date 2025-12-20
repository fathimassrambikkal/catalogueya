import React, { useState, useEffect, useCallback } from "react";
import { getSubscribeDetails } from "../api";
import { useTranslation } from "react-i18next";
import { useFixedWords } from "../hooks/useFixedWords";

const ChevronIcon = ({ isRTL = false }) => (
  <svg
    className={`w-4 h-4 text-white ${isRTL ? "rotate-180" : ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const Pricing = () => {
  const { fixedWords } = useFixedWords();
  const { fixed_words: fw = {} } = fixedWords || {};
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [tabs, setTabs] = useState([]);
  const [pricing, setPricing] = useState({ monthly: 350, yearly: 3200 }); // Default values
  const [activeTab, setActiveTab] = useState(null);
  const [currentFeatures, setCurrentFeatures] = useState([]);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("🔄 Fetching subscription details...");
        const response = await getSubscribeDetails();
        console.log("✅ Full API Response:", response.data);
        
        const data = response?.data;
        
        // The API returns an object with numeric keys ("0", "1", "2") and "pricing"
        if (data) {
          console.log("📊 Response keys:", Object.keys(data));
          
          // Extract tabs from numeric keys
          const extractedTabs = [];
          Object.keys(data).forEach(key => {
            // Check if key is numeric (tabs data)
            if (!isNaN(key)) {
              const tabGroup = data[key];
              if (Array.isArray(tabGroup)) {
                extractedTabs.push(...tabGroup);
              }
            }
          });
          
          console.log("📋 Extracted tabs:", extractedTabs);
          
          if (extractedTabs.length > 0) {
            setTabs(extractedTabs);
            setActiveTab(extractedTabs[0]?.key || null);
          } else {
            console.warn("⚠️ No tab data found in API response");
            setTabs([]);
          }
          
          // Extract pricing data
          if (data.pricing) {
            console.log("💰 Pricing data:", data.pricing);
            setPricing(data.pricing);
          }
        } else {
          console.warn("⚠️ No data in response");
          setTabs([]);
        }
        
      } catch (err) {
        console.error("❌ Error fetching subscription details:", err);
        console.error("Error details:", err.response?.data || err.message);
        setTabs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= DEBUG LOGS =================
  useEffect(() => {
    console.log("📌 Tabs state:", tabs);
    console.log("📌 Active tab key:", activeTab);
    console.log("💰 Pricing state:", pricing);
  }, [tabs, activeTab, pricing]);

  // ================= ACTIVE TAB DATA =================
  const activeTabData = tabs.find(t => t.key === activeTab);

  useEffect(() => {
    console.log("🔁 Active Tab Data:", activeTabData);

    if (activeTabData?.benefits?.length) {
      setCurrentFeatures(
        activeTabData.benefits.map(b => ({
          feature: b.title || b.name || b.feature,
          benefit: b.description || b.detail || b.benefit,
        }))
      );
    } else {
      setCurrentFeatures([]);
    }
  }, [activeTabData]);

  // ================= PRICING =================
  const monthlyPrice = pricing.monthly || 350;
  const yearlyPrice = pricing.yearly || Math.round(monthlyPrice * 12 * 0.8);
  const yearlySavings = monthlyPrice * 12 - yearlyPrice;

  const handleBillingToggle = useCallback(() => {
    setBillingCycle(p => (p === "monthly" ? "yearly" : "monthly"));
  }, []);

  const handleTabClick = useCallback((tabKey) => {
    setActiveTab(tabKey);
  }, []);

  const getTabPosition = () =>
    tabs.findIndex(tab => tab.key === activeTab);

  // ================= RENDER =================
  if (isLoading) {
    return (
      <section
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white py-12 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center relative overflow-hidden"
      >
        <div className="animate-pulse space-y-8 w-full max-w-6xl">
          <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-48 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white py-12 px-4 sm:px-8 md:px-16 font-inter flex flex-col items-center relative overflow-hidden"
    >
      {/* TITLE */}
      <h1 className="text-4xl md:text-5xl font-light text-gray-900 text-center">
        {fw.simple_pricing}
      </h1>

      {/* BILLING TOGGLE */}
      <div className="flex items-center gap-4 my-8 p-3 rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/60">
        <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-blue-600" : "text-gray-500"}`}>
          {fw.monthly }
        </span>
        <button onClick={handleBillingToggle} className={`relative w-16 h-8 rounded-full ${billingCycle === "yearly" ? "bg-blue-500" : "bg-gray-300"}`}>
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
              billingCycle === "yearly"
                ? isRTL ? "left-1" : "right-1"
                : isRTL ? "right-1" : "left-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-blue-600" : "text-gray-500"}`}>
          {fw.yearly }
        </span>
      </div>

      {/* PRICE */}
      <div className="text-center mb-6 space-y-2">
        {billingCycle === "monthly" ? (
          <>
            <h2 className="text-2xl font-bold text-blue-500">
              {monthlyPrice} {fw.qar }
            </h2>
            <p className="text-sm text-gray-500">{fw.per_month }</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-600">
              <span className="line-through text-gray-400 mr-2">
                {monthlyPrice * 12} {fw.qar }
              </span>
              {yearlyPrice} {fw.qar }
            </h2>
            <p className="text-sm text-gray-500">
              {fw.per_year || "per year"} ({yearlySavings} {fw.qar } saved)
            </p>
          </>
        )}
      </div>

      {/* Benefits Section */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-4">
        {fw.benefits_of_subscription }
      </h2>

      {/* TABS */}
      {tabs.length > 0 ? (
        <div className="relative flex items-center justify-center gap-1 mb-12 bg-white/70 rounded-2xl p-2 backdrop-blur shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] tabs-container">
          {/* Sliding Background */}
          {tabs.length > 0 && (
            <div 
              className={`absolute top-2 bottom-2 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 tab-slider tab-${getTabPosition()}`}
              style={{ width: `calc(${100/tabs.length}% - 12px)` }}
            />
          )}
          
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={`relative flex-1 max-w-[120px] sm:max-w-[160px] md:max-w-[180px] text-center px-5 sm:px-5 py-3 rounded-2xl text-[10px] sm:text-sm font-medium transition-all duration-300 whitespace-nowrap z-10 ${
                activeTab === tab.key 
                  ? "text-white scale-105" 
                  : "text-gray-700 hover:text-blue-500 hover:scale-105"
              }`}
              data-index={index}
            >
              {tab.key}
            </button>
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="mb-12 text-center text-gray-500">
            No subscription features available
          </div>
        )
      )}

      {/* Main Card Section */}
      {activeTabData && (
        <div className="w-full max-w-6xl mb-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-10 border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
            {/* Left Content */}
            <div className={`w-full md:w-1/2 text-center md:text-left ${isRTL ? 'md:text-right' : ''} space-y-6`}>
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                {(activeTabData.key || "").toUpperCase()}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {activeTabData.title}
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed max-w-md">
                {activeTabData.description}
              </p>
            </div>

            {/* Right Content - Feature Card */}
            <div className="w-full md:w-1/2">
              <div className="bg-white/90 backdrop-blur-xl text-gray-900 rounded-3xl p-8 border border-white/60 min-h-[300px] flex flex-col justify-center shadow-[8px_8px_25px_rgba(0,0,0,0.08),-8px_-8px_25px_rgba(255,255,255,0.9),inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                {currentFeatures.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No features available for this category
                  </div>
                ) : (
                  <ul className="space-y-6 relative z-10">
                    {currentFeatures.map((item, index) => (
                      <li
                        key={index}
                        className={`flex gap-3 items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                      >
                        <div className={`
                          flex-shrink-0 
                          w-6 h-6 
                          rounded-full 
                          bg-gradient-to-br from-blue-500 to-blue-600
                          flex items-center justify-center 
                          ${isRTL ? 'order-2 ml-2' : 'mr-2'}
                          shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px rgba(255,255,255,0.8)]
                        `}>
                          <ChevronIcon isRTL={isRTL} />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-semibold text-gray-800 text-sm md:text-base leading-tight">
                            {item.feature}
                          </p>
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                            {item.benefit}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        /* Tab slider animation */
        .tab-slider {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Position tabs based on LTR/RTL and active tab index */
        ${tabs.map((_, index) => `
          .tab-slider.tab-${index} {
            left: ${isRTL 
              ? `calc(100% - (${100/tabs.length}% - 12px) - ${(index * (100/tabs.length))}% + 4px)` 
              : `calc(${(index * (100/tabs.length))}% + 4px)`};
          }
        `).join('')}
      `}</style>
    </section>
  );
};

export default React.memo(Pricing);