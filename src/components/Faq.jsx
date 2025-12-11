import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getQuestions } from "../api";
import { useTranslation } from "react-i18next";

/* -----------------------------------
   EXACT  SVGs (UNCHANGED)
----------------------------------- */
const IoAdd = () => (
  <svg viewBox="0 0 512 512" fill="currentColor">
    <path d="M256 112a16 16 0 0 0-16 16v112H128a16 16 0 0 0 0 32h112v112a16 16 0 0 0 32 0V272h112a16 16 0 0 0 0-32H272V128a16 16 0 0 0-16-16z" />
  </svg>
);

const IoRemove = () => (
  <svg viewBox="0 0 512 512" fill="currentColor">
    <path d="M112 240a16 16 0 0 0 0 32h288a16 16 0 0 0 0-32z" />
  </svg>
);

/* -----------------------------------
   Pre-fetch FAQs
----------------------------------- */
let preloadedFAQs = null;

(async () => {
  try {
    const response = await getQuestions();
    const list =
      response.data?.data?.questions ||
      response.data?.questions ||
      (Array.isArray(response.data) ? response.data : []);

    preloadedFAQs = list.map((faq) => ({
      question: faq.title || faq.question || "No question",
      answer: faq.description || faq.answer || "No answer",
    }));
  } catch {
    preloadedFAQs = [];
  }
})();

/* -----------------------------------
   FAQ ITEM (PURE CSS)
----------------------------------- */
const MemoizedFaqItem = React.memo(
  ({ faq, isOpen, onToggle, answer, index, isRTL }) => (
    <div
      className={`relative border rounded-3xl overflow-hidden transition-colors duration-300 ${
        isOpen
          ? "bg-blue-50/80 border-blue-200"
          : "bg-white/70 hover:bg-gray-50/80 border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
        className={`w-full flex items-center px-4 sm:px-6 py-5 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        {/* RTL ICON */}
        {isRTL && (
          <span
            className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center flex-shrink-0
                        text-blue-500 text-xl transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
          >
            {isOpen ? <IoRemove /> : <IoAdd />}
          </span>
        )}

        {/* QUESTION */}
        <span
          className={`font-medium text-gray-900 text-xs sm:text-sm md:text-base flex-1 break-words leading-snug  ${
            isRTL ? "text-right mr-3" : "text-left ml-3"
          }`}
        >
          {faq.question}
        </span>

        {/* LTR ICON */}
        {!isRTL && (
          <span
            className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center flex-shrink-0
                        text-blue-500 text-xl transform transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
          >
            {isOpen ? <IoRemove /> : <IoAdd />}
          </span>
        )}
      </button>

      {/* ANSWER (PURE CSS COLLAPSE) */}
      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-out
          ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"}
          ${isRTL ? "text-right" : ""}`}
      >
        <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
);

/* -----------------------------------
   MAIN FAQ
----------------------------------- */
export default function Faq() {
  const [faqs, setFaqs] = useState(preloadedFAQs || []);
  const [openIndex, setOpenIndex] = useState(null);
  const [loadedAnswers, setLoadedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(!preloadedFAQs);
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    if (preloadedFAQs) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const fetchFaqs = async () => {
      try {
        setIsLoading(true);
        const response = await getQuestions();
        if (!mounted) return;

        const list =
          response.data?.data?.questions ||
          response.data?.questions ||
          (Array.isArray(response.data) ? response.data : []);

        const formatted = list.map((faq) => ({
          question: faq.title || faq.question || "No question",
          answer: faq.description || faq.answer || "No answer",
        }));

        setFaqs(formatted);
        preloadedFAQs = formatted;
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchFaqs();
    return () => (mounted = false);
  }, []);

  const toggleFaq = useCallback(
    (index) => {
      setOpenIndex((prev) => (prev === index ? null : index));
      setLoadedAnswers((prev) =>
        prev[index] ? prev : { ...prev, [index]: faqs[index]?.answer || "" }
      );
    },
    [faqs]
  );

  const faqList = useMemo(
    () =>
      isLoading
        ? null
        : faqs.map((faq, index) => (
            <MemoizedFaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              answer={loadedAnswers[index]}
              onToggle={() => toggleFaq(index)}
              index={index}
              isRTL={isRTL}
            />
          )),
    [faqs, isLoading, openIndex, loadedAnswers, isRTL, toggleFaq]
  );

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white px-6 md:px-16 flex justify-center items-center py-16"
      id="faq"
    >
      <div className="w-full max-w-4xl p-10 md:p-16 flex flex-col items-center gap-12">
       <div className="text-center mb-16 px-4">
  <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight text-gray-900">
    FAQs
  </h2>
  <p className="text-base sm:text-lg md:text-xl font-normal tracking-normal leading-relaxed text-gray-600 mt-1 max-w-xl mx-auto">
    Everything you need to know before getting started.
  </p>
</div>

        <div className="w-full max-w-3xl space-y-4">
          {faqList}
        </div>
      </div>
    </section>
  );
}
