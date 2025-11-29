import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestions } from "../api";

// ===============================
// Memoized FAQ Item Component
// ===============================
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
          id={`faq-question-${index}`}
          className="w-full flex justify-between items-center px-6 py-5 text-left"
        >
          <span className="font-medium text-gray-900 text-base">
            {faq.question}
          </span>

          {/* Button */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center"
          >
            {isOpen ? (
              <IoIosRemove className="text-blue-500 text-lg md:text-2xl" />
            ) : (
              <IoIosAdd className="text-blue-500 text-lg md:text-2xl" />
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

// ===============================
// Main FAQ Component
// ===============================
export default function Faq() {
  const [faqs, setFaqs] = useState([]); // API data
  const [openIndex, setOpenIndex] = useState(null);
  const [loadedAnswers, setLoadedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ======================================================
  // Fallback FAQs (if API fails)
  // ======================================================
  const fallbackFaqs = useMemo(
    () => [
      {
        question: "What is Catalogueya?",
        answer:
          "Home services platform for painting, carpentry, lighting, and gardening.",
      },
      {
        question: "How to book?",
        answer: "Select service on app/website and schedule appointment.",
      },
      {
        question: "Are providers certified?",
        answer: "Yes, all are verified professionals.",
      },
      {
        question: "Emergency help?",
        answer: "Yes, for plumbing and electrical issues.",
      },
      {
        question: "Service areas?",
        answer: "Multiple regions — check the Coverage page.",
      },
      {
        question: "Contact support?",
        answer: "Via Contact Us page on website.",
      }
    ],
    []
  );

  // ======================================================
  // Fetch from API - FIXED VERSION
  // ======================================================
  useEffect(() => {
    let mounted = true;

    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getQuestions();
        
        if (!mounted) return;

        console.log("API Response:", response); // Debug log

        // Handle the actual API response structure
        if (response.data && response.data.data && Array.isArray(response.data.data.questions)) {
          // Structure: { data: { data: { questions: [...] } } }
          setFaqs(response.data.data.questions);
        } else if (response.data && Array.isArray(response.data.questions)) {
          // Structure: { data: { questions: [...] } }
          setFaqs(response.data.questions);
        } else if (Array.isArray(response.data)) {
          // Structure: { data: [...] }
          setFaqs(response.data);
        } else {
          console.warn("Unexpected API response structure:", response);
          setFaqs([]);
        }
        
      } catch (error) {
        console.error("FAQ Fetch error:", error);
        if (mounted) {
          setError("Failed to load FAQs");
          setFaqs([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchFaqs();
    return () => {
      mounted = false;
    };
  }, []);

  // ======================================================
  // Normalize displayed FAQ list - FIXED VERSION
  // ======================================================
  const displayedFaqs = useMemo(() => {
    // If we have FAQs from API, use them
    if (faqs.length > 0) {
      return faqs.map((faq) => ({
        question: faq.title || faq.question || "Question not provided",
        answer: faq.description || faq.answer || "Answer not available"
      }));
    }
    
    // If no FAQs from API but we have fallback, use fallback
    if (fallbackFaqs.length > 0) {
      return fallbackFaqs;
    }
    
    // Default empty state
    return [{
      question: "No FAQs available",
      answer: "Please check back later or contact support."
    }];
  }, [faqs, fallbackFaqs]);

  // ======================================================
  // Handle Expand Toggle
  // ======================================================
  const toggleFaq = useCallback(
    (index) => {
      setOpenIndex((prev) => (prev === index ? null : index));

      setLoadedAnswers((prev) => {
        if (!prev[index]) {
          return { ...prev, [index]: displayedFaqs[index].answer };
        }
        return prev;
      });
    },
    [displayedFaqs]
  );

  // ======================================================
  // Skeleton Loader
  // ======================================================
  const skeletonLoader = (
    <div className="space-y-4 w-full max-w-3xl">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-white/70 border border-gray-200 rounded-3xl p-6 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // ======================================================
  // Error State
  // ======================================================
  if (error && displayedFaqs.length === 0) {
    return (
      <section className="bg-neutral-100 px-6 md:px-16 flex justify-center items-center py-16" id="faq">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tighter mb-4">
            FAQs
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-gray-500">Using fallback FAQs</p>
        </div>
      </section>
    );
  }

  // ======================================================
  // Render UI
  // ======================================================
  return (
    <section
      className="bg-neutral-100 px-6 md:px-16 flex justify-center items-center py-16"
      id="faq"
    >
      <div className="w-full max-w-4xl p-10 md:p-16 flex flex-col items-center gap-12 relative overflow-hidden">

        {/* Title */}
        <div className="text-center z-10">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tighter mb-4">
            FAQs
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know before getting started.
          </p>

          {isLoading && (
            <div className="mt-4">
              <p className="text-gray-400">Loading FAQs...</p>
              <div className="h-1 w-24 bg-gray-300 rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="mt-4">
              <p className="text-yellow-600 text-sm">
                {error} - Showing fallback content
              </p>
            </div>
          )}
        </div>

        {/* FAQ List */}
        <div
          className="relative w-full max-w-3xl space-y-4 z-10"
          role="region"
          aria-label="Frequently Asked Questions"
        >
          {isLoading
            ? skeletonLoader
            : displayedFaqs.map((faq, index) => (
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