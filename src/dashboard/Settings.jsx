import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
  FaPinterest, FaSnapchat, FaWhatsapp, FaGooglePlusG,
  FaTrash, FaChevronDown, FaChevronUp,
  FaCheckCircle, FaTwitter, FaLock
} from "react-icons/fa";
import { editCompanyPost, changeCompanyPassword } from "../companyApi";

export default function Settings({ companyId, companyInfo = {}, setCompanyInfo }) {
  // Track previous company ID to detect changes
  const prevCompanyIdRef = useRef(null);

  // Initialize with empty values
  const emptyForm = {
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
    tweeter: "", // Added missing field
  };

  const [form, setForm] = useState(emptyForm);
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // false | "confirm" | "success"
  const [isLoading, setIsLoading] = useState(true);
  const [specialtiesList, setSpecialtiesList] = useState([
    "Carpenter",
    "Curtains & Blind",
    "Lighting",
    "Paint",
    "Carpet",
  ]);

  /* ✅ PASSWORD CHANGE STATE */
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ✅ Fetch specialties from API
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { getSpecialMarks } = await import("../companyApi");
        const res = await getSpecialMarks();
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setSpecialtiesList(data.map(item => item.name));
        }
      } catch (err) {
        console.error("❌ Failed to fetch specialties:", err);
      }
    };
    fetchSpecialties();
  }, []);

  /* ---------- RESET FORM WHEN COMPANY CHANGES ---------- */
  useEffect(() => {
    console.log("🔄 Settings component - Company changed:", {
      newCompanyId: companyId,
      prevCompanyId: prevCompanyIdRef.current,
      hasCompanyInfo: !!companyInfo && Object.keys(companyInfo).length > 0
    });

    // Check if company has actually changed
    if (companyId !== prevCompanyIdRef.current) {
      console.log("🔄 Company ID changed, resetting form data");

      // Reset form to empty first
      setForm(emptyForm);
      setIsLoading(true);

      // Update previous company ID
      prevCompanyIdRef.current = companyId;
    }

    // If no companyInfo or empty, reset form
    if (!companyInfo || Object.keys(companyInfo).length === 0) {
      console.log("📭 No company info, using empty form");
      setForm(emptyForm);
      setIsLoading(false);
      return;
    }

    // Better check: compare the entire form data to prevent stale updates
    const hasDataChanged =
      form.companyName !== (companyInfo.companyName || companyInfo.name || "") ||
      form.companyDescription !== (companyInfo.companyDescription || companyInfo.description || "") ||
      form.contactMobile !== (companyInfo.contactMobile || companyInfo.mobile || companyInfo.phone || "");

    if (!hasDataChanged && form.companyName !== "") {
      console.log("📋 Same company data, skipping update");
      setIsLoading(false);
      return;
    }

    console.log("📥 Loading new company data into form:", companyInfo.companyName || companyInfo.name);

    // Set form with new company data - FIXED coverPhoto mapping
    setForm({
      companyName: companyInfo.companyName || companyInfo.name || "",
      companyDescription: companyInfo.companyDescription || companyInfo.description || "",
      contactMobile: companyInfo.contactMobile || companyInfo.mobile || companyInfo.phone || "",
      address: companyInfo.address || "",
      specialties: Array.isArray(companyInfo.specialties) ? companyInfo.specialties : [],
      logo: companyInfo.logo || null,
      // FIXED: Map cover_photo to coverPhoto correctly
      coverPhoto: companyInfo.cover_photo || companyInfo.coverPhoto || null,
      facebook: companyInfo.facebook || "",
      instagram: companyInfo.instagram || "",
      youtube: companyInfo.youtube || "",
      linkedin: companyInfo.linkedin || "",
      pinterest: companyInfo.pinterest || "",
      snapchat: companyInfo.snapchat || "",
      whatsapp: companyInfo.whatsapp || "",
      google: companyInfo.google || "",
      tweeter: companyInfo.tweeter || "", // Added missing field
    });

    setIsLoading(false);
  }, [companyId, companyInfo]);


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
    if (!companyId) {
      alert("Company ID is missing. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data according to backend API requirements
      const apiData = new FormData();
      apiData.append("_method", "PUT"); // ✅ REQUIREMENT: Add spoofing for PUT request

      // ✅ FIXED: Only send files if they exist as File objects
      if (form.logo && form.logo instanceof File) {
        apiData.append("logo", form.logo);
      } else if (form.logo === null) {
        // Send empty string only if explicitly cleared (not undefined)
        apiData.append("logo", "");
      }

      if (form.coverPhoto && form.coverPhoto instanceof File) {
        apiData.append("cover_photo", form.coverPhoto);
      } else if (form.coverPhoto === null) {
        // Send empty string only if explicitly cleared (not undefined)
        apiData.append("cover_photo", "");
      }

      // Add basic info
      apiData.append("name", form.companyName || "");
      apiData.append("address", form.address || "");
      apiData.append("phone", form.contactMobile || "");
      apiData.append("description", form.companyDescription || "");

      // ✅ FIXED: Added specialties to API data
      if (Array.isArray(form.specialties) && form.specialties.length > 0) {
        form.specialties.forEach((specialty) => {
          apiData.append("specialties[]", specialty);
        });
      }
      // If empty, we don't append anything or we could append an empty string if backend requires it, 
      // but usually not appending is safer or appending "specialties[]" once if needed.
      // Based on 422 error, let's try not appending if empty.

      // Add social media - FIXED: tweeter uses its own field, not facebook
      apiData.append("whatsapp", form.whatsapp || "");
      apiData.append("snapchat", form.snapchat || "");
      apiData.append("pinterest", form.pinterest || "");
      apiData.append("instagram", form.instagram || "");
      apiData.append("tweeter", form.tweeter || ""); // ✅ FIXED: Use tweeter field
      apiData.append("facebook", form.facebook || "");
      apiData.append("youtube", form.youtube || "");
      apiData.append("google", form.google || "");
      apiData.append("linkedin", form.linkedin || "");

      console.log('📤 Sending to API for company:', companyId);
      console.log('📤 Form data:', {
        name: form.companyName,
        phone: form.contactMobile,
        address: form.address,
        specialties: form.specialties,
        tweeter: form.tweeter
      });

      // Send to API
      await editCompanyPost(apiData);

      // Update local state
      const updatedCompanyInfo = {
        ...companyInfo,
        ...form,
        contactMobile: form.contactMobile,
        cover_photo: form.coverPhoto, // Keep both for consistency
      };

      setCompanyInfo(updatedCompanyInfo);

      // Also update localStorage - FIXED: Proper file handling
      const currentCompany = JSON.parse(localStorage.getItem('company') || '{}');
      const updatedLocalCompany = {
        ...currentCompany,
        id: companyId,
        name: form.companyName,
        description: form.companyDescription,
        phone: form.contactMobile,
        mobile: form.contactMobile,
        address: form.address,
        whatsapp: form.whatsapp,
        snapchat: form.snapchat,
        pinterest: form.pinterest,
        instagram: form.instagram,
        tweeter: form.tweeter, // ✅ FIXED: Store tweeter separately
        facebook: form.facebook,
        youtube: form.youtube,
        google: form.google,
        linkedin: form.linkedin,
        specialties: form.specialties,
        // ✅ FIXED: Use new images if uploaded, otherwise keep existing
        logo: form.logo instanceof File ? URL.createObjectURL(form.logo) : (form.logo || currentCompany.logo),
        cover_photo: form.coverPhoto instanceof File ? URL.createObjectURL(form.coverPhoto) : (form.coverPhoto || currentCompany.cover_photo),
      };
      localStorage.setItem('company', JSON.stringify(updatedLocalCompany));

      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);

      if (err.response) {
        console.error('Server error:', err.response.status, err.response.data);
        alert(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        console.error('No response:', err.request);
        alert('No response from server. Check network connection.');
      } else {
        alert(`Failed to save settings: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDeleteAll = async () => {
    if (!companyId) {
      alert("Company ID is missing. Please log in again.");
      return;
    }

    try {
      setIsLoading(true);

      const apiData = new FormData();
      apiData.append("name", "");
      apiData.append("description", "");
      apiData.append("phone", "");
      apiData.append("address", "");
      apiData.append("whatsapp", "");
      apiData.append("snapchat", "");
      apiData.append("pinterest", "");
      apiData.append("instagram", "");
      apiData.append("tweeter", "");
      apiData.append("facebook", "");
      apiData.append("youtube", "");
      apiData.append("google", "");
      apiData.append("linkedin", "");
      apiData.append("specialties[]", ""); // Clear specialties

      await editCompanyPost(companyId, apiData);

      // Reset form - ONLY CLEAR THE FORM, NO NAVIGATION
      setForm(emptyForm);
      setCompanyInfo(emptyForm);

      // Clear localStorage for this company
      const currentCompany = JSON.parse(localStorage.getItem('company') || '{}');
      if (currentCompany.id === companyId) {
        const clearedCompany = {
          ...currentCompany,
          name: "",
          description: "",
          phone: "",
          mobile: "",
          address: "",
          whatsapp: "",
          snapchat: "",
          pinterest: "",
          instagram: "",
          tweeter: "",
          facebook: "",
          youtube: "",
          google: "",
          linkedin: "",
          specialties: [],
        };
        localStorage.setItem('company', JSON.stringify(clearedCompany));
      }

      setShowDeleteAlert("success");
      setTimeout(() => setShowDeleteAlert(false), 3000);

    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- PASSWORD CHANGE ---------- */
  const handlePasswordSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    if (!passwordForm.old_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
      alert("Please fill all password fields");
      return;
    }

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      alert("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      // Backend expects customerId even for company
      await changeCompanyPassword({
        customerId: companyId,
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });

      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordForm({ old_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err) {
      console.error("❌ Password change error:", err);
      alert(err.response?.data?.message || "Failed to change password. check old password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  /* ---------- SPECIALTIES DROPDOWN TOGGLE ---------- */
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
            This will clear all settings but keep you on this page. Continue?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
            >
              Save Settings
            </button>

            <button
              type="button"
              onClick={() => setShowDeleteAlert('confirm')}
              className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold"
            >
              Delete All
            </button>



          </div>
        </div>
      </div>
    );
  };

  /* ---------- FORCE CLEAR CACHE BUTTON (DEBUG) ---------- */
  const handleForceClearCache = () => {
    if (window.confirm("Clear all cached company data from this form only?")) {
      // ✅ FIXED: Only clear the form, NO PAGE RELOAD OR NAVIGATION

      // Reset form to empty
      setForm(emptyForm);

      // Clear image previews
      if (form.logo && form.logo instanceof File) {
        URL.revokeObjectURL(form.logo);
      }
      if (form.coverPhoto && form.coverPhoto instanceof File) {
        URL.revokeObjectURL(form.coverPhoto);
      }

      // Show success message
      setShowDeleteAlert("success");
      setTimeout(() => setShowDeleteAlert(false), 3000);

      console.log("✅ Form cache cleared (no page reload)");
    }
  };

  // Show loading state
  if (isLoading && !form.companyName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
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
                <h3 className="font-semibold text-gray-900 text-lg">Cleared</h3>
                <p className="text-gray-600 text-sm truncate">All form data has been cleared</p>
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
        <div className="flex justify-between items-center mb-4 sm:mb-6 mt-2 sm:mt-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
            Settings
          </h1>
        </div>

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
                      onError={(e) => {
                        console.error("Cover photo failed to load");
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("coverPhoto")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-600 transition-all duration-200 text-xs shadow-[3px_3px_10px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_15px_rgba(239,68,68,0.4)]"
                      disabled={isLoading}
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  name="coverPhoto"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxSizing: "border-box" }}
                  disabled={isLoading}
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
                      onError={(e) => {
                        console.error("Logo failed to load");
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteFile("logo")}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-all duration-200 text-xs shadow-[2px_2px_8px_rgba(239,68,68,0.3)]"
                      disabled={isLoading}
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded file:sm:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxSizing: "border-box" }}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* FORM FIELDS */}
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <input
                name="companyName"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 disabled:opacity-50"
                style={{ minWidth: 0 }}
                disabled={isLoading}
              />

              <textarea
                name="companyDescription"
                placeholder="Company Description"
                value={form.companyDescription}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px rgba(0,0,0,0.05)] transition-all duration-200 resize-none disabled:opacity-50"
                style={{ minWidth: 0 }}
                disabled={isLoading}
              />

              <input
                name="contactMobile"
                placeholder="Contact Mobile"
                value={form.contactMobile}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 disabled:opacity-50"
                style={{ minWidth: 0 }}
                disabled={isLoading}
              />

              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 disabled:opacity-50"
                style={{ minWidth: 0 }}
                disabled={isLoading}
              />

              {/* SPECIALTIES DROPDOWN */}
              <div className="relative" style={{ minWidth: 0 }}>
                <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                  Specialties
                </label>

                <button
                  type="button"
                  onClick={toggleSpecialtiesDropdown}
                  className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 flex items-center justify-between text-sm sm:text-base hover:bg-white/70 transition-all duration-200 text-gray-900 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
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
                            onChange={() => !isLoading && toggleSpecialty(item)}
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 flex-shrink-0"
                            disabled={isLoading}
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
                          onClick={() => !isLoading && toggleSpecialty(specialty)}
                          className="text-white hover:text-blue-100 text-xs font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-50"
                          disabled={isLoading}
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
                    { key: "tweeter", icon: FaTwitter, color: "text-blue-400" }, // Added Twitter/X field
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
                        placeholder={key === "tweeter" ? "Twitter/X" : key.charAt(0).toUpperCase() + key.slice(1)}
                        value={form[key] || ""}
                        onChange={handleChange}
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-xs sm:text-sm focus:placeholder-blue-300 transition-colors duration-200 disabled:opacity-50"
                        style={{ minWidth: 0 }}
                        disabled={isLoading}
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

                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </span>
                  ) : (
                    "Save Settings"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold text-sm sm:text-base hover:from-gray-800 hover:to-gray-900 transition-all duration-200 transform shadow-lg shadow-gray-500/30 hover:shadow-gray-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaLock />
                    Change Password
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDeleteAlert("confirm")}

                  className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base hover:from-red-600 hover:to-red-700 transition-all duration-200 transform shadow-lg shadow-red-500/30 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Delete All
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-xl border border-blue-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                  <FaLock className="text-lg" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                disabled={passwordLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200/60 bg-white/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={passwordLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200/60 bg-white/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={passwordLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm your new password"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-gray-200/60 bg-white/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={passwordLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}