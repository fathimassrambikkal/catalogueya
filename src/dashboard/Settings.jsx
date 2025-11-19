import React, { useState, useEffect } from "react";
import {
  FaFacebook, FaInstagram, FaYoutube, FaLinkedin,
  FaPinterest, FaSnapchat, FaWhatsapp, FaGooglePlusG, FaTrash
} from "react-icons/fa";

export default function Settings({ companyInfo, setCompanyInfo }) {
  const [form, setForm] = useState({ ...companyInfo });

  // Sync with parent when companyInfo changes
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

  // Convert file to Base64 (important fix)
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

  // File upload -> convert to base64
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

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-3xl ">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      {/* UPLOADS */}
      <div className="space-y-4 mb-6">
        {/* Cover Photo */}
        <div>
          <label className="font-semibold block mb-1">Cover Photo</label>

          {form.coverPhoto && (
            <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
              <img
                src={form.coverPhoto}
                alt="cover preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteFile("coverPhoto")}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
              >
                <FaTrash />
              </button>
            </div>
          )}

          <input type="file" name="coverPhoto" onChange={handleFileChange} />
        </div>

        {/* Logo */}
        <div>
          <label className="font-semibold block mb-1">Logo</label>

          {form.logo && (
            <div className="relative w-24 h-24 mb-2 rounded overflow-hidden shadow">
              <img
                src={form.logo}
                alt="logo preview"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => handleDeleteFile("logo")}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
              >
                <FaTrash />
              </button>
            </div>
          )}

          <input type="file" name="logo" onChange={handleFileChange} />
        </div>
      </div>

      {/* FORM FIELDS */}
      <form className="space-y-4">
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <textarea
          name="companyDescription"
          placeholder="Company Description"
          value={form.companyDescription}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="contactMobile"
          placeholder="Contact Mobile"
          value={form.contactMobile}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* SPECIALTIES */}
        <div>
          <label className="font-semibold block mb-2">Specialties</label>
          <div className="grid grid-cols-2 gap-2">
            {specialtiesList.map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.specialties.includes(item)}
                  onChange={() => toggleSpecialty(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <label className="font-semibold block mb-2">Social Media</label>

          <div className="grid grid-cols-2 gap-3">
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
              <div key={key} className="flex items-center gap-2">
                <Icon size={24} className={color} />
                <input
                  name={key}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={form[key]}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleDeleteAll}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Delete All
          </button>
        </div>
      </form>
    </div>
  );
}
