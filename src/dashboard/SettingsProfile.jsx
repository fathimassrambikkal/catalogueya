import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../store/authSlice";

import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  SnapchatIcon,
  WhatsappIcon,
  TwitterIcon,
} from "../components/SocialSvg"; 

import {
  BackIcon,
  
  IconChevronDown,
  IconSuccess,
  IconChevronUp, 
  DeleteIcon
  
} from "./CompanySvg";
import { editCompanyPost, getCategories, changeCompanyPassword } from "../api";


import { getImageUrl } from "../companyDashboardApi";
export default function SettingsProfile({ companyId, companyInfo = {}, setCompanyInfo, onBack, }) {
  const dispatch = useDispatch();
  // Track previous company ID to detect changes
  const prevCompanyIdRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize with empty values
  const emptyForm = {
    companyName: "",
    companyDescription: "",
    contactMobile: "",
    address: "",
    // Map Fields
    lat: "",
    lng: "",
    place_id: "",
    formatted_address: "",
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
    tweeter: "",
    commercial_license: null,
    establishment_card: null,
    commercial_registration: null,
    qid_authorized_signatories: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Settings have been saved successfully");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false); // false | "confirm" | "success"
  const [isLoading, setIsLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

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
      // Map Fields
      lat: companyInfo.lat || "",
      lng: companyInfo.lng || "",
      place_id: companyInfo.place_id || "",
      formatted_address: companyInfo.formatted_address || "",
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
      tweeter: companyInfo.tweeter || "",
      commercial_license: companyInfo.commercial_license || null,
      establishment_card: companyInfo.establishment_card || null,
      commercial_registration: companyInfo.commercial_registration || null,
      qid_authorized_signatories: companyInfo.qid_authorized_signatories || null,
    });

    setIsLoading(false);
  }, [companyId, companyInfo]);

  const leafletMap = useRef(null);
  const leafletMarker = useRef(null);

  // Map Init
  useEffect(() => {
    if (isLoading) return;

    const initLeaflet = () => {
      if (!window.L) {
        setTimeout(initLeaflet, 200);
        return;
      }

      const mapElement = document.getElementById("profile-map");
      if (!mapElement || leafletMap.current) return;

      const defaultPos = (form.lat && form.lng)
        ? [parseFloat(form.lat), parseFloat(form.lng)]
        : [25.2854, 51.5310]; // Doha

      leafletMap.current = window.L.map(mapElement).setView(defaultPos, 12);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      leafletMarker.current = window.L.marker(defaultPos, { draggable: true }).addTo(leafletMap.current);

      const updateCoords = (lat, lng) => {
        setForm(prev => ({
          ...prev, 
          lat: lat.toString(),
          lng: lng.toString()
        }));
      };

      leafletMarker.current.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        updateCoords(pos.lat, pos.lng);
        googleReverseGeocode(pos.lat, pos.lng);
      });

      leafletMap.current.on('click', (e) => {
        const pos = e.latlng;
        leafletMarker.current.setLatLng(pos);
        updateCoords(pos.lat, pos.lng);
        googleReverseGeocode(pos.lat, pos.lng);
      });

      // Init Google Autocomplete for address input
      const initGoogle = () => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          setTimeout(initGoogle, 200);
          return;
        }

        const input = document.getElementById("profile-address-input-google");
        if (input) {
          const autocomplete = new window.google.maps.places.Autocomplete(input);
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const pos = [lat, lng];

            if (leafletMap.current) {
              leafletMap.current.setView(pos, 14);
              leafletMarker.current.setLatLng(pos);
            }

            setForm(prev => ({
              ...prev,
              lat: lat.toString(),
              lng: lng.toString(),
              address: place.formatted_address || place.name,
              formatted_address: place.formatted_address || place.name,
              place_id: place.place_id
            }));
          });
        }
      };

      initGoogle();
    };

    const googleReverseGeocode = (lat, lng) => {
      if (!window.google || !window.google.maps) return;
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          const r = results[0];
          setForm(prev => ({
            ...prev,
            address: r.formatted_address,
            formatted_address: r.formatted_address,
            place_id: r.place_id
          }));
          const input = document.getElementById("profile-address-input-google");
          if (input) input.value = r.formatted_address;
        }
      });
    };

    initLeaflet();

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isLoading]);

  const [specialtiesList, setSpecialtiesList] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.data?.data) {
          setSpecialtiesList(res.data.data.map(cat => cat.title));
        }
      } catch (err) {
        console.error("Error fetching categories for specialties", err);
      }
    };
    fetchCats();
  }, []);

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

      const phoneDigits = (form.contactMobile || "").replace(/\D/g, "");
      if (phoneDigits.length < 10 && form.contactMobile) {
        alert("Phone number must be at least 10 digits.");
        setIsLoading(false);
        return;
      }

      // Prepare data according to backend API requirements
      const apiData = new FormData();
      apiData.append("_method", "PUT");

      // Mandatory fields (always sent)
      apiData.append("name", form.companyName || "");
      apiData.append("phone", form.contactMobile || "");

      // Only append other string fields if they changed from companyInfo
      if (form.companyDescription !== (companyInfo.companyDescription || companyInfo.description || "")) {
        apiData.append("description", form.companyDescription || "");
      }
      if (form.address !== (companyInfo.address || "")) {
        apiData.append("address", form.address || "");
      }

      // Map conditionally
      if (form.lat && form.lat !== (companyInfo.lat || "")) apiData.append("lat", form.lat.toString());
      if (form.lng && form.lng !== (companyInfo.lng || "")) apiData.append("lng", form.lng.toString());
      if (form.place_id && form.place_id !== (companyInfo.place_id || "")) apiData.append("place_id", form.place_id);
      if (form.formatted_address && form.formatted_address !== (companyInfo.formatted_address || "")) apiData.append("formatted_address", form.formatted_address);

      // Social conditionally
      ['whatsapp', 'snapchat', 'pinterest', 'instagram', 'tweeter', 'facebook', 'youtube', 'linkedin'].forEach(k => {
        if (form[k] !== (companyInfo[k] || "")) {
          apiData.append(k, form[k] || "");
        }
      });

      // Specialties conditionally
      const origSpecialties = [...(Array.isArray(companyInfo.specialties) ? companyInfo.specialties : [])].sort();
      const newSpecialties = [...(Array.isArray(form.specialties) ? form.specialties : [])].sort();
      if (JSON.stringify(origSpecialties) !== JSON.stringify(newSpecialties)) {
        if (newSpecialties.length === 0) {
          apiData.append("specialties[]", ""); // explicit clear
        } else {
          form.specialties.forEach(s => apiData.append("specialties[]", s));
        }
      }

      // Files
      if (form.logo && form.logo instanceof File) {
        apiData.append("logo", form.logo);
      }
      if (form.coverPhoto && form.coverPhoto instanceof File) {
        apiData.append("cover_photo", form.coverPhoto);
      }

      // Legal Docs
      ["commercial_license", "establishment_card", "commercial_registration", "qid_authorized_signatories"].forEach(key => {
        if (form[key] && form[key] instanceof File) {
          apiData.append(key, form[key]);
        }
      });

      console.log('📤 Sending to API for company:', companyId);

      const res = await editCompanyPost(companyId, apiData);

      if (res?.data?.status === "error" || res?.data?.errors) {
        throw { response: { data: res.data } };
      }

      const apiMessage = res?.data?.message || res?.data?.msg || "Settings have been saved successfully";

      // Update Local
      const logoUrl = (form.logo instanceof File || form.logo instanceof Blob) ? URL.createObjectURL(form.logo) : (companyInfo.logo || form.logo);
      const coverUrl = (form.coverPhoto instanceof File || form.coverPhoto instanceof Blob) ? URL.createObjectURL(form.coverPhoto) : (companyInfo.cover_photo || form.coverPhoto);

      const updatedCompanyInfo = {
        ...companyInfo,
        ...form,
        name: form.companyName,
        companyName: form.companyName,
        description: form.companyDescription,
        mobile: form.contactMobile,
        phone: form.contactMobile,
        logo: logoUrl,
        cover_photo: coverUrl,
        coverPhoto: coverUrl,
      };

      // 1. Update CompanyDashboard state (updates Sidebar instantly via props)
      setCompanyInfo(updatedCompanyInfo);

      // 2. Update Redux store (updates Navbar instantly)
      // Provide all possible keys that Navbar might be looking for
      dispatch(updateProfile({
        ...updatedCompanyInfo,
        logo: logoUrl,
        image: logoUrl,
        photo: logoUrl,
        avatar: logoUrl,
        company_name: form.companyName,
        companyName: form.companyName,
        name: form.companyName
      }));

      // 3. Update localStorage (sync all keys)
      const currentCompany = JSON.parse(localStorage.getItem('company') || '{}');
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      const updatedLocalCompany = { ...currentCompany, ...updatedCompanyInfo };
      const updatedLocalUser = {
        ...currentUser, 
        ...updatedCompanyInfo,
        logo: logoUrl,
        image: logoUrl,
        photo: logoUrl
      };

      localStorage.setItem('company', JSON.stringify(updatedLocalCompany));
      localStorage.setItem('company_details', JSON.stringify(updatedLocalCompany));
      localStorage.setItem('user', JSON.stringify(updatedLocalUser));

      setSuccessMessage(apiMessage);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);

    } catch (err) {
      console.error('❌ Save error:', err);
      let errorMsg = "Failed to save settings.";
      const data = err.response?.data || err.data;
      if (data?.errors && typeof data.errors === 'object') {
        errorMsg = Object.values(data.errors).flat().join('\n');
      } else if (data?.errors && typeof data.errors === 'string') {
        errorMsg = data.errors;
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert(errorMsg);
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
          linkedin: "",
          specialties: [],
        };
        localStorage.setItem('company', JSON.stringify(clearedCompany));
      }

      setShowDeleteAlert("success");
      setTimeout(() => setShowDeleteAlert(false), 3000);

    } catch (err) {
      console.error(err);
      alert("Failed to delete settings");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- CHANGE PASSWORD ---------- */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    try {
      setIsPasswordLoading(true);
      const res = await changeCompanyPassword(passwordForm);
      if (res?.data?.status === "error" || res?.data?.errors) {
        throw { response: { data: res.data } };
      }
      alert(res?.data?.message || res?.data?.msg || "Password changed successfully");
      setShowPasswordModal(false);
      setPasswordForm({ old_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err) {
      console.error('❌ Password change error:', err);
      let errorMsg = "Failed to change password";
      const data = err.response?.data || err.data;
      if (data?.errors && typeof data.errors === 'object') {
        errorMsg = Object.values(data.errors).flat().join('\n');
      } else if (data?.errors && typeof data.errors === 'string') {
        errorMsg = data.errors;
      } else if (data?.message) {
        errorMsg = data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert(errorMsg);
    } finally {
      setIsPasswordLoading(false);
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
              className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl  text-white font-semibold"
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
    <div className="min-h-screen bg-white p-6 animate-pulse">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Cover Skeleton */}
        <div className="h-40 bg-gray-200 rounded-xl" />

        {/* Logo Skeleton */}
        <div className="h-24 w-24 bg-gray-200 rounded-xl" />

        {/* Input Skeletons */}
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>

        {/* Social Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-300 rounded-xl" />

      </div>
    </div>
  );
}

return (
  <div
    className="  h-screen bg-white "
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
              <IconSuccess className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg">Success</h3>
              <p className="text-gray-600 text-sm truncate">{successMessage}</p>
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
              <IconSuccess className="w-6 h-6 text-white" />
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

    {/* Change Password Modal */}
    {showPasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-blue-900/10">
          <h3 className="font-bold text-xl mb-6 text-gray-900">Change Password</h3>
          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="font-semibold text-gray-900 block mb-2 text-sm sm:text-base">Old Password</label>
              <input
                type="password"
                name="old_password"
                value={passwordForm.old_password}
                onChange={handlePasswordChange}
                placeholder="Enter old password"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-900 block mb-2 text-sm sm:text-base">New Password</label>
              <input
                type="password"
                name="new_password"
                value={passwordForm.new_password}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-900 block mb-2 text-sm sm:text-base">Confirm New Password</label>
              <input
                type="password"
                name="new_password_confirmation"
                value={passwordForm.new_password_confirmation}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-100/80 text-gray-700 font-semibold text-sm sm:text-base hover:bg-gray-200 transition-all duration-200 border border-gray-200/50 shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isPasswordLoading}
              className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm sm:text-base hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
            >
              {isPasswordLoading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving...
                </span>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Main Content - All in one scrollable div */}
    <div className="w-full min-h-screen bg-white flex flex-col pt-16 md:pt-0">
     

      {/* Main Card Container */}
      <div className="p-6">
           <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
            >
            <BackIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
            </button>


        {/* All Form Fields in a Single Div - No Scroll */}
        <div className="p-3 sm:p-4 md:p-6">
          {/* UPLOADS SECTION */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Cover Photo */}
            <div>
              <label className="font-semibold text-gray-900 block mb-2 sm:mb-3 text-sm sm:text-base break-words">
                Cover Photo
              </label>

              {form.coverPhoto && (
                <div className="relative w-full h-32 sm:h-40 mb-2 sm:mb-3 rounded-lg sm:rounded-xl overflow-hidden shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]">
                  <img
                    src={(form.coverPhoto instanceof File || form.coverPhoto instanceof Blob) ? URL.createObjectURL(form.coverPhoto) : getImageUrl(form.coverPhoto)}
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
                    <DeleteIcon className="w-4 h-4 text-white" />
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
                    src={(form.logo instanceof File || form.logo instanceof Blob) ? URL.createObjectURL(form.logo) : getImageUrl(form.logo)}
                    alt="logo preview"
                    className="w-full h-full object-contain max-w-full "
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
                    <DeleteIcon className="w-3 h-3 text-white" />
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

          {/* LEGAL DOCUMENTS */}
          <div className="mb-8 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Legal Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["commercial_license", "establishment_card", "commercial_registration", "qid_authorized_signatories"].map(key => (
                <div key={key}>
                  <label className="text-sm font-bold text-gray-700 block mb-2 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name={key}
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all border border-gray-200 rounded-xl p-2 bg-white"
                      disabled={isLoading}
                    />
                    {form[key] && (
                      <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <span className="text-[10px] font-bold text-blue-700 truncate max-w-[150px]">
                          {typeof form[key] === 'string' ? 'Existing Document' : form[key].name}
                        </span>
                        <button
                          onClick={() => handleDeleteFile(key)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <DeleteIcon className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM FIELDS */}
          <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Company Name */}
            <input
              name="companyName"
              placeholder="Company Name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200/60 bg-white/50 text-sm sm:text-base placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 disabled:opacity-50"
              style={{ minWidth: 0 }}
              disabled={isLoading}
            />

            {/* Company Description */}
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

            {/* Contact Mobile */}
            <input
              type="tel"
              name="contactMobile"
              maxLength="12"
              placeholder="WhatsApp number"
              value={form.contactMobile}
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
                  <IconChevronUp className="w-4 h-4 text-gray-600 flex-shrink-0" />
                ) : (
                  <IconChevronDown className="text-gray-600 w-4 h-4 flex-shrink-0" />
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
                  { key: "youtube", icon: YoutubeIcon },
                  { key: "instagram", icon: InstagramIcon },
                  { key: "facebook", icon: FacebookIcon },
                  { key: "whatsapp", icon: WhatsappIcon },
                  { key: "pinterest", icon: PinterestIcon },
                  { key: "linkedin", icon: LinkedinIcon },
                  { key: "snapchat", icon: SnapchatIcon },
                  { key: "tweeter", icon: TwitterIcon },
                ].map(({ key, icon: Icon }) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-sm sm:text-base bg-white/50 border border-gray-200/60 hover:border-blue-300/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.9)] transition-all duration-200 group"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
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
{/* 
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="flex-1 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold text-sm sm:text-base hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform shadow-lg shadow-gray-500/30 hover:shadow-gray-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Change Password
              </button> */}

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
  </div>
);
}