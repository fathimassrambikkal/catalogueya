import React, { memo, lazy, Suspense, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import { useFixedWords } from "../hooks/useFixedWords";
import { submitContact } from "../api";

const Faq = lazy(() => import("../components/Faq"));
const CallToAction = lazy(() => import("../components/CallToAction"));

export default function Contact() {
  const { settings } = useSettings();
  const { fixedWords } = useFixedWords();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  // Extract fixed words
  const fw = fixedWords?.fixed_words || {};

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setSubmitMessage(fw.please_fill_all_fields || "Please fill in all fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage(fw.please_enter_valid_email || "Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");
    
    try {
      // Send data to API
      const response = await submitContact(formData);
      
      if (response.data.success) {
        setSubmitStatus('success');
        setSubmitMessage(response.data.message || fw.message_sent_successfully || "Message sent successfully!");
        
        // Clear form fields immediately
        setFormData({
          name: "",
          email: "",
          message: ""
        });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage("");
        }, 5000);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(response.data.message || fw.message_send_failed || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setSubmitStatus('error');
      
      // Provide user-friendly error message
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error ||
                            fw.message_send_failed || 
                            "Failed to send message. Server error.";
        setSubmitMessage(errorMessage);
      } else if (error.request) {
        setSubmitMessage(fw.network_error || "Network error. Please check your connection.");
      } else {
        setSubmitMessage(fw.message_send_failed || "Failed to send message. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-10 mt-8 tracking-tight text-center">
            {settings?.contact_title}
          </h1>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`w-full max-w-3xl mb-6 p-4 rounded-xl text-center ${
              submitStatus === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Outer Border Wrapper */}
          <div
            className="
              w-full max-w-3xl
              p-[7px]
              rounded-[34px]
              bg-white/5
              backdrop-blur-3xl
              border-[2px]
            "
          >
            {/* Main Card */}
            <div
              className="
                bg-white
                rounded-[30px]
                p-10
                flex flex-col
                space-y-10
                shadow-[8px_8px_25px_rgba(0,0,0,0.12),-8px_-8px_25px_rgba(255,255,255,0.8)]
              "
            >
              <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
                {/* Name Field */}
                <div className="space-y-3">
                  <label className="text-gray-700 text-lg font-medium block mb-2">
                    {fw.name || "Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={fw.your_name || "Your Name"}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 text-gray-900"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <label className="text-gray-700 text-lg font-medium block mb-2">
                    {fw.email || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={fw.your_email || "Your Email"}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-gray-400 text-gray-900"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-3">
                  <label className="text-gray-700 text-lg font-medium block mb-2">
                    {fw.message || "Message"}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={fw.your_message || "Your Message"}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none placeholder-gray-400 text-gray-900"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full
                    py-3
                    rounded-full
                    text-sm
                    font-medium
                    transition-colors
                    mt-4
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }
                  `}
                >
                  {isSubmitting 
                    ? fw.sending || "Sending..."
                    : fw.send_message || "Send Message"
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Faq />
        <CallToAction />
      </Suspense>
    </>
  );
}