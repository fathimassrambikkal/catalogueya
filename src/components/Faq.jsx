import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestions } from "../api"; 

// Memoized FAQ 
const MemoizedFaqItem = React.memo(
  ({ faq, isOpen, onToggle, answer, index }) => (
    <motion.div
      layout
      className={`relative border border-gray-200 rounded-3xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? "bg-blue-50/80 border-blue-200"
          : "bg-white/70 hover:bg-gray-50/80"
      }`}
    >
      <div className="relative z-10">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          className="w-full flex justify-between items-center px-6 py-5 text-left"
        >
          <span className="font-medium text-gray-900 text-lg">
            {faq.question}
          </span>

          {/*  Button */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="
              w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 
              rounded-full 
              flex items-center justify-center
              bg-blue-500 shadow-sm
              hover:bg-[#007AFF]/90
              transition-colors duration-200
            "
          >
            {isOpen ? (
              <IoIosRemove className="text-blue-100 hover:text-white text-lg md:text-2xl" />
            ) : (
              <IoIosAdd className="text-blue-100 hover:text-white  text-lg md:text-2xl" />
            )}
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && answer && (
            <motion.div
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="px-6 pb-5 text-gray-600 text-base leading-relaxed"
            >
              {answer}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
);

export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loadedAnswers, setLoadedAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const fallbackFaqs = useMemo(
    () => [
      {
        question: "What is Catalogueya?",
        answer:
          "Catalogueya is a comprehensive platform offering a wide range of home services, including painting, carpentry, lighting installation, security systems, wallpaper application, curtain fitting, and gardening. Our goal is to provide professional services delivered with care and convenience, right to your doorstep.",
      },
      {
        question: "How do I book a service?",
        answer:
          "Booking a service is simple. Visit our Services page, select the service you need, and follow the prompts to schedule an appointment at your convenience.",
      },
      {
        question: "Are providers certified?",
        answer: "Yes, all providers are certified professionals with verified experience.",
      },
      {
        question: "Do you provide emergency help?",
        answer:
          "Yes, we offer emergency services for certain categories like plumbing and electrical issues. Please contact our customer support for immediate assistance.",
      },
      {
        question: "What areas do you serve?",
        answer:
          "Currently, we serve multiple locations across the region. For a detailed list of serviceable areas, please refer to our Coverage Area page.",
      },
      {
        question: "How to contact support?",
        answer:
          "You can reach our customer support team via the Contact Us page on our website. We are available to assist you with any inquiries or issues.",
      },
    ],
    []
  );

  const displayedFaqs = faqs.length ? faqs : fallbackFaqs;

  // Fetch FAQs from your API
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getQuestions()
      .then((res) => {
        if (mounted && res.data && Array.isArray(res.data)) {
          setFaqs(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch FAQs:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  const toggleFaq = useCallback(
    (index) => {
      setOpenIndex((prev) => (prev === index ? null : index));
      setLoadedAnswers((prev) => {
        if (!prev[index] && displayedFaqs[index]) {
          return { ...prev, [index]: displayedFaqs[index].answer };
        }
        return prev;
      });
    },
    [displayedFaqs]
  );

  return (
    <section
      className="bg-neutral-100 px-6 md:px-16 flex justify-center items-center"
      id="faq"
    >
      <div className="w-full max-w-4xl p-10 md:p-16 flex flex-col items-center gap-12 relative overflow-hidden">
        {/* Title Section */}
        <div className="relative flex flex-col justify-center text-center z-10 w-full">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tighter mb-4">
            FAQs
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know before getting started.
          </p>
          {loading && <p className="text-gray-400 mt-2">Loading FAQs...</p>}
        </div>

        {/* Accordion Section */}
        <div
          className="relative w-full max-w-3xl space-y-4 z-10"
          role="region"
          aria-label="Frequently Asked Questions"
        >
          {displayedFaqs.map((faq, index) => (
            <MemoizedFaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              answer={loadedAnswers[index]}
              onToggle={() => toggleFaq(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}