import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      alert("Please enter your email address.");
      return;
    }

    setLoading(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      alert(`Password reset link sent to ${email}`);
      setEmail("");
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 py-16 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8">
          
          {/* Logo at top */}
          <div className="flex justify-center mb-8">
            <button 
              onClick={() => navigate("/")}
              className="hover:opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              <img 
                src={logo} 
                alt="Home" 
                className="h-14 w-auto"
              />
            </button>
          </div>

          {/* Info message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-blue-700 rounded-2xl text-sm backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="font-medium">We'll send a reset link to your email</span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
            Forgot Password
          </h1>
          <p className="text-gray-500 mb-6 text-sm text-center">
            Enter your registered email address, and we'll send you a reset link.
          </p>

          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link
                to="/sign"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}