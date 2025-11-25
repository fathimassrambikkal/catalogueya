// src/pages/Sign.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginCustomer, logoutCustomer, loginCompany, logoutCompany } from "../api";
import logo from "../assets/logo.png";

// Modern Glassmorphism Alert Component
const ModernAlert = ({ message, show, type = "success" }) => {
  if (!show) return null;

  const alertConfig = {
    success: {
      bg: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 13l4 4L19 7"
            style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'drawCheckmark 0.5s ease-out forwards' }}
          ></path>
        </svg>
      ),
      title: "Success!"
    },
    info: {
      bg: "bg-gradient-to-r from-green-500 to-emerald-500",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M5 13l4 4L19 7"
            style={{ strokeDasharray: 24, strokeDashoffset: 24, animation: 'drawCheckmark 0.5s ease-out forwards' }}
          ></path>
        </svg>
      ),
      title: "Success!"
    }
  };

  const config = alertConfig[type];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-in">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-4">
        <div className="flex items-center space-x-4">
          {/* Animated Icon */}
          <div className="relative">
            <div className={`w-14 h-14 ${config.bg} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
              {config.icon}
            </div>
            {/* Pulsing Effect */}
            <div className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {config.title}
            </h3>
            <p className="text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Sign() {
  const navigate = useNavigate();
  const { isRegistered } = useAuth();
  const [loginType, setLoginType] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const showModernAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "customer") return;

    setLoading(true);
    setError("");

    try {
      // REAL API LOGIN for customer
      const res = await loginCustomer(email, password);

      // Store customer data
      localStorage.setItem("authToken", res.data.token);
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isRegistered", "true");

      showModernAlert("Successfully signed in!", "success");
      
      // Redirect after alert is shown
      setTimeout(() => {
        navigate("/customer-login");
      }, 2000);
      
    } catch (err) {
      console.error("Customer login failed:", err);
      
      // TEMPORARY FALLBACK for customer
      const mockUser = {
        id: 1,
        name: email.split('@')[0] || 'Customer',
        email: email,
        type: 'customer',
        balance: 1234.56
      };
      
      localStorage.setItem("authToken", "temp_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("isRegistered", "true");

      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        navigate("/customer-login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "company") return;

    setLoading(true);
    setError("");

    try {
      // REAL API LOGIN for company
      const res = await loginCompany(companyEmail, companyPassword);

      const companyData = res.data.company;
      localStorage.setItem("companyToken", res.data.token);
      localStorage.setItem("company", JSON.stringify(companyData));

      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        navigate("/company-dashboard");
      }, 2000);
    } catch (err) {
      console.error("Company login failed → using TEMPORARY LOGIN", err);

      // TEMPORARY LOGIN FALLBACK for company
      const tempCompany = {
        id: "temp-" + Date.now(),
        name: "Temporary Demo Company",
        email: companyEmail,
        balance: 12345.67
      };

      localStorage.setItem("companyToken", "temporary_token");
      localStorage.setItem("company", JSON.stringify(tempCompany));

      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        navigate("/company-dashboard");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (loginType === "customer") {
      handleCustomerLogin(e);
    } else {
      handleCompanyLogin(e);
    }
  };

  return (
    <>
      {/* Modern Alert */}
      <ModernAlert 
        message={alertMessage}
        show={showAlert}
        type={alertType}
      />

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

            {/* Success message for newly registered users */}
            {isRegistered && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 text-green-700 rounded-2xl text-sm backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="font-medium">Registration successful! Please sign in to continue.</span>
                </div>
              </div>
            )}

            {/* Info message about temporary login */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-blue-700 rounded-2xl text-sm backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <span className="font-medium">Demo Mode: Temporary authentication active</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8 bg-gray-100/50 rounded-2xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setLoginType("customer")}
                className={`w-1/2 py-3 rounded-xl font-medium transition-all duration-300 ${
                  loginType === "customer"
                    ? "bg-white text-blue-600 shadow-lg border border-white/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/30"
                }`}
              >
                Customer
              </button>

              <button
                onClick={() => setLoginType("company")}
                className={`w-1/2 py-3 rounded-xl font-medium transition-all duration-300 ${
                  loginType === "company"
                    ? "bg-white text-blue-600 shadow-lg border border-white/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/30"
                }`}
              >
                Company
              </button>
            </div>

            {/* Login Forms */}
            {loginType === "customer" ? (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 text-red-700 rounded-2xl text-sm text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </div>
                      {error}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                    required
                  />
                </div>

                <div className="flex justify-end items-center text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            ) : (
              /* Company Login Form */
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 text-red-700 rounded-2xl text-sm text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </div>
                      {error}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Company email address"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                    required
                  />

                  <input
                    type="password"
                    placeholder="Company password"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                    required
                  />
                </div>

                <div className="flex justify-end items-center text-sm">
                  <Link
                    to="/company-forgot-password"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            )}

            {/* Registration link */}
            <p className="mt-8 text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <Link 
                to={loginType === "customer" ? "/register" : "/company-register"} 
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
              >
                Register as {loginType === "customer" ? "Customer" : "Company"}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes drawCheckmark {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes slide-in {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>

      {/* Global styles for the checkmark animation */}
      <style jsx global>{`
        @keyframes drawCheckmark {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}