import React, { useState, useEffect, useRef } from "react";

export default function Register() {
  const [regType, setRegType] = useState("customer");

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [companyData, setCompanyData] = useState({
    companyName: "",
    companyEmail: "",
    contactNumber: "",
    logo: null,
    categories: [],
    dropdownOpen: false,
    address: "",
    location: "",
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

  const categories = [
    "Carpenter",
    "Paint",
    "Wallpaper",
    "Gardening",
    "Lights",
    "Security",
    "Curtains",
  ];

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

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (customerData.password !== customerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Customer Registered Successfully!");
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    alert("Company Registered Successfully!");
  };

  // Close dropdown when clicked outside
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

  // Initialize Google Map safely
  useEffect(() => {
    const initMap = () => {
      try {
        const defaultCenter = { lat: 25.2048, lng: 55.2708 }; // Dubai default
        const mapEl = document.getElementById("map");
        const inputEl = document.getElementById("autocomplete");

        if (!mapEl || !inputEl || !window.google) return;

        const map = new window.google.maps.Map(mapEl, {
          center: defaultCenter,
          zoom: 6,
          mapTypeId: "roadmap",
        });

        const autocomplete = new window.google.maps.places.Autocomplete(inputEl);
        autocomplete.bindTo("bounds", map);

        const marker = new window.google.maps.Marker({
          map,
          draggable: true,
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) return;

          if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
          else {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
          }

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
      } catch (err) {
        console.error("Map init error:", err);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(interval);
          initMap();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section className="min-h-[100vh] flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-8">
        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            onClick={() => setRegType("customer")}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              regType === "customer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Customer Registration
          </button>
          <button
            onClick={() => setRegType("company")}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              regType === "company"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Company Registration
          </button>
        </div>

        {/* Customer Registration */}
        {regType === "customer" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Complete the form below to become our valued customer
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleCustomerSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={customerData.firstName}
                  onChange={handleCustomerChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={customerData.lastName}
                  onChange={handleCustomerChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={customerData.email}
                onChange={handleCustomerChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={customerData.phone}
                onChange={handleCustomerChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={customerData.password}
                onChange={handleCustomerChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={customerData.confirmPassword}
                onChange={handleCustomerChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
          </>
        )}

        {/* Company Registration */}
        {regType === "company" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Business Owners: Complete Your Company Registration
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleCompanySubmit}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side */}
                <div className="flex-1 flex flex-col gap-4">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name *"
                    value={companyData.companyName}
                    onChange={handleCompanyChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    name="companyEmail"
                    placeholder="Company Email *"
                    value={companyData.companyEmail}
                    onChange={handleCompanyChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number *"
                    value={companyData.contactNumber}
                    onChange={handleCompanyChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="flex flex-col gap-2 font-medium">
                    Company Logo
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleCompanyChange}
                    />
                  </label>

                  {/* Category Dropdown */}
                  <div ref={dropdownRef} className="relative">
                    <label className="font-medium">Product Categories</label>
                    <div
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white cursor-pointer"
                      onClick={() =>
                        setCompanyData({
                          ...companyData,
                          dropdownOpen: !companyData.dropdownOpen,
                        })
                      }
                    >
                      {companyData.categories.length > 0
                        ? companyData.categories.join(", ")
                        : "Select Categories"}
                    </div>
                    {companyData.dropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-lg">
                        {categories.map((cat) => (
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
                                  : companyData.categories.filter(
                                      (c) => c !== cat
                                    );
                                setCompanyData({
                                  ...companyData,
                                  categories: selected,
                                });
                              }}
                            />
                            {cat}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Address & Map */}
                  <textarea
                    name="address"
                    placeholder="Company Address"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="font-semibold">Company Location</label>
                  <input
                    type="text"
                    id="autocomplete"
                    placeholder="Search place"
                    className="w-full px-4 py-3 mb-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    id="map"
                    className="w-full h-64 border rounded-xl"
                  ></div>
                  {companyData.coordinates && (
                    <p className="text-sm text-gray-600 mt-2">
                      Coordinates: <b>{companyData.coordinates}</b>
                    </p>
                  )}
                </div>

                {/* Right Side */}
                <div className="flex-1 flex flex-col gap-4">
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Registration Number"
                    value={companyData.registrationNumber}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="about"
                    placeholder="About Company"
                    value={companyData.about}
                    onChange={handleCompanyChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="workingHours"
                    placeholder="Working Hours"
                    value={companyData.workingHours}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    )
                  )}

                  {/* Options */}
                  <div className="flex gap-4">
                    <div>
                      <label className="mr-2">Do you deliver?</label>
                      <select
                        name="deliver"
                        value={companyData.deliver}
                        onChange={handleCompanyChange}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                    <div>
                      <label className="mr-2">Do you implement?</label>
                      <select
                        name="implement"
                        value={companyData.implement}
                        onChange={handleCompanyChange}
                        className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition mt-4"
                  >
                    Register Company
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
