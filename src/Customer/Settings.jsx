import React, { useState } from 'react'

function Settings() {
  const [activeView, setActiveView] = useState('main'); 
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    mobile: '',
    location: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderMainView = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 xs:p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="w-full max-w-full mx-auto overflow-hidden px-1 sm:px-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-5 sm:mb-6 break-words px-1">
          Settings
        </h1>
        
        <div className="space-y-4 sm:space-y-5 w-full max-w-full overflow-x-hidden">
          {/* Personal Information */}
          <div 
            onClick={() => setActiveView('personalInfo')}
            className="flex justify-between items-center p-4 xs:p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02] w-full overflow-hidden min-w-0"
          >
            <span className="text-gray-800 font-medium text-base sm:text-lg break-words min-w-0 pr-3 flex-1">
              Personal Information
            </span>
            <span className="text-blue-500 flex-shrink-0">
              <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          {/* Change Password */}
          <div 
            onClick={() => setActiveView('changePassword')}
            className="flex justify-between items-center p-4 xs:p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02] w-full overflow-hidden min-w-0"
          >
            <span className="text-gray-800 font-medium text-base sm:text-lg break-words min-w-0 pr-3 flex-1">
              Change Password
            </span>
            <span className="text-blue-500 flex-shrink-0">
              <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <span className="text-gray-800 font-medium text-base sm:text-lg break-words min-w-0 pr-3 flex-1">
              Notifications
            </span>
            <div className="flex items-center space-x-2 xs:space-x-3 flex-shrink-0 min-w-0">
              <span className="text-xs xs:text-sm text-gray-500 whitespace-nowrap">OFF</span>
              <div 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 xs:w-14 h-6 xs:h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                  notificationsEnabled 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gray-300'
                } shadow-inner flex-shrink-0`}
              >
                <div 
                  className={`bg-white w-4 xs:w-5 h-4 xs:h-5 rounded-full shadow-lg transform transition-all duration-300 ${
                    notificationsEnabled ? 'translate-x-6 xs:translate-x-7' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-xs xs:text-sm text-gray-500 whitespace-nowrap">ON</span>
            </div>
          </div>

          {/* Country & Language */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Country & Language
            </h2>
            <div className="flex justify-between items-center p-4 rounded-xl
              bg-gray-50/80 border border-gray-200/60 w-full overflow-hidden min-w-0">
              <span className="text-gray-800 text-sm sm:text-base break-words min-w-0 flex-1">
                Language
              </span>
              <span className="text-gray-600 text-sm sm:text-base whitespace-nowrap flex-shrink-0 pl-3">
                English
              </span>
            </div>
          </div>

          {/* Delete Account & Sign Out */}
          <div className="space-y-3 sm:space-y-4 w-full overflow-hidden">
            <div 
              onClick={() => setActiveView('deleteAccount')}
              className="p-4 xs:p-5 sm:p-6 text-red-600 border border-red-200 rounded-2xl cursor-pointer transition-all duration-200 text-center font-medium
                bg-white/80 backdrop-blur-lg
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_15px_rgba(239,68,68,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]
                hover:bg-red-50/80 hover:scale-[1.02] w-full break-words min-w-0 min-h-[60px] flex items-center justify-center"
            >
              Delete My Account
            </div>
            <div className="p-4 xs:p-5 sm:p-6 text-gray-800 border border-gray-200 rounded-2xl cursor-pointer transition-all duration-200 text-center font-medium
              bg-white/80 backdrop-blur-lg
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:bg-gray-50/80 hover:scale-[1.02] w-full break-words min-w-0 min-h-[60px] flex items-center justify-center">
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 xs:p-4 sm:p-6 overflow-x-hidden w-full max-w-full">
      <div className="w-full max-w-full mx-auto overflow-hidden px-1">
        <div className="flex items-center mb-5 sm:mb-6 w-full max-w-full min-w-0">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-3 xs:mr-4 p-2 xs:p-2.5 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words flex-1 min-w-0 pr-2">
            Personal Information
          </h1>
        </div>

        <div className="space-y-5 sm:space-y-6 w-full overflow-hidden">
          {/* Name */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Name
            </h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl mb-3 xs:mb-4 transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="First name"
            />
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Last name"
            />
          </div>

          {/* Date of Birth */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Date Of Birth
            </h2>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
            />
          </div>

        {/* Gender - Keep original */}
        <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
          <button
            onClick={() => handleInputChange('gender', 'male')}
            className={`w-full p-3 rounded-xl text-start transition-all duration-200 text-sm min-h-[44px] flex items-center overflow-hidden ${
              formData.gender === 'male' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white/60 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
            }`}
          >
            Male
          </button>
          <button
            onClick={() => handleInputChange('gender', 'female')}
            className={`w-full p-3 rounded-xl text-start transition-all duration-200 text-sm min-h-[44px] flex items-center overflow-hidden ${
              formData.gender === 'female' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white/60 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
            }`}
          >
            Female
          </button>
        </div>

          {/* Email Address */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Email Address
            </h2>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Email address"
            />
          </div>

            {/* Mobile - Fixed */}
<div className="p-4 xs:p-5 sm:p-6 rounded-2xl
  bg-white/80 backdrop-blur-lg border border-gray-200/60
  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
    Mobile
  </h2>
  <div className="flex flex-col xs:flex-row gap-2 w-full min-w-0">
    <div className="w-full xs:w-auto p-3 rounded-xl bg-gray-100/80 border border-gray-200/60 flex items-start justify-start xs:justify-start text-gray-600 text-sm min-h-[44px] xs:min-w-[80px] flex-shrink-0">
      +974
    </div>
    <input
      type="tel"
      value={formData.mobile}
      onChange={(e) => handleInputChange('mobile', e.target.value)}
      className="flex-1 p-3 rounded-xl transition-all duration-200 text-start
        bg-white/60 backdrop-blur-lg border border-gray-200/60
        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
        focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
        focus:border-blue-200/60 text-sm min-h-[44px] min-w-0"
      placeholder="Phone number"
    />
  </div>
</div>

          {/* Location */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Location
            </h2>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Your location"
            />
          </div>

          {/* Update Profile Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 xs:py-5 rounded-2xl font-medium transition-all duration-200
            shadow-[3px_3px_15px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_20px_rgba(59,130,246,0.4)]
            hover:scale-[1.02] active:scale-[0.98] text-base min-h-[60px]">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderChangePassword = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 xs:p-4 sm:p-6 overflow-x-hidden w-full max-w-full">
      <div className="w-full max-w-full mx-auto overflow-hidden px-1">
        <div className="flex items-center mb-5 sm:mb-6 w-full max-w-full min-w-0">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-3 xs:mr-4 p-2 xs:p-2.5 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words flex-1 min-w-0 pr-2">
            Change Password
          </h1>
        </div>

        <div className="space-y-5 sm:space-y-6 w-full overflow-hidden">
          {/* Old Password */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Old Password
            </h2>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Enter old password"
            />
          </div>

          {/* Email */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Email
            </h2>
            <input
              type="email"
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Your email"
            />
          </div>

          {/* New Password */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              New Password
            </h2>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Confirm Password
            </h2>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full p-3 xs:p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60 text-sm xs:text-base min-w-0 min-h-[50px]"
              placeholder="Confirm new password"
            />
          </div>

          {/* Update Password Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 xs:py-5 rounded-2xl font-medium transition-all duration-200
            shadow-[3px_3px_15px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_20px_rgba(59,130,246,0.4)]
            hover:scale-[1.02] active:scale-[0.98] text-base min-h-[60px]">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteAccount = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 xs:p-4 sm:p-6 overflow-x-hidden w-full max-w-full">
      <div className="w-full max-w-full mx-auto overflow-hidden px-1">
        <div className="flex items-center mb-5 sm:mb-6 w-full max-w-full min-w-0">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-3 xs:mr-4 p-2 xs:p-2.5 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words flex-1 min-w-0 pr-2">
            Delete My Account
          </h1>
        </div>

        <div className="space-y-5 sm:space-y-6 w-full overflow-hidden">
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
              Are you sure you want to delete your account? After deleting, you won't be able to access your account on any other landmark and receive notifications on sales and arrivals of new products from your favourite companies.
            </p>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Can you tell us why you are leaving?
            </h3>
            
            {/* Responsive Reason Selection */}
            <div className="space-y-3 sm:space-y-4 w-full overflow-hidden">
              {[
                { value: 'another-account', label: 'I have another account' },
                { value: 'not-shopping', label: 'I\'m not shopping from here anymore' },
                { value: 'not-using', label: 'I don\'t use this account anymore' },
                { value: 'too-many-emails', label: 'You send too many emails and notifications' },
                { value: 'security', label: 'Security concerns' },
                { value: 'other', label: 'Non of the above' }
              ].map((reason) => (
                <label 
                  key={reason.value}
                  className="flex items-center space-x-3 sm:space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                    bg-white/60 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    hover:border-blue-200/60 w-full overflow-hidden min-w-0 min-h-[60px]"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-gray-700 text-base flex-1 break-words min-w-0 pr-2">
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Delete Account Button */}
          <button 
            onClick={() => setActiveView('deleteConfirm')}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 xs:py-5 rounded-2xl font-medium transition-all duration-200
              shadow-[3px_3px_15px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_20px_rgba(239,68,68,0.4)]
              hover:scale-[1.02] active:scale-[0.98] text-base min-h-[60px]"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirm = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 xs:p-4 sm:p-6 overflow-x-hidden w-full max-w-full">
      <div className="w-full max-w-full mx-auto overflow-hidden px-1">
        <div className="flex items-center mb-5 sm:mb-6 w-full max-w-full min-w-0">
          <button 
            onClick={() => setActiveView('deleteAccount')}
            className="mr-3 xs:mr-4 p-2 xs:p-2.5 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)] flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5 xs:w-6 xs:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words flex-1 min-w-0 pr-2">
            Delete My Account
          </h1>
        </div>

        <div className="space-y-5 sm:space-y-6 w-full overflow-hidden">
          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">
              Are you sure you want to delete your account? After deleting, you won't be able to access your account on any other landmark and receive notifications on sales and arrivals of new products from your favourite companies.
            </p>
          </div>

          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)] w-full overflow-hidden min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-5 break-words">
              Can you tell us why you are leaving?
            </h3>
            
            {/* Responsive Reason Selection */}
            <div className="space-y-3 sm:space-y-4 w-full overflow-hidden">
              {[
                'I have another account',
                'I\'m not shopping from here anymore',
                'I don\'t use this account anymore',
                'You send too many emails and notifications',
                'Security concerns',
                'Non of the above'
              ].map((reason, index) => (
                <label 
                  key={index}
                  className="flex items-center space-x-3 sm:space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                    bg-white/60 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    hover:border-blue-200/60 w-full overflow-hidden min-w-0 min-h-[60px]"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-gray-700 text-base flex-1 break-words min-w-0 pr-2">
                    {reason}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Final Delete Account Button */}
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 xs:py-5 rounded-2xl font-medium transition-all duration-200
            shadow-[3px_3px_15px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_20px_rgba(239,68,68,0.4)]
            hover:scale-[1.02] active:scale-[0.98] text-base min-h-[60px]">
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );

  switch (activeView) {
    case 'personalInfo':
      return renderPersonalInfo();
    case 'changePassword':
      return renderChangePassword();
    case 'deleteAccount':
      return renderDeleteAccount();
    case 'deleteConfirm':
      return renderDeleteConfirm();
    default:
      return renderMainView();
  }
}

export default Settings;