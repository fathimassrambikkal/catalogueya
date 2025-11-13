// src/pages/CompanyLogin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { loginCompany, logoutCompany } from "../api";

export default function CompanyLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("companyToken");
    if (token) {
      setIsLoggedIn(true);
      navigate("/company-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Temporary login: just navigate to dashboard
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/company-dashboard");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutCompany();
      localStorage.removeItem("companyToken");
      localStorage.removeItem("company");

      setIsLoggedIn(false);
      alert("Logged out successfully!");
      navigate("/company-login");
    } catch (err) {
      console.error(err);
      alert("Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-100 shadow-xl p-8 flex flex-col items-center backdrop-blur-sm">
        {/* Logo */}
        <img src={logo} alt="Company Logo" className="w-20 mb-4 opacity-90" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isLoggedIn ? "Company Dashboard" : "Company Login"}
        </h1>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div className="flex justify-end text-sm">
              <Link
                to="/company-forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-gray-700">You are logged in as a company.</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
          <img src={logo} alt="Logo" className="w-5 h-5 opacity-70" />
          <span>© 2025 All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
