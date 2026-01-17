import React, { useState } from "react";
import { updateCustomerSettings } from "../api";
import { useSelector } from "react-redux";

function PersonalInformation({ onBack }) {
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    mobile: "",
    location: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      alert("Session expired. Please login again.");
      return;
    }
    
    try {
      await updateCustomerSettings({
        customerId: currentUser.id,
        first_name: formData.name || undefined,
        last_name: formData.surname || undefined,
        date_of_birth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        email: formData.email || undefined,
        mobile: formData.mobile || undefined,
        location: formData.location || undefined,
      });

      alert("Profile updated successfully");
      onBack();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div
      className="
        min-h-screen w-full overflow-x-hidden
        p-3 xs:p-4 sm:p-6
        
        
      "
    >
      {/* Header */}
      <div className="flex items-center  sm:mb-6 gap-3 mt-10 mb-6">
        <button
          onClick={onBack}
          className="mr-3   hover:text-blue-500 
             p-2
              rounded-xl
              bg-white/95 backdrop-blur-xl
              border border-white/90
              text-gray-600
              shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.4)]
              hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_4px_16px_rgba(0,0,0,0.04)]
              active:scale-[0.98]
              transition-all duration-200
              flex items-center justify-center
              group"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-sm sm:text-xl md:text-2xl font-bold truncate">
          Personal Information
        </h1>
      </div>

      <div className="space-y-4 sm:space-y-6">

        {/* Name */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 border shadow">
          <h2 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4">
            Name
          </h2>

          <div className="space-y-3">
            <input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full p-3 rounded-xl border text-sm sm:text-base"
              placeholder="First Name"
            />
            <input
              value={formData.surname}
              onChange={(e) => handleChange("surname", e.target.value)}
              className="w-full p-3 rounded-xl border text-sm sm:text-base"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* DOB */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 border shadow">
          <h2 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4">
            Date Of Birth
          </h2>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="w-full p-3 rounded-xl border text-sm sm:text-base"
          />
        </div>

        {/* Gender */}
        <div className="flex gap-2 sm:gap-3">
          {["male", "female"].map((g) => (
            <button
              key={g}
              onClick={() => handleChange("gender", g)}
              className={`
                flex-1 p-3 rounded-xl border text-sm sm:text-base
                transition active:scale-95
                ${
                  formData.gender === g
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }
              `}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>

        {/* Email */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 border shadow">
          <h2 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4">
            Email
          </h2>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 rounded-xl border text-sm sm:text-base"
            placeholder="Email Address"
          />
        </div>

        {/* Mobile */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 border shadow">
          <h2 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4">
            Mobile
          </h2>

          <div className="flex flex-col gap-2 sm:gap-3 ">
            <div
              className="
                px-3 py-3
                bg-gray-100 rounded-xl border
                text-sm sm:text-base
                flex items-start justify-start
                min-w-[40px]
              "
            >
              +974
            </div>

            <input
              value={formData.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className="flex-1 p-3 rounded-xl border text-sm sm:text-base"
              placeholder="Phone Number"
            />
          </div>
        </div>

        {/* Location */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-white/80 border shadow">
          <h2 className="text-sm sm:text-xl font-semibold mb-3 sm:mb-4">
            Location
          </h2>
          <input
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-3 rounded-xl border text-sm sm:text-base"
            placeholder="Your location"
          />
        </div>

        {/* Update Button */}
        <button
          onClick={handleSubmit}
          className="
            w-full py-3 sm:py-4
            rounded-xl sm:rounded-2xl
            bg-blue-600 text-white
            text-sm sm:text-base font-medium
            
             
                        md:py-2
                      md:rounded-2xl
                      bg-gradient-to-r from-blue-500 to-blue-600
                     
                      shadow-[0_2px_12px_rgba(59,130,246,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      hover:shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
                      active:scale-[0.98]
                      transition-all duration-200
                      flex items-center justify-center
                      gap-1.5 sm:gap-2
                      whitespace-nowrap
                      group
          "
        >
          Update Profile
        </button>

      </div>
    </div>
  );
}

export default PersonalInformation;