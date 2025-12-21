import React, { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSubscribeNow } from "../api";
import { useFixedWords } from "../hooks/useFixedWords";

// Card animation variants
const cardVariant = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Icon mapping based on icon names from API
const iconMap = {
  "location": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
  "search": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
  ),
  "customer-service": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  "images": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  ),
  "featured": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
  ),
  "email": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
    </svg>
  ),
  "target": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  ),
  "headset": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a5.986 5.986 0 00-3 5.5A5.5 5.5 0 007.5 18h5a5.5 5.5 0 005.5-5.5 5.986 5.986 0 00-3-5.5A5 5 0 0010 11z" clipRule="evenodd" />
    </svg>
  ),
  "display": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
    </svg>
  ),
  "default": (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
};

const SubscribeSection = memo(() => {
  const [subscribeData, setSubscribeData] = useState({
    title: "",
    cards: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  useEffect(() => {
    fetchSubscribeNowData();
  }, []);

  const fetchSubscribeNowData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getSubscribeNow();
      
      if (response && response.data) {
        const apiData = response.data;
        
        if (apiData.data && Array.isArray(apiData.data)) {
          const transformedCards = apiData.data.map((item) => {
            let iconName = "default";
            const iconUrl = item.icon || "";
            
            if (iconUrl.includes("target")) iconName = "target";
            else if (iconUrl.includes("headset")) iconName = "headset";
            else if (iconUrl.includes("image")) iconName = "images";
            else if (iconUrl.includes("display")) iconName = "display";
            else if (iconUrl.includes("mail")) iconName = "email";
            
            const isArabic = document.documentElement.getAttribute('dir') === 'rtl';
            const text = isArabic ? (item.text_ar || item.text_en || "") : (item.text_en || "");
            
            const iconComponent = iconMap[iconName] || iconMap["default"];
            
            if (iconName === "email") {
              const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
              const emailMatch = text.match(emailRegex);
              
              if (emailMatch) {
                const email = emailMatch[0];
                const textBeforeEmail = text.substring(0, text.indexOf(email));
                const textAfterEmail = text.substring(text.indexOf(email) + email.length);
                
                return {
                  icon: iconComponent,
                  text: (
                    <>
                      {textBeforeEmail}
                      <a
                        href={`mailto:${email}`}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {email}
                      </a>
                      {textAfterEmail}
                    </>
                  )
                };
              }
            }
            
            return {
              icon: iconComponent,
              text: text
            };
          });
          
          setSubscribeData({
            title: fw.subscribe_now || "",
            cards: transformedCards
          });
        } else {
          setError("No subscription data available");
          setSubscribeData({
            title: "",
            cards: []
          });
        }
      } else {
        setError("Failed to load subscription information");
        setSubscribeData({
          title: "",
          cards: []
        });
      }
    } catch (err) {
      console.error("Error fetching subscribe now data:", err);
      setError("Failed to load subscription information");
      setSubscribeData({
        title: "",
        cards: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative flex flex-col items-center justify-center bg-white px-4 sm:px-6 md:px-12 py-10 overflow-hidden min-h-[400px]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading subscription information...</p>
      </section>
    );
  }

  // Only render if we have cards, title is optional
  if (subscribeData.cards.length === 0) {
    return null;
  }

  return (
    <section className="relative flex flex-col items-center justify-center bg-white px-4 sm:px-6 md:px-12 py-10 overflow-hidden">
      {/* Debug info in development */}
    
      
      {/* Animated Heading - Only show if we have a title from fw */}
      {fw.subscribe_now && (
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tighter flex flex-wrap justify-center mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          {fw.subscribe_now}
        </motion.h1>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-center max-w-md">
          {error}
        </div>
      )}

      {/* Cards - Only show if we have cards */}
      {subscribeData.cards.length > 0 && (
        <div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6">
          {subscribeData.cards.map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-white shadow-2xl rounded-2xl px-4 sm:px-6 py-6 sm:py-8 w-full max-w-[90%] sm:max-w-md md:max-w-4xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mx-auto text-center sm:text-left transform-gpu will-change-transform hover:shadow-3xl transition-shadow duration-300"
            >
              <div className="flex-shrink-0">{card.icon}</div>
              <div className="text-base sm:text-lg font-medium">
                {typeof card.text === 'string' ? card.text : card.text}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
});

export default SubscribeSection;