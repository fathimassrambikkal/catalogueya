import React, { useState, useEffect } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
  FaPinterest, FaSnapchat, FaWhatsapp, FaGooglePlusG, FaTrash,
  FaChevronDown, FaChevronUp, FaCheckCircle, FaExclamationTriangle
} from "react-icons/fa";

export default function Settings({ companyInfo, setCompanyInfo }) {
  const [form, setForm] = useState({ ...companyInfo });
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
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
    
    // Show modern alert
    setShowAlert(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleDeleteAll = () => {
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
    
    // Show delete success alert
    setShowDeleteAlert(true);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setShowDeleteAlert(false);
    }, 3000);
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

  // Delete confirmation modal
  const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm min-w-0">
        <div className="bg-white/95 backdrop-blur-lg border border-red-200/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl
          shadow-red-500/20 max-w-full sm:max-w-md w-full mx-2 sm:mx-4 transform transition-all duration-300 ease-out
          border-l-4 border-l-red-500 animate-modal-in min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0 overflow-x-hidden">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center
                shadow-lg shadow-red-500/30 min-w-0">
                <FaExclamationTriangle className="text-white text-sm sm:text-lg" />
              </div>
            </div>
            <div className="flex-1 min-w-0 overflow-x-hidden">
              <h3 className="font-bold text-gray-900 text-base sm:text-lg min-w-0 break-words">Delete All Settings?</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 min-w-0 break-words">This action cannot be undone. All your settings will be permanently removed.</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 min-w-0 overflow-x-hidden">
            <button
              onClick={onClose}
              className="flex-1 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm
                hover:bg-gray-200 transition-all duration-200 transform
                shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20
                hover:scale-[1.02] active:scale-[0.98] min-w-0 break-words"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-xs sm:text-sm
                hover:from-red-600 hover:to-red-700 transition-all duration-200 transform
                shadow-lg shadow-red-500/30 hover:shadow-red-500/40
                hover:scale-[1.02] active:scale-[0.98] min-w-0 break-words"
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6 overflow-x-hidden min-w-0">
      {/* Save Success Alert */}
      {showAlert && (
        <div
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 
                     max-w-[calc(100vw-32px)] min-w-0"
          style={{ animation: "appleAlertIn 0.55s cubic-bezier(.19,1,.22,1)" }}
        >
          <div className="
            relative bg-white/80 backdrop-blur-2xl border border-blue-200/50 
            rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-500/10
            overflow-hidden
          ">

            {/* Soft blue glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                              flex items-center justify-center shadow-lg shadow-blue-500/40">
                <FaCheckCircle className="text-white text-xl" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Success</h3>
                <p className="text-gray-600 text-sm truncate">
                  Settings have been saved successfully
                </p>
              </div>

              <button
                onClick={() => setShowAlert(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
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
      {showDeleteAlert === true && (
        <div
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 
                     max-w-[calc(100vw-32px)] min-w-0"
          style={{ animation: "appleAlertIn 0.55s cubic-bezier(.19,1,.22,1)" }}
        >
          <div className="
            relative bg-white/80 backdrop-blur-2xl border border-red-300/50 
            rounded-2xl p-4 sm:p-5 shadow-xl shadow-red-500/10
            overflow-hidden
          ">

            {/* Red glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-transparent pointer-events-none" />

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 
                              flex items-center justify-center shadow-lg shadow-red-500/40">
                <FaCheckCircle className="text-white text-xl" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg">Deleted</h3>
                <p className="text-gray-600 text-sm truncate">
                  All settings have been cleared
                </p>
              </div>

              <button
                onClick={() => setShowDeleteAlert(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
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
        isOpen={showDeleteAlert === 'confirm'}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleDeleteAll}
      />

      <div className="max-w-6xl mx-auto min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 mt-2 sm:mt-4 min-w-0 break-words">Settings</h1>

        <div className="rounded-xl sm:rounded-2xl
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] min-w-0">

          {/* FORM WITH SCROLL - FIXED FOR MOBILE */}
          <div className="max-h-[calc(100vh-120px)] sm:max-h-[80vh] overflow-y-auto p-3 sm:p-4 md:p-6 min-w-0">
            {/* UPLOADS */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 min-w-0">
              {/* Cover Photo */}
              <div className="min-w-0">
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base min-w-0 break-words">Cover Photo</label>

                {form.coverPhoto && (
                  <div className="relative w-full h-32 sm:h-40 mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden
                    shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] min-w-0">
                    <img
                      src={form.coverPhoto}
                      alt="cover preview"
                      className="w-full h-full object-cover min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("coverPhoto")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-200 text-xs
                        shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)] flex-shrink-0 min-w-0"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                )}

                <input 
                  type="file" 
                  name="coverPhoto" 
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm
                    file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 min-w-0"
                />
              </div>

              {/* Logo */}
              <div className="min-w-0">
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base min-w-0 break-words">Logo</label>

                {form.logo && (
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden
                    shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] min-w-0">
                    <img
                      src={form.logo}
                      alt="logo preview"
                      className="w-full h-full object-contain min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("logo")}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-all duration-200 text-xs
                        shadow-[2px_2px_8px_rgba(239,68,68,0.3)] flex-shrink-0 min-w-0"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )}

                <input 
                  type="file" 
                  name="logo" 
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm
                    file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 min-w-0"
                />
              </div>
            </div>

            {/* FORM FIELDS */}
            <form className="space-y-4 sm:space-y-6 min-w-0">
              <input
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200 min-w-0"
              />
              <textarea
                name="companyDescription"
                placeholder="Company Description"
                value={form.companyDescription}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200 resize-none min-w-0"
              />
              <input
                name="contactMobile"
                placeholder="Contact Mobile"
                value={form.contactMobile}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200 min-w-0"
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200 min-w-0"
              />

              {/* SPECIALTIES DROPDOWN */}
              <div className="relative min-w-0">
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base min-w-0 break-words">Specialties</label>
                
                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={toggleSpecialtiesDropdown}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 flex items-center justify-between text-sm sm:text-base
                    hover:bg-white/70 transition-all duration-200 text-gray-900
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-0 overflow-x-hidden"
                >
                  <span className="truncate min-w-0 break-words">Select ({form.specialties.length} selected)</span>
                  {isSpecialtiesOpen ? <FaChevronUp className="text-gray-600 flex-shrink-0" /> : <FaChevronDown className="text-gray-600 flex-shrink-0" />}
                </button>

                {/* Dropdown Content with Fade Effect */}
                {(isSpecialtiesOpen || isAnimating) && (
                  <div className={`
                    absolute top-full left-0 right-0 mt-2 rounded-lg sm:rounded-xl z-10 
                    transition-all duration-300 ease-in-out overflow-hidden min-w-0
                    bg-white/95 backdrop-blur-lg border border-blue-200/60
                    shadow-[3px_3px_15px_rgba(59,130,246,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]
                    ${isSpecialtiesOpen && !isAnimating 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform -translate-y-2'
                    }
                  `}>
                    <div className="p-2 sm:p-3 grid grid-cols-1 gap-1 sm:gap-2 max-h-40 sm:max-h-60 overflow-y-auto min-w-0">
                      {specialtiesList.map((item) => (
                        <label key={item} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded hover:bg-blue-50/50 cursor-pointer transition-all duration-200 min-w-0 overflow-x-hidden">
                          <input
                            type="checkbox"
                            checked={form.specialties.includes(item)}
                            onChange={() => toggleSpecialty(item)}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 flex-shrink-0"
                          />
                          <span className="text-gray-900 text-xs sm:text-sm font-medium truncate break-words min-w-0">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Specialties Display */}
                {form.specialties.length > 0 && (
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 min-w-0 overflow-x-hidden">
                    {form.specialties.map((specialty) => (
                      <span 
                        key={specialty} 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2
                          shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200 max-w-full min-w-0 break-words"
                      >
                        <span className="truncate min-w-0 break-words">{specialty}</span>
                        <button
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className="text-white hover:text-blue-100 text-xs font-bold transition-colors w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full hover:bg-white/20 flex-shrink-0 min-w-0"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SOCIAL MEDIA */}
              <div className="min-w-0">
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base min-w-0 break-words">Social Media</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 min-w-0 overflow-x-hidden">
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
                    <div key={key} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base
                      bg-white/50 border border-gray-200/60 hover:border-blue-300/60
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                      hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(59,130,246,0.1)]
                      transition-all duration-200 group min-w-0 overflow-x-hidden">
                      <Icon size={18} className={`${color} group-hover:scale-110 transition-transform duration-200 flex-shrink-0`} />
                      <input
                        name={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={form[key]}
                        onChange={handleChange}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-xs sm:text-sm
                          focus:placeholder-blue-300 transition-colors duration-200 min-w-0 break-words"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 min-w-0 overflow-x-hidden">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform
                    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40
                    hover:scale-[1.02] active:scale-[0.98] min-w-0 break-words"
                >
                  Save Settings
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAlert('confirm')}
                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base
                    hover:from-red-600 hover:to-red-700 transition-all duration-200 transform
                    shadow-lg shadow-red-500/30 hover:shadow-red-500/40
                    hover:scale-[1.02] active:scale-[0.98] min-w-0 break-words"
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