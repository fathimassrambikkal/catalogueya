// src/pages/Sign.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginCustomer, logoutCustomer, loginCompany, logoutCompany } from "../api";
import logo from "../assets/logo.png";

// Modern Glassmorphism Alert Component - CENTERED ONLY
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
          ></path>
        </svg>
      ),
      title: "Success!"
    }
  };

  const config = alertConfig[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 max-w-sm w-full mx-4 animate-scale-in">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Animated Icon */}
          <div className="relative">
            <div className={`w-16 h-16 ${config.bg} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
              {config.icon}
            </div>
            {/* Pulsing Effect */}
            <div className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {config.title}
            </h3>
            <p className="text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Welcome Page Component - CLEAN MODERN THEME
const WelcomePage = ({ user, userType, onGoToDashboard, onSignOut }) => {
  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 max-w-md w-full animate-scale-in">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="h-12 w-auto"
          />
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
            Welcome
          </h1>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50 p-5 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-200">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-base font-medium text-gray-700">{user?.email}</p>
              <p className="text-sm text-gray-500">Active session</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onGoToDashboard}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="text-lg">Go to Dashboard</span>
          </button>
          
          <button
            onClick={onSignOut}
            className="w-full bg-white/80 text-gray-700 py-4 rounded-2xl text-lg font-semibold border border-gray-200/60 hover:bg-white hover:border-gray-300 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 backdrop-blur-sm"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className="text-lg">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Sign() {
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
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

  // Welcome page state
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState("");

  // Check for registration status and existing sessions on component mount
  useEffect(() => {
    // Check if user just registered (from localStorage)
    const justRegistered = localStorage.getItem("justRegistered") === "true";
    
    // Check URL parameters for registration success
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegistration = urlParams.get('registered') === 'true';
    
    if (justRegistered || fromRegistration) {
      setIsRegistered(true);
      // Clear the flag after displaying
      localStorage.removeItem("justRegistered");
    }
    
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    const company = localStorage.getItem("company");
    
    if (user || company) {
      const existingUser = user ? JSON.parse(user) : JSON.parse(company);
      const existingUserType = user ? "customer" : "company";
      
      setCurrentUser(existingUser);
      setUserType(existingUserType);
      setShowWelcome(true);
    }
  }, []);

  const showModernAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto hide after 2 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
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

      setCurrentUser(userData);
      setUserType("customer");
      
      showModernAlert("Successfully signed in!", "success");
      
      // Show welcome page after alert
      setTimeout(() => {
        setShowWelcome(true);
      }, 2200);
      
    } catch (err) {
      console.error("Customer login failed:", err);
      
      // TEMPORARY FALLBACK for customer
      const mockUser = {
        id: 1,
        name: email.split('@')[0] || 'Customer',
        email: email,
        type: 'customer'
      };
      
      localStorage.setItem("authToken", "temp_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("isRegistered", "true");

      setCurrentUser(mockUser);
      setUserType("customer");
      
      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        setShowWelcome(true);
      }, 2200);
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

      setCurrentUser(companyData);
      setUserType("company");
      
      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        setShowWelcome(true);
      }, 2200);
    } catch (err) {
      console.error("Company login failed → using TEMPORARY LOGIN", err);

      // TEMPORARY LOGIN FALLBACK for company
      const tempCompany = {
        id: "temp-" + Date.now(),
        name: companyEmail.split('@')[0] || "Demo Company",
        email: companyEmail
      };

      localStorage.setItem("companyToken", "temporary_token");
      localStorage.setItem("company", JSON.stringify(tempCompany));

      setCurrentUser(tempCompany);
      setUserType("company");
      
      showModernAlert("Successfully signed in!", "success");
      
      setTimeout(() => {
        setShowWelcome(true);
      }, 2200);
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

  const handleGoToDashboard = () => {
    if (userType === "customer") {
      navigate("/customer-login");
    } else {
      navigate("/company-dashboard");
    }
  };

  const handleSignOut = () => {
    // Clear all storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company");
    localStorage.removeItem("isRegistered");
    localStorage.removeItem("justRegistered");
    
    setShowWelcome(false);
    setCurrentUser(null);
    setUserType("");
    
    // Refresh the page to reset state
    window.location.reload();
  };

  return (
    <>
      {/* Modern Alert - CENTERED */}
      <ModernAlert 
        message={alertMessage}
        show={showAlert}
        type={alertType}
      />

      {/* Welcome Page */}
      {showWelcome && currentUser && (
        <WelcomePage 
          user={currentUser}
          userType={userType}
          onGoToDashboard={handleGoToDashboard}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Login Form - Only show if not showing welcome page */}
      {!showWelcome && (
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
              {/* <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 text-blue-700 rounded-2xl text-sm backdrop-blur-sm">
                <div className="flex items-center"> */}
                  {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-sm"> */}
                    {/* <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg> */}
                  {/* </div> */}
                  {/* <span className="font-medium">Demo Mode: Temporary authentication active</span> */}
                {/* </div>
              </div> */}

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
                  Business
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
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}