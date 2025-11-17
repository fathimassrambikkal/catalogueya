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

  useEffect(() => {
    const token = localStorage.getItem("companyToken");
    if (token) {
      navigate("/company-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED LOGIN FUNCTION WITH TEMPORARY LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginCompany(formData.email, formData.password);

      // Save token & company data
      localStorage.setItem("companyToken", res.data.token);
      localStorage.setItem("company", JSON.stringify(res.data.company));

      navigate("/company-dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      // ===================== TEMPORARY FALLBACK LOGIN =====================
      if (
        formData.email === "test@company.com" &&
        formData.password === "123456"
      ) {
        const tempCompany = {
          id: "temp-1",
          name: "Temporary Demo Company",
          email: formData.email,
        };

        localStorage.setItem("companyToken", "temporary_token");
        localStorage.setItem("company", JSON.stringify(tempCompany));

        alert("Temporary login active (API offline).");
        setLoading(false);
        return navigate("/company-dashboard");
      }
      // ====================================================================

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check email & password.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutCompany();
      localStorage.removeItem("companyToken");
      localStorage.removeItem("company");

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
        
        <img src={logo} alt="Company Logo" className="w-20 mb-4 opacity-90" />

        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Company Login
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          {error && (
            <p className="text-red-500 text-center text-sm font-medium">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
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

        <div className="mt-8 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
          <img src={logo} alt="Logo" className="w-5 h-5 opacity-70" />
          <span>© 2025 All rights reserved</span>
        </div>
      </div>
    </section>
  );
}
