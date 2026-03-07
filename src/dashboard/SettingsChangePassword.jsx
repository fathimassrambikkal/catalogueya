import React, { useState } from "react";
import { changeCompanyPassword } from "../api";
import { BackIcon } from "./CompanySvg";
import { useFixedWords } from "../hooks/useFixedWords";
import { useTranslation } from "react-i18next";

export default function SettingsChangePassword({ onBack }) {

  const { fixedWords } = useFixedWords();
  const fw = fixedWords?.fixed_words || {};

  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

    if (!form.old_password || !form.new_password || !form.new_password_confirmation) {
      alert("Please fill all fields");
      return;
    }

    if (form.new_password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.new_password !== form.new_password_confirmation) {
      alert("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      const res = await changeCompanyPassword(form);

      if (res?.data?.status === "error" || res?.data?.errors) {
        throw { response: { data: res.data } };
      }

      setSuccessMessage(
        res?.data?.message ||
        res?.data?.msg ||
        fw.updated_successfully ||
        "Password changed successfully"
      );

      setForm({
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

    } catch (err) {

      let errorMsg = "Failed to change password";
      const data = err.response?.data || err.data;

      if (data?.errors && typeof data.errors === "object") {
        errorMsg = Object.values(data.errors).flat().join("\n");
      } else if (data?.errors && typeof data.errors === "string") {
        errorMsg = data.errors;
      } else if (data?.message) {
        errorMsg = data.message;
      }

      alert(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full mt-24 xs:mt-20 sm:mt-10 md:mt-10 lg:mt-10">

          <div className={`flex items-center gap-2 mb-6 mt-4 md:mt-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {onBack && (
                <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 mt-4 group ltr"
          dir="ltr"
        >
          <BackIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {fw.back || "Back"}
        </button>
                )}
              </div>

        {/* Header */}
        <div className="mb-6 xs:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-1 xs:mb-2">
            {fw.change_password || "Change Password"}
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6">

          {/* Current Password */}
          <div className="space-y-1 xs:space-y-2">
            <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
              {fw.password || "Current Password"}
            </label>

            <input
              type="password"
              name="old_password"
              value={form.old_password}
              onChange={handleChange}
              placeholder={fw.password || "Enter your current password"}
              className="w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl xs:rounded-2xl text-sm xs:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-xs xs:placeholder:text-sm placeholder:text-gray-400"
            />
          </div>

          {/* New Password */}
          <div className="space-y-1 xs:space-y-2">
            <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
              {fw.password || "New Password"}
            </label>

            <input
              type="password"
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              placeholder={fw.password || "Enter your new password"}
              className="w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl xs:rounded-2xl text-sm xs:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-xs xs:placeholder:text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1 xs:space-y-2">
            <label className="block text-xs xs:text-sm sm:text-base font-medium text-gray-700">
              {fw.confirm_password || "Confirm Password"}
            </label>

            <input
              type="password"
              name="new_password_confirmation"
              value={form.new_password_confirmation}
              onChange={handleChange}
              placeholder={fw.confirm_password || "Confirm password"}
              className="w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 bg-white border border-gray-200 rounded-xl xs:rounded-2xl text-sm xs:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-xs xs:placeholder:text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 xs:py-3.5 sm:py-4 px-3 xs:px-4 rounded-xl xs:rounded-2xl text-sm xs:text-base sm:text-lg font-semibold hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 mt-6 xs:mt-8"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 xs:h-5 w-4 xs:w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {fw.processing || "Processing..."}
              </span>
            ) : (
              fw.update || "Update Password"
            )}
          </button>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 xs:mt-6 p-3 xs:p-4 bg-green-50 border border-green-100 rounded-xl xs:rounded-2xl">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-5 xs:w-6 h-5 xs:h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 xs:w-4 h-3 xs:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xs xs:text-sm sm:text-base font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}