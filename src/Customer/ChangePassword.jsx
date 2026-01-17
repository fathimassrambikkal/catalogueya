import React, { useState } from "react";
import { changeCustomerPassword } from "../api";
import { useSelector } from "react-redux";

function ChangePassword({ onBack }) {
  const currentUser = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!form.oldPassword) {
      alert("Old password is required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changeCustomerPassword({
        customerId: currentUser.id,
        old_password: form.oldPassword,
        new_password: form.newPassword,
        new_password_confirmation: form.confirmPassword,
      });

      alert("Password updated successfully");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onBack();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="
      min-h-screen w-full overflow-x-hidden
      p-3 xs:p-4 sm:p-6
      
 mb-6 mt-10
    ">
      {/* Header */}
      <div className="flex items-center gap-3  sm:mb-6 mb-6 mt-10">
        <button
          onClick={onBack}
          className="mr-3  hover:text-blue-500 
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

        <h1 className="text-base sm:text-xl md:text-2xl font-bold truncate">
          Change Password
        </h1>
      </div>

      {/* Fields */}
      <div className="space-y-4 sm:space-y-6">
        {[
          { label: "Old Password", field: "oldPassword" },
          { label: "New Password", field: "newPassword" },
          { label: "Confirm Password", field: "confirmPassword" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 sm:p-5 bg-white/80 rounded-xl sm:rounded-2xl border shadow"
          >
            <h2 className="text-sm sm:text-lg font-semibold mb-3">
              {item.label}
            </h2>

            <input
              type="password"
              value={form[item.field]}
              onChange={(e) => setForm({...form, [item.field]: e.target.value})}
              className="w-full p-3 rounded-xl border text-sm sm:text-base"
              placeholder={item.label}
            />
          </div>
        ))}

      

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
         Update Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;