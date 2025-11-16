import React, { useState, useEffect, useRef } from "react";
import { registerCustomer, registerCompany } from "../api";

export default function Register() {
  const [regType, setRegType] = useState("customer");

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
    categories: [],
    dropdownOpen: false,
    categorySearch: "",
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

  const categories = [
    "Carpenter",
    "Paint",
    "Wallpaper",
    "Gardening",
    "Lights",
    "Security",
    "Curtains",
  ];

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
    if (Object.keys(errors).length > 0) return;

    try {
      await registerCustomer(customerData);
      alert("Customer Registered Successfully!");
      setCustomerData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setCustomerErrors({});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Customer registration failed!");
    }
  };

  // ==================== Company Submit ====================
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!companyData.companyName.trim()) errors.companyName = "Company name is required";
    if (!isValidEmail(companyData.companyEmail))
      errors.companyEmail = "Invalid company email";
    if (!companyData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!companyData.logo) errors.logo = "Company logo is required";
    if (companyData.categories.length === 0) errors.categories = "Select at least one category";
    if (companyData.password && !checkPasswordStrength(companyData.password))
      errors.password =
        "Password must be at least 6 characters with uppercase, lowercase, number, and special char";

    setCompanyErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (key === "categories") formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });

      await registerCompany(formData);
      alert("Company Registered Successfully!");
      setCompanyData({
        companyName: "",
        companyEmail: "",
        contactNumber: "",
        password: "",
        logo: null,
        categories: [],
        dropdownOpen: false,
        categorySearch: "",
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
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Company registration failed!");
    }
  };

  // ==================== Dropdown ====================
  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCompanyData((prev) => ({ ...prev, dropdownOpen: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // ==================== Filtered Categories ====================
  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(companyData.categorySearch.toLowerCase())
  );

  // ==================== JSX ====================
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-16">
  <div className="w-full max-w-6xl bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-3xl p-8">
    {/* Tabs */}
    <div className="flex justify-center mb-8 gap-4">
      <button
        onClick={() => setRegType("customer")}
        className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
          regType === "customer"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Customer Registration
      </button>
      <button
        onClick={() => setRegType("company")}
        className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
          regType === "company"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
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
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
            />
            {customerErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">{customerErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Remaining customer fields */}
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
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
            />
            {customerErrors[field] && (
              <p className="text-red-500 text-sm mt-1">{customerErrors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200"
        >
          Sign Up
        </button>
      </form>
    )}

    {/* ================= COMPANY FORM ================= */}
    {regType === "company" && (
      <form className="flex flex-col gap-6" onSubmit={handleCompanySubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-4">
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                />
                {companyErrors[name] && (
                  <p className="text-red-500 text-sm mt-1">{companyErrors[name]}</p>
                )}
              </div>
            ))}

            {/* Company Logo */}
            <div className="flex flex-col gap-2 font-medium">
              Company Logo *
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleCompanyChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
              />
              {companyErrors.logo && (
                <p className="text-red-500 text-sm">{companyErrors.logo}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="font-medium text-gray-800">Product Categories *</label>
              <input
                type="text"
                placeholder="Search categories..."
                value={companyData.categorySearch}
                onChange={(e) =>
                  setCompanyData({ ...companyData, categorySearch: e.target.value })
                }
                className="w-full px-4 py-2 mb-1 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <div
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setCompanyData({ ...companyData, dropdownOpen: !companyData.dropdownOpen })
                }
              >
                {companyData.categories.length > 0
                  ? companyData.categories.join(", ")
                  : "Select Categories"}
              </div>
              {companyErrors.categories && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.categories}</p>
              )}
              {companyData.dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg">
                  {filteredCategories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={companyData.categories.includes(cat)}
                        onChange={(e) => {
                          const selected = e.target.checked
                            ? [...companyData.categories, cat]
                            : companyData.categories.filter((c) => c !== cat);
                          setCompanyData({ ...companyData, categories: selected });
                        }}
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <textarea
              name="address"
              placeholder="Company Address *"
              value={companyData.address}
              onChange={handleCompanyChange}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />

            {/* Map Section */}
            <label className="font-semibold text-gray-800">Company Location</label>
            <input
              type="text"
              id="autocomplete"
              placeholder="Search place"
              className="w-full px-4 py-3 mb-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <div id="map" className="w-full h-64 border rounded-xl"></div>
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
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="about"
              placeholder="About Company"
              value={companyData.about}
              onChange={handleCompanyChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="workingHours"
              placeholder="Working Hours"
              value={companyData.workingHours}
              onChange={handleCompanyChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
            />

            {/* Social Links */}
            {["facebook", "instagram", "twitter", "youtube", "linkedIn"].map(
              (platform) => (
                <input
                  key={platform}
                  type="url"
                  name={platform}
                  placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                  value={companyData[platform]}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              )
            )}

            {/* Delivery & Implementation */}
            <div className="flex gap-4">
              <div>
                <label className="mr-2 font-medium">Do you deliver?</label>
                <select
                  name="deliver"
                  value={companyData.deliver}
                  onChange={handleCompanyChange}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200 mt-4"
            >
              Register Company
            </button>
          </div>
        </div>
      </form>
    )}
  </div>
</section>

  );
}
