import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, loginCustomer, loginCompany, createCustomerConversation } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import logo from "../assets/logo.png";
import { useLocation } from "react-router-dom";

export default function Sign() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
 
  const [isRegistered, setIsRegistered] = useState(false);
  const [loginType, setLoginType] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);

  const location = useLocation();
const params = new URLSearchParams(location.search);
const redirectPath = params.get("redirect");
const action = params.get("action");

  useEffect(() => {
    if (auth.userType === "customer") {
      import("../pages/CustomerLogin");
    }

    if (auth.userType === "company") {
      import("../pages/CompanyDashboard");
    }
  }, [auth.userType]);

  useEffect(() => {
    // Check URL parameters for registration success
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegistration = urlParams.get("registered") === "true";

    if (fromRegistration) {
      setIsRegistered(true);
    }
  }, []);

  // REAL CUSTOMER LOGIN with TOKEN-based auth
  const handleCustomerLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "customer") return;

    setLoading(true);
    setError("");

    try {
      console.log("📤 Sending login request...", {
        email: email.trim(),
        password: password.trim(),
      });

      // 🔐 LOGIN API CALL
      const res = await loginCustomer(
        email.trim(),
        password.trim()
      );

      console.log("📥 FULL RESPONSE:", res);
      console.log("📥 RESPONSE DATA:", res.data);
      console.log(
        "📥 RESPONSE DATA STRUCTURE:",
        JSON.stringify(res.data, null, 2)
      );

      // 🔎 EXTRACT TOKEN (support multiple backend formats)
      const token =
        res.data?.token ||
        res.data?.access_token ||
        res.data?.data?.token ||
        res.data?.authorization?.token;

      console.log("🔍 Token extracted:", token);

      if (!token) {
        throw new Error("Login succeeded but token missing from response");
      }

      // 👤 EXTRACT USER
     const user = res.data?.data?.user;

if (!user || !user.name) {
  throw new Error("User data missing from login response");
}


      console.log("👤 User extracted:", user);

     

      console.log("✅ Token saved in localStorage:", {
        tokenInLS: localStorage.getItem("token"),
      });

      // 🧠 STORE USER IN REDUX
      dispatch(
        loginSuccess({
          user,
          userType: "customer",
        })
      );

      // ✅ SAVE FOR REHYDRATION
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", "customer");
      console.log("✅ Redux updated");


      // 🔥 HANDLE CHAT INTENT REDIRECT
      if (redirectPath?.startsWith("/chat-intent/company/")) {
        const companyId = redirectPath.split("/").pop();

        try {
          const res = await createCustomerConversation({
            is_group: false,
            participant_ids: [Number(companyId)],
          });

          const conversationId =
            res.data?.data?.id ||
            res.data?.conversation?.id ||
            res.data?.id;

          if (!conversationId) {
            console.error("Conversation ID missing after login", res.data);
            return;
          }

          navigate(`/customer-login/chat/${conversationId}`, { replace: true });
          return;
        } catch (err) {
          console.error("Chat creation after login failed", err);
        }
      }

      // ✅ Normal redirect (non-chat)
      if (redirectPath) {
  const finalRedirect = action
    ? `${redirectPath}?action=${action}`
    : redirectPath;

  navigate(finalRedirect, { replace: true });
  return;
}


      // ✅ PRODUCTION redirect
      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ LOGIN ERROR:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 422) {
        setError("Validation error");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // DEMO COMPANY LOGIN (NO API)
  const handleCompanyLogin = async (e) => {
    e.preventDefault();
    if (loginType !== "company") return;

    setLoading(true);
    setError("");

    try {
      console.log("🧪 DEMO Company login:", {
        email: companyEmail.trim(),
        password: companyPassword.trim(),
      });

      // ⛔ Simple demo validation
      if (!companyEmail.trim() || !companyPassword.trim()) {
        throw new Error("Email and password are required");
      }

      // 🧪 Fake token
      const demoToken = "demo-company-token-123456";

      // 🧪 Fake company user
      const demoCompanyUser = {
        id: "demo-company-id",
        email: companyEmail.trim(),
        name: "Demo Company",
        isDemo: true,
      };

      // 🔐 SAVE TOKEN (same as real login)
      localStorage.setItem("token", demoToken);

      console.log("✅ Demo token saved:", demoToken);
      console.log("👤 Demo company user:", demoCompanyUser);

      // 🧠 UPDATE REDUX
      dispatch(
        loginSuccess({
          user: demoCompanyUser,
          userType: "company",
        })
      );

      // ✅ PRODUCTION redirect
      navigate("/company-dashboard", { replace: true });

    } catch (err) {
      console.error("❌ DEMO COMPANY LOGIN ERROR:", err.message);
      setError(err.message || "Demo login failed");
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
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 py-16 px-4 overflow-x-hidden">
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
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {error}
      </div>
    </div>
  )}

  <div className="space-y-4">
    {/* Email */}
    <input
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50
                 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
      required
    />

    {/* Password with SVG eye */}
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-4 pr-12 rounded-2xl bg-white/50
                   border border-gray-200/50 text-sm
                   focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                   transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(v => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-700 transition"
        aria-label="Toggle password visibility"
      >
        {showPassword ? (
          /* Eye OFF */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.584 10.586a2 2 0 002.83 2.83
                 M9.88 5.08A9.94 9.94 0 0112 5
                 c4.478 0 8.268 2.943 9.543 7
                 a9.96 9.96 0 01-4.093 5.063
                 M6.1 6.1A9.957 9.957 0 002.458 12
                 c1.274 4.057 5.064 7 9.542 7
                 a9.94 9.94 0 004.31-.98"
            />
          </svg>
        ) : (
          /* Eye ON */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5
                 c4.478 0 8.268 2.943 9.542 7
                 -1.274 4.057-5.064 7-9.542 7
                 -4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
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
    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white
               py-4 rounded-2xl text-sm font-semibold
               hover:from-blue-600 hover:to-cyan-600
               transition-all duration-300 transform hover:scale-[1.02]
               disabled:opacity-50 disabled:transform-none
               shadow-lg hover:shadow-xl"
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
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        {error}
      </div>
    </div>
  )}

  <div className="space-y-4">
    {/* Company Email */}
    <input
      type="email"
      placeholder="Company email address"
      value={companyEmail}
      onChange={(e) => setCompanyEmail(e.target.value)}
      className="w-full px-4 py-4 rounded-2xl bg-white/50
                 border border-gray-200/50 text-sm
                 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
      required
    />

    {/* Company Password with SVG eye */}
    <div className="relative">
      <input
        type={showCompanyPassword ? "text" : "password"}
        placeholder="Company password"
        value={companyPassword}
        onChange={(e) => setCompanyPassword(e.target.value)}
        className="w-full px-4 py-4 pr-12 rounded-2xl bg-white/50
                   border border-gray-200/50 text-sm
                   focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                   transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
        required
      />

      <button
        type="button"
        onClick={() => setShowCompanyPassword(v => !v)}
        className="absolute right-4 top-1/2 -translate-y-1/2
                   text-gray-400 hover:text-gray-700 transition"
        aria-label="Toggle password visibility"
      >
        {showCompanyPassword ? (
          /* Eye OFF */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M10.584 10.586a2 2 0 002.83 2.83
                 M9.88 5.08A9.94 9.94 0 0112 5
                 c4.478 0 8.268 2.943 9.543 7
                 a9.96 9.96 0 01-4.093 5.063
                 M6.1 6.1A9.957 9.957 0 002.458 12
                 c1.274 4.057 5.064 7 9.542 7
                 a9.94 9.94 0 004.31-.98"
            />
          </svg>
        ) : (
          /* Eye ON */
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5
                 c4.478 0 8.268 2.943 9.542 7
                 -1.274 4.057-5.064 7-9.542 7
                 -4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
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
    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500
               text-white py-4 rounded-2xl text-sm font-semibold
               hover:from-blue-600 hover:to-cyan-600
               transition-all duration-300 transform hover:scale-[1.02]
               disabled:opacity-50 disabled:transform-none
               shadow-lg hover:shadow-xl"
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
            Don&apos;t have an account?{" "}
            {loginType === "customer" ? (
              <Link
                to="/customer-register"
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Register
              </Link>
            ) : (
              <Link
                to="/company-register"
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Register
              </Link>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}