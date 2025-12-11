import React, { useState, useEffect } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
  FaPinterest, FaSnapchat, FaWhatsapp, FaGooglePlusG,
  FaTrash, FaChevronDown, FaChevronUp,
  FaCheckCircle
} from "react-icons/fa";
import { editCompanyPost } from "../api";

export default function Settings({ companyId, companyInfo = {}, setCompanyInfo }) {

  const initial = {
  companyName: "",
  companyDescription: "",
  contactMobile: "", // This will map to 'phone' in API
  address: "",
  // REMOVED: specialties: [],
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
  ...companyInfo,
};

  const [form, setForm] = useState(initial);
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // false | "confirm" | "success"

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    setForm({
      ...initial,
      specialties: Array.isArray(initial.specialties) ? initial.specialties : [],
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...companyInfo,
      specialties: Array.isArray(companyInfo?.specialties)
        ? companyInfo.specialties
        : prev.specialties,
    }));
  }, [companyInfo]);

  const specialtiesList = [
    "Carpenter",
    "Curtains & Blind",
    "Lighting",
    "Paint",
    "Carpet",
  ];

  /* ---------- INPUTS ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ✅ CORRECT FILE HANDLING */
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    setForm((prev) => ({
      ...prev,
      [name]: files[0], // File object
    }));
  };

  const toggleSpecialty = (item) => {
    setForm((prev) => {
      const arr = Array.isArray(prev.specialties) ? prev.specialties : [];
      return {
        ...prev,
        specialties: arr.includes(item)
          ? arr.filter((x) => x !== item)
          : [...arr, item],
      };
    });
  };

  const handleDeleteFile = (name) => {
    setForm((prev) => ({ ...prev, [name]: null }));
  };

  /* ---------- SAVE ---------- */
const handleSave = async () => {
  try {
    // Prepare data according to backend API requirements
    const apiData = {
      // File uploads
      logo: form.logo,
      cover_photo: form.coverPhoto,
      
      // Basic info
      name: form.companyName || "",
      address: form.address || "",
      phone: form.contactMobile || "",  // Changed from 'mobile' to 'phone'
      description: form.companyDescription || "",
      
      // Social media
      whatsapp: form.whatsapp || "",
      snapchat: form.snapchat || "",
      pinterest: form.pinterest || "",
      instagram: form.instagram || "",
      tweeter: form.facebook || "",  // Important: 'tweeter' uses facebook value
      facebook: form.facebook || "",
      youtube: form.youtube || "",
      google: form.google || "",
      linkedin: form.linkedin || "",
      
      // REMOVED: specialties (not in API documentation)
    };

    console.log('📤 Sending to API:', apiData);

    // Send to API
    await editCompanyPost(companyId, apiData);

    // Update local state - map phone back to contactMobile for your UI
    const updatedCompanyInfo = {
      ...form,
      contactMobile: apiData.phone, // Ensure consistency
    };
    
    setCompanyInfo(updatedCompanyInfo);
    
    // Also update localStorage if needed
    const currentCompany = JSON.parse(localStorage.getItem('company') || '{}');
    const updatedLocalCompany = {
      ...currentCompany,
      name: apiData.name,
      description: apiData.description,
      phone: apiData.phone,
      address: apiData.address,
      whatsapp: apiData.whatsapp,
      snapchat: apiData.snapchat,
      pinterest: apiData.pinterest,
      instagram: apiData.instagram,
      tweeter: apiData.tweeter,
      facebook: apiData.facebook,
      youtube: apiData.youtube,
      google: apiData.google,
      linkedin: apiData.linkedin,
    };
    localStorage.setItem('company', JSON.stringify(updatedLocalCompany));

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    
  } catch (err) {
    console.error('❌ Save error:', err);
    
    // Better error handling
    if (err.response) {
      // Server responded with error
      console.error('Server error:', err.response.status, err.response.data);
      alert(`Server error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      // Request was made but no response
      console.error('No response:', err.request);
      alert('No response from server. Check CORS settings or network connection.');
    } else {
      // Something else
      alert(`Failed to save settings: ${err.message}`);
    }
  }
};

  /* ---------- DELETE ---------- */
  const handleDeleteAll = async () => {
    try {
      await editCompanyPost(companyId, {
        name: "",
        description: "",
        mobile: "",
        address: "",
        specialties: [],
        logo: null,
        cover_photo: null,
        facebook: "",
        instagram: "",
        youtube: "",
        linkedin: "",
        pinterest: "",
        snapchat: "",
        whatsapp: "",
        google: "",
      });

      setForm({ ...initial });
      setCompanyInfo({ ...initial });

      setShowDeleteAlert("success");
      setTimeout(() => setShowDeleteAlert(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete settings");
    }
  };

  /* ---------- SPECIALTIES DROPDOWN TOGGLE (MISSING BEFORE) ---------- */
  const toggleSpecialtiesDropdown = () => {
    if (isSpecialtiesOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsSpecialtiesOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsSpecialtiesOpen(true);
    }
  };


  /* ---------- CONFIRM DELETE MODAL ---------- */
  const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
          <h3 className="font-bold mb-2">Delete All Settings?</h3>
          <p className="text-gray-600 text-sm mb-4">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 bg-red-600 text-white p-2 rounded">
              Delete All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    // top-level container: force no horizontal overflow
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6 overflow-x-hidden"
      style={{ maxWidth: "100vw", boxSizing: "border-box" }}
    >
      {/* Save Success Alert */}
      {showAlert && (
        <div
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50"
          style={{ maxWidth: "calc(100vw - 32px)", boxSizing: "border-box", overflowX: "hidden" }}
        >
          <div className="relative bg-white/80 backdrop-blur-2xl border border-blue-200/50 rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40 flex-shrink-0">
                <FaCheckCircle className="text-white text-xl" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Success</h3>
                <p className="text-gray-600 text-sm truncate">Settings have been saved successfully</p>
              </div>

              <button onClick={() => setShowAlert(false)} className="text-gray-400 hover:text-gray-600 p-1">
                ✕
              </button>
            </div>

            <div className="w-full mt-4 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ animation: "appleProgress 3s linear forwards" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Alert */}
      {showDeleteAlert === "success" && (
        <div
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50"
          style={{ maxWidth: "calc(100vw - 32px)", boxSizing: "border-box", overflowX: "hidden" }}
        >
          <div className="relative bg-white/80 backdrop-blur-2xl border border-red-300/50 rounded-2xl p-4 sm:p-5 shadow-xl shadow-red-500/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 flex-shrink-0">
                <FaCheckCircle className="text-white text-xl" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Deleted</h3>
                <p className="text-gray-600 text-sm truncate">All settings have been cleared</p>
              </div>

              <button onClick={() => setShowDeleteAlert(false)} className="text-gray-400 hover:text-gray-600 p-1">
                ✕
              </button>
            </div>

            <div className="w-full mt-4 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600"
                style={{ animation: "appleProgress 3s linear forwards" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteAlert === "confirm"}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleDeleteAll}
      />

      <div className="max-w-6xl mx-auto" style={{ paddingLeft: 8, paddingRight: 8 }}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 mt-2 sm:mt-4 break-words">
          Settings
        </h1>

        <div className="rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
          {/* FORM WITH SCROLL */}
          <div className="max-h-[calc(100vh-120px)] sm:max-h-[80vh] overflow-y-auto p-3 sm:p-4 md:p-6">
            {/* UPLOADS */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              {/* Cover Photo */}
              <div>
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                  Cover Photo
                </label>

                {form.coverPhoto && (
                  <div className="relative w-full h-32 sm:h-40 mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                    <img
                      src={typeof form.coverPhoto === "string" ? form.coverPhoto : URL.createObjectURL(form.coverPhoto)}
                      alt="cover preview"
                      className="w-full h-full object-cover max-w-full"
                      style={{ display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("coverPhoto")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-200 text-xs shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  name="coverPhoto"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300"
                  style={{ boxSizing: "border-box" }}
                />
              </div>

              {/* Logo */}
              <div>
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                  Logo
                </label>

                {form.logo && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                    <img
                      src={typeof form.logo === "string" ? form.logo : URL.createObjectURL(form.logo)}
                      alt="logo preview"
                      className="w-full h-full object-contain max-w-full"
                      style={{ display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("logo")}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-all duration-200 text-xs shadow-[2px_2px_8px_rgba(239,68,68,0.3)]"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300"
                  style={{ boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* FORM FIELDS */}
            <form className="space-y-4 sm:space-y-6">
              <input
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
                style={{ minWidth: 0 }}
              />

              <textarea
                name="companyDescription"
                placeholder="Company Description"
                value={form.companyDescription}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 resize-none"
                style={{ minWidth: 0 }}
              />

              <input
                name="contactMobile"
                placeholder="Contact Mobile"
                value={form.contactMobile}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
                style={{ minWidth: 0 }}
              />

              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
                style={{ minWidth: 0 }}
              />

              {/* SPECIALTIES DROPDOWN */}
              <div className="relative" style={{ minWidth: 0 }}>
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                  Specialties
                </label>

                <button
                  type="button"
                  onClick={toggleSpecialtiesDropdown}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 flex items-center justify-between text-sm sm:text-base hover:bg-white/70 transition-all duration-200 text-gray-900 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span className="truncate">
                    Select ({(form.specialties || []).length} selected)
                  </span>
                  {isSpecialtiesOpen ? (
                    <FaChevronUp className="text-gray-600 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-600 flex-shrink-0" />
                  )}
                </button>

                {(isSpecialtiesOpen || isAnimating) && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 rounded-lg sm:rounded-xl z-10 transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-lg border border-blue-200/60 shadow-[3px_3px_15px_rgba(59,130,246,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]"
                    style={{ maxWidth: "100vw", overflowX: "hidden" }}
                  >
                    <div className="p-2 sm:p-3 grid grid-cols-1 gap-1 sm:gap-2 max-h-40 sm:max-h-60 overflow-y-auto">
                      {specialtiesList.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded hover:bg-blue-50/50 cursor-pointer transition-all duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={(form.specialties || []).includes(item)}
                            onChange={() => toggleSpecialty(item)}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 flex-shrink-0"
                          />
                          <span className="text-gray-900 text-xs sm:text-sm font-medium truncate">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(form.specialties || []).length > 0 && (
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                    {(form.specialties || []).map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 max-w-full"
                      >
                        <span className="truncate">{specialty}</span>
                        <button
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className="text-white hover:text-blue-100 text-xs font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full hover:bg-white/20"
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
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                  Social Media
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
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
                    <div
                      key={key}
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base bg-white/50 border border-gray-200/60 hover:border-blue-300/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)] transition-all duration-200 group"
                    >
                      <Icon
                        size={18}
                        className={`${color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
                      />
                      <input
                        name={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={form[key] || ""}
                        onChange={handleChange}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-xs sm:text-sm focus:placeholder-blue-300 transition-colors duration-200"
                        style={{ minWidth: 0 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Settings
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAlert("confirm")}
                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base hover:from-red-600 hover:to-red-700 transition-all duration-200 transform shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Delete All
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
