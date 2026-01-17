import React, { useState, useEffect } from "react";
import { registerCompany } from "../api";
import { useNavigate } from "react-router-dom";

export default function CompanyRegister() {
  const [companyData, setCompanyData] = useState({
    name_en: "",
    name_ar: "",
    email: "",
    phone: "",
    password: "",
    logo: null,
    address_en: "",
    address_ar: "",
    description_en: "",
    description_ar: "",
    start_time_work: "",
    end_time_work: "",
    status: "active",
    whatsapp: "",
    instagram: "",
    tweeter: "",
    facebook: "",
    youtube: "",
  });

  const [companyErrors, setCompanyErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState("");
  
  const navigate = useNavigate();

  const handleCompanyChange = (e) => {
    const { name, value, type, files } = e.target;
    setCompanyData({
      ...companyData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

 const checkPasswordStrength = (password) => {
  if (!password) return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
  return regex.test(password);
};

  const handleCompanySubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const errors = {};

  if (!companyData.name_en.trim())
    errors.name_en = "Company name (English) is required";

  if (!companyData.name_ar.trim())
    errors.name_ar = "Company name (Arabic) is required";

  if (!isValidEmail(companyData.email))
    errors.email = "Invalid email address";

  if (!companyData.phone.trim())
    errors.phone = "Phone number is required";

  if (!companyData.logo)
    errors.logo = "Company logo is required";

  if (!companyData.password.trim()) {
  errors.password = "Password is required";
} else if (!checkPasswordStrength(companyData.password)) {
  errors.password =
    "Password must be at least 6 characters with uppercase, lowercase, number, and special character";
}


  setCompanyErrors(errors);
  if (Object.keys(errors).length > 0) {
    console.warn("❌ Validation failed:", errors);
    setLoading(false);
    return;
  }

  try {
    // 🔍 LOG STATE DATA
    console.log("🟡 Company Data (state):", companyData);
    console.log("🟡 Coordinates:", coordinates);

    // Prepare FormData
    const formData = new FormData();

    Object.keys(companyData).forEach((key) => {
      if (companyData[key] !== null && companyData[key] !== "") {
        formData.append(key, companyData[key]);
      }
    });

    // Coordinates are UI-only (backend may ignore)
    if (coordinates) {
      formData.append("coordinates", coordinates);
    }

    // 🔍 LOG FORMDATA CONTENT (IMPORTANT)
    console.log("🟡 FormData being sent:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    // 🚀 API CALL
    const response = await registerCompany(formData);

    // ✅ SUCCESS LOG
    console.log("🟢 Company registered successfully:", response);

    localStorage.setItem("justRegistered", "true");

    // Reset form
    setCompanyData({
      name_en: "",
      name_ar: "",
      email: "",
      phone: "",
      password: "",
      logo: null,
      address_en: "",
      address_ar: "",
      description_en: "",
      description_ar: "",
      start_time_work: "",
      end_time_work: "",
      status: "active",
      whatsapp: "",
      instagram: "",
      tweeter: "",
      facebook: "",
      youtube: "",
    });

    setCoordinates("");
    setCompanyErrors({});

    navigate("/sign");

  } catch (err) {
    console.error("🔴 Company registration failed");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Response data:", err.response.data);
      console.error("Headers:", err.response.headers);
    } else {
      console.error("Error message:", err.message);
    }

    alert(err.response?.data?.message || "Company registration failed!");
  } finally {
    setLoading(false);
  }
};


  // Google Map initialization
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
        const coords = `${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
        setCoordinates(coords);
        setCompanyData(prev => ({
          ...prev,
          address_en: place.formatted_address || "",
          address_ar: place.formatted_address || "",
        }));
      });

      marker.addListener("dragend", () => {
        const pos = marker.getPosition();
        const coords = `${pos.lat()}, ${pos.lng()}`;
        setCoordinates(coords);
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

  return (
    <div className="w-full max-w-6xl bg-white border border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.05)] rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Company Registration</h2>
      
      <form className="flex flex-col gap-6" onSubmit={handleCompanySubmit}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT COLUMN */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Company Name (English) */}
            <div>
              <input
                type="text"
                name="name_en"
                placeholder="Company Name (English) *"
                value={companyData.name_en}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
              {companyErrors.name_en && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.name_en}</p>
              )}
            </div>

            {/* Company Name (Arabic) */}
            <div>
              <input
                type="text"
                name="name_ar"
                placeholder="Company Name (Arabic) *"
                value={companyData.name_ar}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
              {companyErrors.name_ar && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.name_ar}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={companyData.email}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
              {companyErrors.email && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone *"
                value={companyData.phone}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
              {companyErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password *"
                value={companyData.password}
                onChange={handleCompanyChange}
                 required
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
              {companyErrors.password && (
                <p className="text-red-500 text-sm mt-1">{companyErrors.password}</p>
              )}
            </div>

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

            {/* Address (English) */}
            <textarea
              name="address_en"
              placeholder="Company Address (English)"
              value={companyData.address_en}
              onChange={handleCompanyChange}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />

            {/* Address (Arabic) */}
            <textarea
              name="address_ar"
              placeholder="Company Address (Arabic)"
              value={companyData.address_ar}
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

            {coordinates && (
              <p className="text-sm text-gray-600 mt-2">
                Coordinates: <b>{coordinates}</b>
              </p>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Working Hours */}
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="start_time_work"
                  placeholder="Start Time (e.g., 09:00)"
                  value={companyData.start_time_work}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                  focus:ring-2 focus:ring-black/10 transition"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="end_time_work"
                  placeholder="End Time (e.g., 17:00)"
                  value={companyData.end_time_work}
                  onChange={handleCompanyChange}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                  focus:ring-2 focus:ring-black/10 transition"
                />
              </div>
            </div>

            {/* Description (English) */}
            <textarea
              name="description_en"
              placeholder="Company Description (English)"
              value={companyData.description_en}
              onChange={handleCompanyChange}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />

            {/* Description (Arabic) */}
            <textarea
              name="description_ar"
              placeholder="Company Description (Arabic)"
              value={companyData.description_ar}
              onChange={handleCompanyChange}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />

            {/* WhatsApp */}
            <input
              type="tel"
              name="whatsapp"
              placeholder="WhatsApp Number"
              value={companyData.whatsapp}
              onChange={handleCompanyChange}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
              focus:ring-2 focus:ring-black/10 transition"
            />

            {/* Social Media Links */}
            {[
              { name: "facebook", placeholder: "Facebook URL" },
              { name: "instagram", placeholder: "Instagram URL" },
              { name: "tweeter", placeholder: "Twitter (X) URL" },
              { name: "youtube", placeholder: "YouTube URL" },
            ].map(({ name, placeholder }) => (
              <input
                key={name}
                type="url"
                name={name}
                placeholder={placeholder}
                value={companyData[name]}
                onChange={handleCompanyChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 
                focus:ring-2 focus:ring-black/10 transition"
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#45a8ff] text-white py-3 rounded-full text-sm font-medium 
              hover:bg-[#1b93ff] transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed 
              flex items-center justify-center"
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

            {/* Hidden status field */}
            <input type="hidden" name="status" value="active" />
          </div>
        </div>
      </form>
    </div>
  );
}