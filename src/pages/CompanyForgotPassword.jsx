
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function CompanyForgotPassword() {
  const [username, setUsername] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Please enter your username or email.");
      return;
    }
    // Simulate password reset request
    alert(`Password reset link sent to ${username}`);
    setUsername("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        {/* Logo */}
        <img src={logo} alt="Company Logo" className="w-20 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Company Forgot Password
        </h1>
        <p className="text-gray-500 mb-6 text-sm text-center">
          Enter your username or registered email, and we'll send you a reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleReset} className="w-full space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-sm">
          <Link
            to="/company-login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Company Login
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <img src={logo} alt="Logo" className="w-5 h-5 opacity-70" />
          <span>© 2025 All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
