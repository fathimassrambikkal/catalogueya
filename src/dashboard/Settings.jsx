import React, { useState, useEffect } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
  FaPinterest, FaSnapchat, FaWhatsapp, FaGooglePlusG, FaTrash,
  FaChevronDown, FaChevronUp
} from "react-icons/fa";

export default function Settings({ companyInfo, setCompanyInfo }) {
  const [form, setForm] = useState({ ...companyInfo });
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setForm({ ...companyInfo });
  }, [companyInfo]);

  const specialtiesList = [
    "Carpenter",
    "Curtains & Blind",
    "Lighting",
    "Paint",
    "Carpet",
  ];

  // Convert file to Base64 
  const toBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File upload 
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const base64 = await toBase64(files[0]);

    setForm((prev) => ({
      ...prev,
      [name]: base64, // stored as base64
    }));
  };

  const toggleSpecialty = (item) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(item)
        ? prev.specialties.filter((s) => s !== item)
        : [...prev.specialties, item],
    }));
  };

  const handleDeleteFile = (name) => {
    setForm((prev) => ({ ...prev, [name]: null }));
  };

  const handleSave = () => {
    setCompanyInfo({ ...form }); // update parent
    alert("Settings saved!");
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Are you sure you want to delete all settings?")) return;

    const empty = {
      companyName: "",
      companyDescription: "",
      contactMobile: "",
      address: "",
      specialties: [],
      logo: null,
      coverPhoto: null,
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      pinterest: "",
      snapchat: "",
      whatsapp: "",
      google: "",
    };

    setForm(empty);
    setCompanyInfo(empty);
  };

  const toggleSpecialtiesDropdown = () => {
    if (isSpecialtiesOpen) {
      // Start closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setIsSpecialtiesOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsSpecialtiesOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="rounded-2xl p-6
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">

          {/* UPLOADS */}
          <div className="space-y-6 mb-8">
            {/* Cover Photo */}
            <div>
              <label className="font-semibold text-gray-900 block mb-3">Cover Photo</label>

              {form.coverPhoto && (
                <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden
                  shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                  <img
                    src={form.coverPhoto}
                    alt="cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFile("coverPhoto")}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-all duration-200
                      shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}

              <input 
                type="file" 
                name="coverPhoto" 
                onChange={handleFileChange}
                className="w-full p-3 rounded-xl border border-gray-200/60 bg-white/50
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="font-semibold text-gray-900 block mb-3">Logo</label>

              {form.logo && (
                <div className="relative w-24 h-24 mb-3 rounded-xl overflow-hidden
                  shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                  <img
                    src={form.logo}
                    alt="logo preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFile("logo")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 transition-all duration-200
                      shadow-[2px_2px_8px_rgba(239,68,68,0.3)]"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}

              <input 
                type="file" 
                name="logo" 
                onChange={handleFileChange}
                className="w-full p-3 rounded-xl border border-gray-200/60 bg-white/50
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* FORM FIELDS */}
          <form className="space-y-6">
            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
            />
            <textarea
              name="companyDescription"
              placeholder="Company Description"
              value={form.companyDescription}
              onChange={handleChange}
              rows="4"
              className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
            />
            <input
              name="contactMobile"
              placeholder="Contact Mobile"
              value={form.contactMobile}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]"
            />

            {/* SPECIALTIES DROPDOWN */}
            <div className="relative">
              <label className="font-semibold text-gray-900 block mb-3">Specialties</label>
              
              {/* Dropdown Trigger */}
              <button
                type="button"
                onClick={toggleSpecialtiesDropdown}
                className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50 flex items-center justify-between 
                  hover:bg-white/70 transition-all duration-200 text-gray-900
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
              >
                <span>Select Specialties ({form.specialties.length} selected)</span>
                {isSpecialtiesOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
              </button>

              {/* Dropdown Content with Fade Effect */}
              {(isSpecialtiesOpen || isAnimating) && (
                <div className={`
                  absolute top-full left-0 right-0 mt-2 rounded-xl z-10 
                  transition-all duration-300 ease-in-out overflow-hidden
                  bg-white/95 backdrop-blur-lg border border-gray-200/60
                  shadow-[3px_3px_15px_rgba(0,0,0,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]
                  ${isSpecialtiesOpen && !isAnimating 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-2'
                  }
                `}>
                  <div className="p-3 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                    {specialtiesList.map((item) => (
                      <label key={item} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50/80 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={form.specialties.includes(item)}
                          onChange={() => toggleSpecialty(item)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-900 text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Specialties Display */}
              {form.specialties.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.specialties.map((specialty) => (
                    <span 
                      key={specialty} 
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2
                        shadow-[2px_2px_8px_rgba(59,130,246,0.2)]"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => toggleSpecialty(specialty)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SOCIAL MEDIA */}
            <div>
              <label className="font-semibold text-gray-900 block mb-3">Social Media</label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "youtube", icon: FaYoutube, color: "text-red-600" },
                  { key: "instagram", icon: FaInstagram, color: "text-pink-500" },
                  { key: "facebook", icon: FaFacebook, color: "text-blue-600" },
                  { key: "google", icon: FaGooglePlusG, color: "text-red-500" },
                  { key: "whatsapp", icon: FaWhatsapp, color: "text-green-500" },
                  { key: "pinterest", icon: FaPinterest, color: "text-red-600" },
                  { key: "linkedin", icon: FaLinkedin, color: "text-blue-700" },
                  { key: "snapchat", icon: FaSnapchat, color: "text-yellow-400" },
                ].map(({ key, icon: Icon, color }) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-xl
                    bg-white/50 border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                    <Icon size={20} className={color} />
                    <input
                      name={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={form[key]}
                      onChange={handleChange}
                      className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 p-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_15px_rgba(59,130,246,0.4)]
                  hover:scale-[1.02]"
              >
                Save Settings
              </button>

              <button
                type="button"
                onClick={handleDeleteAll}
                className="flex-1 p-4 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200
                  shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]
                  hover:scale-[1.02]"
              >
                Delete All
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}