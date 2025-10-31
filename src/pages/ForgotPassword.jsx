import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Please enter your email address.");
      return;
    }
    // Simulate password reset request
    alert(`Password reset link sent to ${email}`);
    setEmail("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Forgot Password
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your registered email address, and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-sm">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link
              to="/sign"
              className="text-blue-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
