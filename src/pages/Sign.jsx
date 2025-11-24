// src/pages/Sign.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sign() {
  const navigate = useNavigate();
  const { isRegistered } = useAuth();
  const [loginType, setLoginType] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "customer") return;

    setLoading(true);
    setError("");

    try {
      // TEMPORARY: Bypass actual login and redirect directly
      console.log("Temporary login bypass - redirecting to customer page");
      
      // Simulate successful login
      const mockUser = {
        id: 1,
        name: email.split('@')[0] || 'Customer',
        email: email,
        type: 'customer'
      };
      
      // Store in localStorage temporarily
      localStorage.setItem("authToken", "temp_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("isRegistered", "true");

      alert("Temporary login successful! Redirecting...");
      navigate("/customer-login"); // Redirect to customer login page
      
    } catch (err) {
      console.error(err);
      setError("Temporary login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-[#f7f6f5] py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.05)] p-8">
        
        {/* Login.png at top to navigate to home */}
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => navigate("/")}
            className="hover:opacity-80 transition-opacity duration-200"
          >
            <img 
              src="/logo.png" 
              alt="Home" 
              className="h-12 w-auto"
            />
          </button>
        </div>

        {/* Success message for newly registered users */}
        {isRegistered && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm">
            ✅ Registration successful! Please sign in to continue.
          </div>
        )}

        {/* Info message about temporary login */}
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-xl text-sm">
            ⚠️ Temporary Login: Bypassing authentication for development
          </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setLoginType("customer")}
            className={`w-1/2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              loginType === "customer"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500"
            }`}
          >
            Customer
          </button>

          <button
            onClick={() => setLoginType("company")}
            className={`w-1/2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              loginType === "company"
                ? "bg-white text-black shadow-sm"
                : "text-gray-500"
            }`}
          >
            Company
          </button>
        </div>

        {/* Customer Login Form */}
        {loginType === "customer" ? (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-black/10"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-black/10"
              required
            />

            <div className="flex justify-end items-center text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-black"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#45a8ff] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1b93ff] transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* Company Login Option */
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-sm">
              Company login portal for business accounts
            </p>
            <Link
              to="/company-login"
              className="w-full text-blue-500 py-3 rounded-xl hover:underline transition-all duration-200 block"
            >
              Go to Company Login
            </Link>
          </div>
        )}

        {/* Registration link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}