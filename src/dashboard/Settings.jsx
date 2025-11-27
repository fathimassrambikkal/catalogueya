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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-lg border border-red-200/60 rounded-2xl p-6 shadow-2xl
          shadow-red-500/20 max-w-md w-full transform transition-all duration-300 ease-out
          border-l-4 border-l-red-500 animate-modal-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center
                shadow-lg shadow-red-500/30">
                <FaExclamationTriangle className="text-white text-lg" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Delete All Settings?</h3>
              <p className="text-gray-600 text-sm mt-1">This action cannot be undone. All your settings will be permanently removed.</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 p-3 rounded-xl bg-gray-100 text-gray-700 font-semibold 
                hover:bg-gray-200 transition-all duration-200 transform
                shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20
                hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold 
                hover:from-red-600 hover:to-red-700 transition-all duration-200 transform
                shadow-lg shadow-red-500/30 hover:shadow-red-500/40
                hover:scale-[1.02] active:scale-[0.98]"
            >
              Delete All
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-0">
      {/* Save Success Alert */}
      {showAlert && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-white/95 backdrop-blur-lg border border-blue-200/60 rounded-2xl p-6 shadow-2xl
            shadow-blue-500/20 max-w-sm transform transition-all duration-300 ease-out
            border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center
                  shadow-lg shadow-blue-500/30">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">Success!</h3>
                <p className="text-gray-600 text-sm mt-1">Settings have been saved successfully</p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200
                  hover:bg-gray-100/50 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full animate-progress"
                style={{ animationDuration: '3s' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Alert */}
      {showDeleteAlert && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-white/95 backdrop-blur-lg border border-red-200/60 rounded-2xl p-6 shadow-2xl
            shadow-red-500/20 max-w-sm transform transition-all duration-300 ease-out
            border-l-4 border-l-red-500">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center
                  shadow-lg shadow-red-500/30">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">Deleted!</h3>
                <p className="text-gray-600 text-sm mt-1">All settings have been cleared</p>
              </div>
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200
                  hover:bg-gray-100/50 rounded-full p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full animate-progress"
                style={{ animationDuration: '3s' }}
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

      <div className="max-w-6xl ml-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 mt-4">Settings</h1>

        <div className="rounded-2xl
          bg-white/80 backdrop-blur-lg border border-gray-200/60
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">

          {/* FORM WITH SCROLL */}
          <div className="max-h-[80vh] overflow-y-auto p-6">
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
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300"
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
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300"
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
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200"
              />
              <textarea
                name="companyDescription"
                placeholder="Company Description"
                value={form.companyDescription}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200 resize-none"
              />
              <input
                name="contactMobile"
                placeholder="Contact Mobile"
                value={form.contactMobile}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200"
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-gray-200/60 bg-white/50
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  transition-all duration-200"
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
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <span>Select({form.specialties.length} selected)</span>
                  {isSpecialtiesOpen ? <FaChevronUp className="text-gray-600" /> : <FaChevronDown className="text-gray-600" />}
                </button>

                {/* Dropdown Content with Fade Effect */}
                {(isSpecialtiesOpen || isAnimating) && (
                  <div className={`
                    absolute top-full left-0 right-0 mt-2 rounded-xl z-10 
                    transition-all duration-300 ease-in-out overflow-hidden
                    bg-white/95 backdrop-blur-lg border border-blue-200/60
                    shadow-[3px_3px_15px_rgba(59,130,246,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]
                    ${isSpecialtiesOpen && !isAnimating 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform -translate-y-2'
                    }
                  `}>
                    <div className="p-3 grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {specialtiesList.map((item) => (
                        <label key={item} className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 cursor-pointer transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={form.specialties.includes(item)}
                            onChange={() => toggleSpecialty(item)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <span className="text-gray-900 text-sm font-medium">{item}</span>
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
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2
                          shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className="text-white hover:text-blue-100 text-xs font-bold transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/20"
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
                      bg-white/50 border border-gray-200/60 hover:border-blue-300/60
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                      hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(59,130,246,0.1)]
                      transition-all duration-200 group">
                      <Icon size={20} className={`${color} group-hover:scale-110 transition-transform duration-200`} />
                      <input
                        name={key}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={form[key]}
                        onChange={handleChange}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500
                          focus:placeholder-blue-300 transition-colors duration-200"
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
                  className="flex-1 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold 
                    hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform
                    shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40
                    hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Settings
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAlert('confirm')}
                  className="flex-1 p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold 
                    hover:from-red-600 hover:to-red-700 transition-all duration-200 transform
                    shadow-lg shadow-red-500/30 hover:shadow-red-500/40
                    hover:scale-[1.02] active:scale-[0.98]"
                >
                  Delete All
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add custom animations to CSS */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        .animate-modal-in {
          animation: modal-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}