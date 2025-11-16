import React, { useState, useEffect } from "react"; // added useEffect
import { IoIosAdd, IoIosRemove } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestions } from "../api"; // added API import

export default function Faq() {
  const [faqs, setFaqs] = useState([
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
      answer:
        "Yes, all providers are certified professionals with verified experience.",
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
  ]);

  const [openIndex, setOpenIndex] = useState(null);
  const toggleFaq = (index) => setOpenIndex(openIndex === index ? null : index);

  // Fetch FAQs from API on mount
  useEffect(() => {
    getQuestions()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          // Assuming API returns an array of {question, answer} objects
          setFaqs(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch FAQs:", err);
      });
  }, []);

  return (
    <section
      className="bg-neutral-100
      px-6 md:px-16 flex justify-center items-center"
      id="faq"
    >
      {/* Center Card */}
      <div className="w-full max-w-6xl  backdrop-blur-lg    p-10 md:p-16 flex flex-col lg:flex-row justify-between gap-16 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 via-cyan-100/30 to-transparent blur-3xl opacity-50 pointer-events-none"></div>

        {/* Left Section — Title */}
        <div className="relative flex flex-col justify-center max-w-md text-center lg:text-left z-10">
          <p className="text-blue-500  font-semibold text-sm mb-2 flex items-center justify-center lg:justify-start gap-1">
            FAQs
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 leading-tighter mb-4">
            Got Questions?
          </h2>
          <p className="text-gray-500 text-lg">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* Right Section — FAQ List */}
        <div className="relative flex-1 max-w-2xl mx-auto lg:mx-0 space-y-4 z-10">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              layout
              className={`relative border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "bg-blue-50/80 border-blue-200"
                  : "bg-white/70 hover:bg-gray-50/80"
              }`}
            >
              {/* Card Content */}
              <div className="relative z-10">
                {/* Question */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left"
                >
                  <span className="font-medium text-gray-900 text-lg">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openIndex === index ? (
                      <IoIosRemove className="text-blue-500 text-2xl" />
                    ) : (
                      <IoIosAdd className="text-blue-500 text-2xl" />
                    )}
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="px-6 pb-5 text-gray-600 text-base leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
