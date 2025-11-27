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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <div className="space-y-4">
          {/* Personal Information */}
          <div 
            onClick={() => setActiveView('personalInfo')}
            className="flex justify-between items-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02]"
          >
            <span className="text-gray-800 font-medium text-base sm:text-lg">Personal Information</span>
            <span className="text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          {/* Change Password */}
          <div 
            onClick={() => setActiveView('changePassword')}
            className="flex justify-between items-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:border-blue-200/60 hover:scale-[1.02]"
          >
            <span className="text-gray-800 font-medium text-base sm:text-lg">Change Password</span>
            <span className="text-blue-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </span>
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <span className="text-gray-800 font-medium text-base sm:text-lg">Notifications</span>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">OFF</span>
              <div 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                  notificationsEnabled 
                    ? 'bg-gradient-to-r from-green-500 to-green-600' 
                    : 'bg-gray-300'
                } shadow-inner`}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-300 ${
                    notificationsEnabled ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm text-gray-500">ON</span>
            </div>
          </div>

          {/* Country & Language */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Country & Language</h2>
            <div className="flex justify-between items-center p-3 rounded-xl
              bg-gray-50/80 border border-gray-200/60">
              <span className="text-gray-800 text-sm sm:text-base">Language</span>
              <span className="text-gray-600 text-sm sm:text-base">English</span>
            </div>
          </div>

          {/* Delete Account & Sign Out */}
          <div className="space-y-3">
            <div 
              onClick={() => setActiveView('deleteAccount')}
              className="p-4 sm:p-6 text-red-600 border border-red-200 rounded-2xl cursor-pointer transition-all duration-200 text-center font-medium
                bg-white/80 backdrop-blur-lg
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                hover:shadow-[3px_3px_15px_rgba(239,68,68,0.1),-3px_-3px_15px_rgba(255,255,255,0.8)]
                hover:bg-red-50/80 hover:scale-[1.02]"
            >
              Delete My Account
            </div>
            <div className="p-4 sm:p-6 text-gray-800 border border-gray-200 rounded-2xl cursor-pointer transition-all duration-200 text-center font-medium
              bg-white/80 backdrop-blur-lg
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_15px_rgba(0,0,0,0.08),-3px_-3px_15px_rgba(255,255,255,0.8)]
              hover:bg-gray-50/80 hover:scale-[1.02]">
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Personal Information</h1>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Name</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-4 rounded-xl mb-3 transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="First name"
            />
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Last name"
            />
          </div>

          {/* Date of Birth */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Date Of Birth</h2>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
            />
          </div>

          {/* Gender */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Gender</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleInputChange('gender', 'male')}
                className={`flex-1 p-4 rounded-xl text-center transition-all duration-200 ${
                  formData.gender === 'male' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-white/60 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => handleInputChange('gender', 'female')}
                className={`flex-1 p-4 rounded-xl text-center transition-all duration-200 ${
                  formData.gender === 'female' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-white/60 text-gray-700 backdrop-blur-lg border border-gray-200/60 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Email Address */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Email Address</h2>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Email address"
            />
          </div>

          {/* Mobile */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Mobile</h2>
            <div className="flex">
              <div className="w-20 p-4 rounded-l-xl bg-gray-100/80 border border-gray-200/60 flex items-center justify-center text-gray-600">
                +974
              </div>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="flex-1 p-4 rounded-r-xl transition-all duration-200
                  bg-white/60 backdrop-blur-lg border border-gray-200/60 border-l-0
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                  focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                  focus:border-blue-200/60"
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Location */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Location</h2>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Your location"
            />
          </div>

          {/* Update Profile Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-medium  transition-all duration-200
            shadow-[3px_3px_15px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_20px_rgba(59,130,246,0.4)]
            hover:scale-[1.02] active:scale-[0.98]">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );

  const renderChangePassword = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Change Password</h1>
        </div>

        <div className="space-y-6">
          {/* Old Password */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Old Password</h2>
            <input
              type="password"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Enter old password"
            />
          </div>

          {/* Email */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Email</h2>
            <input
              type="email"
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Your email"
            />
          </div>

          {/* New Password */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">New Password</h2>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Confirm Password</h2>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full p-4 rounded-xl transition-all duration-200
                bg-white/60 backdrop-blur-lg border border-gray-200/60
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                focus:border-blue-200/60"
              placeholder="Confirm new password"
            />
          </div>

          {/* Update Password Button */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-medium  transition-all duration-200
            shadow-[3px_3px_15px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_20px_rgba(59,130,246,0.4)]
            hover:scale-[1.02] active:scale-[0.98]">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteAccount = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('main')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Delete My Account</h1>
        </div>

        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Are you sure you want to delete your account? After deleting, you won't be able to access your account on any other landmark and receive notifications on sales and arrivals of new products from your favourite companies.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Can you tell us why you are leaving?</h3>
            
            {/* Responsive Reason Selection - Fixed */}
            <div className="space-y-3">
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
                  className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200
                    bg-white/60 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    hover:border-blue-200/60"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm sm:text-base flex-1">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delete Account Button */}
          <button 
            onClick={() => setActiveView('deleteConfirm')}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-medium transition-all duration-200
              shadow-[3px_3px_15px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_20px_rgba(239,68,68,0.4)]
              hover:scale-[1.02] active:scale-[0.98]"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirm = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setActiveView('deleteAccount')}
            className="mr-4 p-2 rounded-xl text-gray-600 hover:text-blue-500 transition-all duration-200
              bg-white/80 backdrop-blur-lg border border-gray-200/60
              shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
              hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Delete My Account</h1>
        </div>

        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Are you sure you want to delete your account? After deleting, you won't be able to access your account on any other landmark and receive notifications on sales and arrivals of new products from your favourite companies.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl
            bg-white/80 backdrop-blur-lg border border-gray-200/60
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Can you tell us why you are leaving?</h3>
            
            {/* Responsive Reason Selection - Fixed */}
            <div className="space-y-3">
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
                  className="flex items-center space-x-3 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200
                    bg-white/60 backdrop-blur-lg border border-gray-200/60
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]
                    hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08),-3px_-3px_10px_rgba(255,255,255,0.8)]
                    hover:border-blue-200/60"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm sm:text-base flex-1">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Final Delete Account Button */}
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-2xl font-medium transition-all duration-200
            shadow-[3px_3px_15px_rgba(239,68,68,0.3)] hover:shadow-[3px_3px_20px_rgba(239,68,68,0.4)]
            hover:scale-[1.02] active:scale-[0.98]">
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