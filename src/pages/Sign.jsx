// src/pages/Sign.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer, logoutCustomer } from "../api"; 

export default function Sign() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "customer") return;

    setLoading(true);
    setError("");

    try {
      const response = await loginCustomer(email, password);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      setIsLoggedIn(true);
      alert("Customer logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutCustomer();
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      alert("Customer logged out successfully!");
      navigate("/sign");
    } catch (err) {
      console.error(err);
      alert("Logout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex justify-center mb-8 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setLoginType("customer")}
            className={`w-1/2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              loginType === "customer"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => setLoginType("company")}
            className={`w-1/2 py-2.5 rounded-xl font-medium transition-all duration-200 ${
              loginType === "company"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600"
            }`}
          >
            Company
          </button>
        </div>

        {/* Form or Logout */}
        {loginType === "customer" ? (
          !isLoggedIn ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
              <div className="flex justify-end items-center text-sm">
                <Link
                  to="/forgot-password"
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
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <p className="text-gray-700 text-center">
                You are logged in as a customer.
              </p>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-all duration-200"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )
        ) : (
          <p className="text-gray-600 text-center text-sm">
            Access the company portal by clicking here:{" "}
            <Link
              to="/company-login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Company Login
            </Link>
          </p>
        )}

        {/* Registration link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
