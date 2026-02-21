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
    <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-gray-400 hover:text-gray-600 transition z-10"
        >
          <FaTimes size={24} />
        </button>

        <div className="p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Join Catalogueya today and start exploring</p>
          </div>

          <form onSubmit={handleCustomerSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={customerData.firstName}
                  onChange={handleCustomerChange}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
                />
                {customerErrors.firstName && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={customerData.lastName}
                  onChange={handleCustomerChange}
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
                />
                {customerErrors.lastName && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={customerData.email}
                onChange={handleCustomerChange}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
              />
              {customerErrors.email && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+974 XXXX XXXX"
                value={customerData.phone}
                onChange={handleCustomerChange}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
              />
              {customerErrors.phone && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={customerData.password}
                    onChange={handleCustomerChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {customerErrors.password && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-4">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={customerData.confirmPassword}
                    onChange={handleCustomerChange}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 transition outline-none text-sm font-medium"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {customerErrors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-4">{customerErrors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-5 rounded-2xl text-base font-black shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm font-bold text-gray-400">
              Already have an account?{" "}
              <button onClick={onShowLogin} className="text-blue-500 hover:underline">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
