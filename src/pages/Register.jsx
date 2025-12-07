import React, { useState, useEffect, useRef } from "react";
import { registerCustomer, registerCompany } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [regType, setRegType] = useState("customer");
  const navigate = useNavigate();

  // ==================== Customer State ====================
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [customerErrors, setCustomerErrors] = useState({});

  // ==================== Company State ====================
  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyEmail: "",
    contactNumber: "",
    password: "",
    logo: null,
    address: "",
    coordinates: "",
    registrationNumber: "",
    about: "",
    workingHours: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedIn: "",
    deliver: "No",
    implement: "No",
  });

  const [companyErrors, setCompanyErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ==================== Input Handlers ====================
  const handleCustomerChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setCompanyData({ ...companyData, [name]: files[0] });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  // ==================== Validations ====================
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkPasswordStrength = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    return regex.test(password);
  };

  // ==================== Customer Submit ====================
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!customerData.firstName.trim()) errors.firstName = "First name is required";
    if (!customerData.lastName.trim()) errors.lastName = "Last name is required";
    if (!isValidEmail(customerData.email)) errors.email = "Invalid email format";
    if (!customerData.phone.trim()) errors.phone = "Phone number is required";
    if (!checkPasswordStrength(customerData.password))
      errors.password =
        "Password must be at least 6 characters with uppercase, lowercase, number, and special char";
    if (customerData.password !== customerData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setCustomerErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const fullName = `${customerData.firstName} ${customerData.lastName}`;

      // Include phone in the API call
      const response = await registerCustomer(fullName, customerData.email, customerData.password, customerData.phone);
      
      // Set registration success flag in localStorage
      localStorage.setItem("justRegistered", "true");
      
      setSuccessMessage("Customer Registered Successfully!");
      
      // Clear form
      setCustomerData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setCustomerErrors({});
      
      // Redirect to sign-in page after 2 seconds
      setTimeout(() => {
        navigate("/sign");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Customer registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // ==================== Company Submit ====================
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    if (!companyData.companyName.trim()) errors.companyName = "Company name is required";
    if (!isValidEmail(companyData.companyEmail))
      errors.companyEmail = "Invalid company email";
    if (!companyData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!companyData.logo) errors.logo = "Company logo is required";
    if (companyData.password && !checkPasswordStrength(companyData.password))
      errors.password =
        "Password must be at least 6 characters with uppercase, lowercase, number, and special char";

    setCompanyErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      await registerCompany(formData);

      // Set registration success flag in localStorage
      localStorage.setItem("justRegistered", "true");
      
      setSuccessMessage("Company Registered Successfully!");

      // Clear form
      setCompanyData({
        companyName: "",
        companyEmail: "",
        contactNumber: "",
        password: "",
        logo: null,
        address: "",
        coordinates: "",
        registrationNumber: "",
        about: "",
        workingHours: "",
        facebook: "",
        instagram: "",
        twitter: "",
        youtube: "",
        linkedIn: "",
        deliver: "No",
        implement: "No",
      });

      setCompanyErrors({});
      
      // Redirect to sign-in page after 2 seconds
      setTimeout(() => {
        navigate("/sign");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Company registration failed!");
    } finally {
      setLoading(false);
    }
  };

  // ==================== Google Map ====================
  useEffect(() => {
    const initMap = () => {
      const defaultCenter = { lat: 25.2048, lng: 55.2708 };
      const mapEl = document.getElementById("map");
      const inputEl = document.getElementById("autocomplete");
      if (!mapEl || !inputEl || !window.google) return;

      const map = new window.google.maps.Map(mapEl, {
        center: defaultCenter,
        zoom: 6,
      });

      const autocomplete = new window.google.maps.places.Autocomplete(inputEl);
      autocomplete.bindTo("bounds", map);

      const marker = new window.google.maps.Marker({ map, draggable: true });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;

        if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
        else map.setCenter(place.geometry.location);

        marker.setPosition(place.geometry.location);
        setCompanyData((prev) => ({
          ...prev,
          coordinates: `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`,
        }));
      });

      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        setCompanyData((prev) => ({
          ...prev,
          coordinates: `${pos.lat()}, ${pos.lng()}`,
        }));
      });
    };

    if (window.google && window.google.maps) initMap();
    else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // ==================== Success Message Component ====================
  const SuccessAlert = () => {
    if (!successMessage) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              {/* Pulsing Effect */}
              <div className="absolute inset-0 rounded-2xl bg-current opacity-20 animate-ping"></div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Success!
              </h3>
              <p className="text-gray-700 font-medium">{successMessage}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting to sign-in page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================== JSX ====================
  return (
    <>
      <SuccessAlert />
      
      <section className="min-h-screen flex items-center justify-center bg-[#f7f6f5] px-4 py-16">
        <div className="w-full max-w-6xl bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.05)] rounded-3xl p-8">

          {/* Tabs */}
          <div className="flex justify-center mb-8 bg-gray-100 p-2 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => setRegType("customer")}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                regType === "customer"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Customer Registration
            </button>

            <button
              onClick={() => setRegType("company")}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                regType === "company"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Company Registration
            </button>
          </div>

          {/* ================= CUSTOMER FORM ================= */}
          {regType === "customer" && (
            <form className="flex flex-col gap-4" onSubmit={handleCustomerSubmit}>
              
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
                    <p className="text-red-500 text-sm mt-1">{customerErrors.firstName}</p>
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
                    <p className="text-red-500 text-sm mt-1">{customerErrors.lastName}</p>
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
                    <p className="text-red-500 text-sm mt-1">{customerErrors[field]}</p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
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
            </form>
          )}

          {/* ================= COMPANY FORM ================= */}
          {regType === "company" && (
            <form className="flex flex-col gap-6" onSubmit={handleCompanySubmit}>
              <div className="flex flex-col lg:flex-row gap-6">

                {/* LEFT COLUMN */}
                <div className="flex-1 flex flex-col gap-4">

                  {/* Inputs */}
                  {[
                    { name: "companyName", placeholder: "Company Name *" },
                    { name: "companyEmail", placeholder: "Company Email *", type: "email" },
                    { name: "password", placeholder: "Password (optional)", type: "password" },
                    { name: "contactNumber", placeholder: "Contact Number *", type: "tel" },
                  ].map(({ name, placeholder, type = "text" }) => (
                    <div key={name}>
                      <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={companyData[name]}
                        onChange={handleCompanyChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                        focus:ring-2 focus:ring-black/10 transition"
                      />
                      {companyErrors[name] && (
                        <p className="text-red-500 text-sm mt-1">{companyErrors[name]}</p>
                      )}
                    </div>
                  ))}

                  {/* Logo Upload */}
                  <div className="flex flex-col gap-1 font-medium">
                    Company Logo *
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleCompanyChange}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl 
                      file:border file:border-gray-300 file:bg-white file:text-gray-700 
                      hover:file:bg-gray-100 transition"
                    />
                    {companyErrors.logo && (
                      <p className="text-red-500 text-sm">{companyErrors.logo}</p>
                    )}
                  </div>

                  {/* Address */}
                  <textarea
                    name="address"
                    placeholder="Company Address *"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                    focus:ring-2 focus:ring-black/10 transition"
                  />

                  {/* Map */}
                  <label className="font-semibold text-gray-800">Company Location</label>

                  <input
                    type="text"
                    id="autocomplete"
                    placeholder="Search place"
                    className="w-full px-4 py-3 mb-3 rounded-2xl bg-gray-50 border border-gray-200 
                    focus:ring-2 focus:ring-black/10"
                  />

                  <div id="map" className="w-full h-64 border border-gray-200 rounded-2xl"></div>

                  {companyData.coordinates && (
                    <p className="text-sm text-gray-600 mt-2">
                      Coordinates: <b>{companyData.coordinates}</b>
                    </p>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex-1 flex flex-col gap-4">
                  
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Registration Number"
                    value={companyData.registrationNumber}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                    focus:ring-2 focus:ring-black/10 transition"
                  />

                  <textarea
                    name="about"
                    placeholder="About Company"
                    value={companyData.about}
                    onChange={handleCompanyChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                    focus:ring-2 focus:ring-black/10 transition"
                  />

                  <input
                    type="text"
                    name="workingHours"
                    placeholder="Working Hours"
                    value={companyData.workingHours}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                    focus:ring-2 focus:ring-black/10 transition"
                  />

                  {["facebook", "instagram", "twitter", "youtube", "linkedIn"].map(
                    (platform) => (
                      <input
                        key={platform}
                        type="url"
                        name={platform}
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                        value={companyData[platform]}
                        onChange={handleCompanyChange}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                        focus:ring-2 focus:ring-black/10 transition"
                      />
                    )
                  )}

                  <div className="flex gap-4">
                    <div>
                      <label className="mr-2 font-medium">Do you deliver?</label>
                      <select
                        name="deliver"
                        value={companyData.deliver}
                        onChange={handleCompanyChange}
                        className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 
                        focus:ring-2 focus:ring-black/10"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>

                    <div>
                      <label className="mr-2 font-medium">Do you implement?</label>
                      <select
                        name="implement"
                        value={companyData.implement}
                        onChange={handleCompanyChange}
                        className="px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 
                        focus:ring-2 focus:ring-black/10"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#45a8ff] text-white py-3 rounded-full text-sm font-medium 
                    hover:bg-[#1b93ff] transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Registering Company...
                      </>
                    ) : (
                      "Register Company"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </section>

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