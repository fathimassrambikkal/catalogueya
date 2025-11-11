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

  // ✅ Check if company is already logged in
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginCompany(formData.email, formData.password);
      const { token, company } = response.data;

      // Save token and company info
      localStorage.setItem("companyToken", token);
      localStorage.setItem("company", JSON.stringify(company));

      setIsLoggedIn(true);
      alert("Company logged in successfully!");

      // Redirect to dashboard
      navigate("/company-dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Call logout API
      await logoutCompany();

      // Remove token and info
      localStorage.removeItem("companyToken");
      localStorage.removeItem("company");

      setIsLoggedIn(false);
      alert("Logged out successfully!");
      navigate("/company-login"); // back to login page
    } catch (err) {
      console.error(err);
      alert("Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        {/* Logo */}
        <img src={logo} alt="Company Logo" className="w-20 mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {isLoggedIn ? "Company Dashboard" : "Company Login"}
        </h1>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="w-full space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end text-sm">
              <Link to="/company-forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <p className="text-gray-700">You are logged in as a company.</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <img src={logo} alt="Logo" className="w-5 h-5 opacity-70" />
          <span>© 2025 All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
