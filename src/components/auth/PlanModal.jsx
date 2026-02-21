import React, { useState, useEffect, useCallback, useRef } from "react";
import { getSubscribeDetails } from "../../api";
import { FaTimes, FaChevronRight } from "react-icons/fa";

export default function PlanModal({ isOpen, onClose, onSubscribe }) {
  const [tabs, setTabs] = useState([]);
  const [pricing, setPricing] = useState({});
  const [activeTab, setActiveTab] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isLoading, setIsLoading] = useState(true);
  const [tabDimensions, setTabDimensions] = useState({});
  const tabRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getSubscribeDetails();
        const data = response?.data;
        if (data) {
          const extractedTabs = [];
          Object.keys(data).forEach(key => {
            if (!isNaN(key)) {
              if (Array.isArray(data[key])) extractedTabs.push(...data[key]);
            }
          });
          setTabs(extractedTabs);
          if (extractedTabs.length > 0) setActiveTab(extractedTabs[0]?.key);
          if (data.pricing) setPricing(data.pricing);
        }
      } catch (err) {
        console.error("PlanModal fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (tabs.length > 0) {
      setTimeout(() => {
        const dimensions = {};
        tabs.forEach((_, idx) => {
          if (tabRefs.current[idx]) {
            dimensions[idx] = { width: tabRefs.current[idx].offsetWidth };
          }
        });
        setTabDimensions(dimensions);
      }, 50);
    }
  }, [tabs, activeTab]);

  if (!isOpen) return null;

  const activeTabData = tabs.find(t => t.key === activeTab);
  const monthlyPrice = pricing.monthly || 350;
  const yearlyPrice = pricing.yearly || 3500;

  const handleSubscribeClick = () => {
    onSubscribe(billingCycle === "monthly" ? 1 : 2);
  };

  const getSliderStyles = () => {
    const idx = tabs.findIndex(t => t.key === activeTab);
    if (idx === -1 || !tabDimensions[idx]) return { width: 0, left: 0 };
    let left = 0;
    for (let i = 0; i < idx; i++) {
        left += (tabDimensions[i]?.width || 0) + 8;
    }
    return { width: tabDimensions[idx].width, left };
  };

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition z-10">
          <FaTimes size={24} />
        </button>

        <div className="p-8 sm:p-12 overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-black text-gray-900">Simple Pricing</h2>
          </div>

          <div className="flex flex-col items-center">
            {/* Toggle */}
            <div className="flex items-center gap-4 mb-8 bg-gray-50 p-2 rounded-2xl border border-gray-100">
               <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-500' : 'text-gray-400'}`}>Monthly</span>
               <button 
                onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative w-14 h-7 rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-blue-500' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${billingCycle === 'yearly' ? 'right-1' : 'left-1'}`} />
               </button>
               <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-blue-500' : 'text-gray-400'}`}>Yearly</span>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <h3 className="text-5xl font-black text-blue-500 mb-1">
                {billingCycle === 'monthly' ? monthlyPrice : yearlyPrice} QAR
              </h3>
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
                {billingCycle === 'monthly' ? 'Per Month' : 'Per Year'}
              </p>
            </div>

            {/* Subscribe Button */}
            <button 
              onClick={handleSubscribeClick}
              className="px-16 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition transform"
            >
              Subscribe
            </button>

            <div className="mt-12 w-full text-center">
                <h4 className="text-2xl font-black text-gray-900 mb-6">Benefits of subscription</h4>
                
                {/* Custom Tabs */}
                <div className="inline-flex relative bg-gray-50/50 p-2 rounded-2xl border border-gray-100 mb-8 max-w-full overflow-x-auto">
                   {tabs.length > 0 && activeTab && (
                       <div 
                        className="absolute top-2 bottom-2 bg-blue-500 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
                        style={getSliderStyles()}
                       />
                   )}
                   {tabs.map((tab, idx) => (
                       <button
                        key={tab.key}
                        ref={el => tabRefs.current[idx] = el}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative z-10 px-6 py-2.5 rounded-xl text-sm font-black transition-colors whitespace-nowrap ${activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                           {tab.key}
                       </button>
                   ))}
                </div>

                {/* Benefits Content */}
                {activeTabData && (
                    <div className="bg-gray-50/30 rounded-[32px] border border-gray-100 p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 text-left">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-4 inline-block">
                                {activeTabData.key}
                            </span>
                            <h5 className="text-2xl font-black text-gray-900 mb-4">{activeTabData.title}</h5>
                            <p className="text-gray-500 font-medium leading-relaxed">{activeTabData.description}</p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-gray-100 text-left space-y-6">
                                {(activeTabData.benefits || []).map((b, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <FaChevronRight size={10} />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-sm mb-1">{b.title || b.name || b.feature}</p>
                                            <p className="text-gray-400 text-xs font-medium leading-relaxed">{b.description || b.detail || b.benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
