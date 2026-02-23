import React, { useState } from "react";
import { registerCustomer } from "../../api";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

export default function CustomerRegisterModal({ isOpen, onClose, onShowLogin }) {
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [customerErrors, setCustomerErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleCustomerChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setCustomerErrors({});
    setLoading(true);

    // Frontend validation
    const errors = {};
    if (!customerData.firstName.trim()) errors.firstName = "First name is required";
    if (!customerData.lastName.trim()) errors.lastName = "Last name is required";
    if (!customerData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
      errors.email = "Invalid email address";
    }
    if (!customerData.phone.trim()) errors.phone = "Phone number is required";
    if (!customerData.password) {
      errors.password = "Password is required";
    }
    if (customerData.password !== customerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setCustomerErrors(errors);
      setLoading(false);
      return;
    }

    try {
      await registerCustomer({
        first_name: customerData.firstName.trim(),
        last_name: customerData.lastName.trim(),
        phone: customerData.phone.replace(/\D/g, ""),
        email: customerData.email.trim().toLowerCase(),
        password: customerData.password,
        password_confirmation: customerData.confirmPassword,
      });

      alert("Customer Registered Successfully!");
      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setCustomerErrors(error.response.data?.errors || {});
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        {/* Simple backdrop - just blur */}
        <div 
            className="absolute inset-0 backdrop-blur-sm bg-gray-900/60 "
            onClick={onClose}
        />
        
        {/* Modal - Apple/Stripe style */}
        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100">
            {/* Close button - minimal */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex items-center justify-center z-10"
            >
                <FaTimes size={18} />
            </button>

            <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Create account</h2>
                    <p className="text-sm text-gray-500">Join Catalogueya today and start exploring</p>
                </div>

                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={customerData.firstName}
                                onChange={handleCustomerChange}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${customerErrors.firstName ? 'border-red-300 bg-red-50/30' : ''}`}
                            />
                            {customerErrors.firstName && <p className="text-red-500 text-xs px-3">{customerErrors.firstName}</p>}
                        </div>
                        <div className="space-y-1">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={customerData.lastName}
                                onChange={handleCustomerChange}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${customerErrors.lastName ? 'border-red-300 bg-red-50/30' : ''}`}
                            />
                            {customerErrors.lastName && <p className="text-red-500 text-xs px-3">{customerErrors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={customerData.email}
                            onChange={handleCustomerChange}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${customerErrors.email ? 'border-red-300 bg-red-50/30' : ''}`}
                        />
                        {customerErrors.email && <p className="text-red-500 text-xs px-3">{customerErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            value={customerData.phone}
                            onChange={handleCustomerChange}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition ${customerErrors.phone ? 'border-red-300 bg-red-50/30' : ''}`}
                        />
                        {customerErrors.phone && <p className="text-red-500 text-xs px-3">{customerErrors.phone}</p>}
                    </div>

                    {/* Password Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={customerData.password}
                                    onChange={handleCustomerChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition pr-10 ${customerErrors.password ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            {customerErrors.password && <p className="text-red-500 text-xs px-3">{customerErrors.password}</p>}
                        </div>
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm"
                                    value={customerData.confirmPassword}
                                    onChange={handleCustomerChange}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition pr-10 ${customerErrors.confirmPassword ? 'border-red-300 bg-red-50/30' : ''}`}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                </button>
                            </div>
                            {customerErrors.confirmPassword && <p className="text-red-500 text-xs px-3">{customerErrors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-3.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <button 
                            onClick={onShowLogin} 
                            className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    </div>
);
}
