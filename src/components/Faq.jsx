import React, { useState, useEffect, useCallback } from "react";
import { getQuestions } from "../api";
import { useTranslation } from "react-i18next";
import { useSettings } from "../hooks/useSettings";

/* -----------------------------------
   SAFARI-SAFE SVG ICONS
----------------------------------- */
const IoAdd = ({ className = "" }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M256 112a16 16 0 0 0-16 16v112H128a16 16 0 0 0 0 32h112v112a16 16 0 0 0 32 0V272h112a16 16 0 0 0 0-32H272V128a16 16 0 0 0-16-16z" />
  </svg>
);

const IoRemove = ({ className = "" }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M112 240a16 16 0 0 0 0 32h288a16 16 0 0 0 0-32z" />
  </svg>
);

/* -----------------------------------
   FAQ ITEM (UI UNCHANGED, FASTEST POSSIBLE)
----------------------------------- */
const MemoizedFaqItem = React.memo(
  function FaqItem({ faq, isOpen, onToggle, index, isRTL }) {
    return (
      <div
        className={`relative border rounded-3xl overflow-hidden transition-colors duration-300 ${
          isOpen
            ? "bg-blue-50/80 border-blue-200"
            : "bg-white/70 hover:bg-gray-50/80 border-gray-200"
        }`}
        style={{ contain: "layout paint" }}
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
              className={`flex items-center justify-center flex-shrink-0
                          text-blue-500 transition-transform duration-300
                          ${isOpen ? "rotate-180" : ""}`}
            >
              {isOpen ? (
                <IoRemove className="w-4 h-4 md:w-5 md:h-5 block" />
              ) : (
                <IoAdd className="w-4 h-4 md:w-5 md:h-5 block" />
              )}
            </span>
          )}

          {/* QUESTION */}
          <span
            className={`font-medium text-gray-900 text-xs sm:text-sm md:text-base flex-1 break-words leading-snug ${
              isRTL ? "text-right mr-3" : "text-left ml-3"
            }`}
          >
            {faq.question}
          </span>

          {/* LTR ICON */}
          {!isRTL && (
            <span
              className={`flex items-center justify-center flex-shrink-0
                          text-blue-500 transition-transform duration-300
                          ${isOpen ? "rotate-180" : ""}`}
            >
              {isOpen ? (
                <IoRemove className="w-4 h-4 md:w-5 md:h-5 block" />
              ) : (
                <IoAdd className="w-4 h-4 md:w-5 md:h-5 block" />
              )}
            </span>
          )}
        </button>

        {/* ANSWER — UI IDENTICAL */}
        <div
          id={`faq-answer-${index}`}
          role="region"
          aria-labelledby={`faq-question-${index}`}
          className={`px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-out
            ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"}
            ${isRTL ? "text-right" : ""}`}
        >
          <p className="text-gray-600 text-sm leading-relaxed">
            {faq.answer}
          </p>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.isOpen === next.isOpen &&
    prev.faq.question === next.faq.question &&
    prev.isRTL === next.isRTL
);

/* -----------------------------------
   MAIN FAQ COMPONENT
----------------------------------- */
export default function Faq() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    let mounted = true;

    const fetchFaqs = async () => {
      const response = await getQuestions();
      if (!mounted) return;

      const list =
        response.data?.data?.questions ||
        response.data?.questions ||
        [];

      setFaqs(
        list.map((faq) => ({
          question: faq.title || faq.question || "No question",
          answer: faq.description || faq.answer || "No answer",
        }))
      );
      setIsLoading(false);
    };

    // idle-safe fetch
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchFaqs);
    } else {
      setTimeout(fetchFaqs, 0);
    }

    return () => {
      mounted = false;
    };
  }, []);

  const toggleFaq = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-white px-6 md:px-16 flex justify-center py-2"
      id="faq"
    >
      <div className="w-full max-w-4xl p-10 md:p-16 flex flex-col items-center gap-12">
        <div className="text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            {settings.questions_title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-1 max-w-xl mx-auto">
            {settings.questions_sub_title}
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-4">
          {!isLoading &&
            faqs.map((faq, index) => (
              <MemoizedFaqItem
                key={faq.question}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() => toggleFaq(index)}
                index={index}
                isRTL={isRTL}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
