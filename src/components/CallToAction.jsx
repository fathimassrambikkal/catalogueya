import React from "react";
import { Link } from "react-router-dom";

const CallToAction = React.memo(() => {
  return (
    <section className="w-full flex flex-col items-center py-20 px-4 bg-neutral-100">

      {/* TITLE */}
      <h2 className="text-center text-4xl sm:text-5xl font-light text-gray-900 tracking-tighter mb-4">
        Let's <span className="text-blue-600 font-normal">Stay Connected</span>
      </h2>

      {/* SUBTITLE */}
      <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl">
        Have questions or feedback? Reach out, and we'll get back to you in no time.
      </p>

      {/* FORM */}
      <form className="w-full max-w-3xl flex flex-col gap-8">

        {/* Name & Email - side by side on desktop */}
        <div className="flex flex-col sm:flex-row gap-6">
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{
              boxShadow: `
                inset 3px 3px 6px #d1d5db,
                inset -3px -3px 6px #ffffff
              `
            }}
          />

          <input
            type="email"
            placeholder="Your email"
            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            style={{
              boxShadow: `
                inset 3px 3px 6px #d1d5db,
                inset -3px -3px 6px #ffffff
              `
            }}
          />
        </div>

        {/* Message */}
        <textarea
          rows="5"
          placeholder="Your message..."
          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-500 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          style={{
            boxShadow: `
              inset 3px 3px 6px #d1d5db,
              inset -3px -3px 6px #ffffff
            `
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 text-white text-lg font-medium rounded-full bg-blue-500 hover:bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Submit
        </button>
      </form>

      {/* REGISTER LINK */}
      <p className="text-center text-gray-600 font-medium text-sm sm:text-base mt-8">
        Are you a business owner?{" "}
        <Link
          to="/register"
          className="text-blue-600 underline font-semibold hover:text-blue-700 transition-colors"
        >
          Register
        </Link>
      </p>
    </section>
  );
});

export default CallToAction;