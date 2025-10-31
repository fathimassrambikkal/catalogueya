// src/pages/Sign.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sign() {
  const [loginType, setLoginType] = useState("customer");

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-16">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setLoginType("customer")}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              loginType === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => setLoginType("company")}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              loginType === "company"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Company Login
          </button>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          {loginType === "customer" ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-between items-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                Access the company portal by clicking here:
              </p>
              <Link
                to="/company-login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Company Login
              </Link>
            </>
          )}
        </form>

        {/* Registration link */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
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
