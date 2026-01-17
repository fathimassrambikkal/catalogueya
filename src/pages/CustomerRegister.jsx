import React, { useState } from "react";
import { registerCustomer } from "../api";
import { useNavigate } from "react-router-dom";

export default function CustomerRegister() {
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
  const navigate = useNavigate();

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
    
    if (!customerData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    
    if (!customerData.password) {
      errors.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(customerData.password)) {
      errors.password = "Password must be at least 6 characters with uppercase, lowercase, number, and special character";
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
      navigate("/sign");

    } catch (error) {
      if (error.response?.status === 422) {
        const backendErrors = error.response.data?.errors || {};
        const mappedErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          if (key === "first_name") {
            mappedErrors.firstName = backendErrors[key];
          } else if (key === "last_name") {
            mappedErrors.lastName = backendErrors[key];
          } else if (key === "password_confirmation") {
            mappedErrors.confirmPassword = backendErrors[key];
          } else {
            mappedErrors[key] = backendErrors[key];
          }
        });

        setCustomerErrors(mappedErrors);
      } else {
        console.error(error);
        alert("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.05)] rounded-3xl p-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Customer Registration</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={customerData.firstName}
              onChange={handleCustomerChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />
            {customerErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(customerErrors.firstName)
                  ? customerErrors.firstName[0]
                  : customerErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={customerData.lastName}
              onChange={handleCustomerChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />
            {customerErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(customerErrors.lastName)
                  ? customerErrors.lastName[0]
                  : customerErrors.lastName}
              </p>
            )}
          </div>
        </div>

        {["email", "phone", "password", "confirmPassword"].map((field) => (
          <div key={field}>
            <input
              type={field.includes("password") ? "password" : field === "email" ? "email" : "tel"}
              name={field}
              placeholder={
                field === "confirmPassword"
                  ? "Confirm Password *"
                  : field.charAt(0).toUpperCase() + field.slice(1) + " *"
              }
              value={customerData[field]}
              onChange={handleCustomerChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />
            {customerErrors[field] && (
              <p className="text-red-500 text-sm mt-1">
                {Array.isArray(customerErrors[field])
                  ? customerErrors[field][0]
                  : customerErrors[field]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          onClick={handleCustomerSubmit}
          className="w-full bg-[#45a8ff] text-white py-3 rounded-full text-sm font-medium hover:bg-[#1b93ff] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Registering...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </div>
    </div>
  );
}