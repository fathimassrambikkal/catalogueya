import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { forgotPasswordCompany, resetPasswordCompany } from "../api";
import { showToast } from "../utils/showToast";
import { useFixedWords } from "../hooks/useFixedWords";

export default function CompanyForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast(fw.enter_email_address || "Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const resp = await forgotPasswordCompany(email);
      // If the API returns a message and no error was thrown, or if status is explicitly true
      if (resp.data.status !== false) {
        showToast(
  fw.reset_link_sent_email || resp.data.message || "Reset code sent to your email."
);
        setStep(2);
      } else {
        showToast(fw.failed || resp.data.message || "Failed to send reset code.");
      }
    } catch (error) {
      showToast(error.response?.data?.message || fw.danger || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const resp = await resetPasswordCompany({
        email,
        code,
        password,
        password_confirmation: confirmPassword,
      });
      if (resp.data.status !== false) {
        showToast(fw.updated_successfully || resp.data.message || "Password reset successfully.");
        navigate("/sign");
      } else {
        showToast(resp.data.message || fw.failed || "Failed to reset password.");
      }
    } catch (error) {
        showToast(error.response?.data?.message || fw.danger || "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="font-medium">
                {step === 1
 ? fw.reset_link_sent_email || "We'll send a code to your email"
 : fw.enter_new_password || "Enter the code and your new password"}
              </span>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
{step === 1
 ? fw.forgot_password || "Forgot Password"
 : fw.reset_password || "Reset Password"}
          </h1>
          <p className="text-gray-500 mb-6 text-sm text-center">
            {step === 1
              ? fw.enter_registered_email || "Enter your registered email, and we'll send you a reset code."
              : fw.enter_new_password || "Enter the code and your new password"}
          </p>

          <form onSubmit={step === 1 ? handleForgotPassword : handleResetPassword} className="space-y-5">
            <div className="space-y-4">
              {step === 1 ? (
                <input
                  type="email"
                  placeholder={fw.enter_email_address || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                  required
                />
              ) : (
                <>
                    <input
                      type="text"
                      placeholder={fw.enter || "Enter reset code"}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder={fw.new_password || "New password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                      required
                    />
                    <input
                      type="password"
                      placeholder={fw.confirm_password || "Confirm new password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-white/50 border border-gray-200/50 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 backdrop-blur-sm placeholder-gray-500"
                      required
                    />
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {step === 1
 ? `${fw.sending || "Sending"}...`
 : fw.processing || "Processing..."}
                </div>
              ) : (
  step === 1
  ? fw.send_message || "Send"
  : fw.reset_password || "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              {fw.remember_password || "Remember your password?"}{" "}
              <Link
                to="/sign"
                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors duration-200"
              >
                {fw.back_to_company_login || "Back to Company Login"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}