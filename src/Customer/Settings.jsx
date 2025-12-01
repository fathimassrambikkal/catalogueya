import React, { useState } from 'react';

function Settings() {
  const [activeView, setActiveView] = useState('main');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedReason, setSelectedReason] = useState('');
  const [formData, setFormData] = useState({
    name: '', surname: '', dateOfBirth: '', gender: '', email: '', mobile: '', location: '',
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ------------------ MAIN VIEW ------------------ */
  const renderMainView = () => (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-4">

        {/* Personal Info */}
        <div onClick={() => setActiveView('personalInfo')}
          className="flex justify-between items-center p-5 rounded-2xl cursor-pointer bg-white/80 border border-gray-200/60 backdrop-blur-lg shadow hover:scale-[1.02] transition w-full min-w-0">
          <span className="text-lg flex-1 min-w-0">Personal Information</span>
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>

        {/* Change Password */}
        <div onClick={() => setActiveView('changePassword')}
          className="flex justify-between items-center p-5 rounded-2xl cursor-pointer bg-white/80 border border-gray-200/60 backdrop-blur-lg shadow hover:scale-[1.02] transition w-full min-w-0">
          <span className="text-lg flex-1 min-w-0">Change Password</span>
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center p-5 rounded-2xl bg-white/80 border border-gray-200/60 backdrop-blur-lg shadow w-full min-w-0">
          <span className="text-lg">Notifications</span>
          <div className="flex items-center gap-3">
            <span className="text-sm">OFF</span>
            <div onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-7 p-1 rounded-full flex items-center cursor-pointer transition ${
                notificationsEnabled ? "bg-green-500" : "bg-gray-300"
              }`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transition ${
                notificationsEnabled ? "translate-x-7" : ""
              }`}/>
            </div>
            <span className="text-sm">ON</span>
          </div>
        </div>

        {/* Country Language */}
        <div className="p-5 rounded-2xl bg-white/80 border border-gray-200/60 backdrop-blur-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Country & Language</h2>
          <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
            <span>Language</span>
            <span className="whitespace-nowrap">English</span>
          </div>
        </div>

        {/* Delete + Sign out */}
        <div className="space-y-4">
          <div onClick={() => setActiveView('deleteAccount')}
            className="p-5 text-red-600 text-center rounded-2xl bg-white/80 border border-red-200 cursor-pointer shadow hover:scale-[1.02]">
            Delete My Account
          </div>
          <div className="p-5 text-center rounded-2xl bg-white/80 border border-gray-200 cursor-pointer shadow hover:scale-[1.02]">
            Sign Out
          </div>
        </div>
      </div>
    </div>
  );

  /* ------------------ PERSONAL INFO ------------------ */
  const renderPersonalInfo = () => (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">
      <div className="flex items-center mb-6">
        <button onClick={() => setActiveView('main')}
          className="p-3 rounded-xl bg-white border shadow flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold ml-4">Personal Information</h1>
      </div>

      <div className="space-y-6">

        {/* Name */}
        <div className="p-5 rounded-2xl bg-white/80 border shadow">
          <h2 className="text-xl font-semibold mb-4">Name</h2>
          <input value={formData.name} onChange={e=>handleInputChange('name',e.target.value)}
            className="w-full p-3 rounded-xl border mb-4" placeholder="First Name"/>
          <input value={formData.surname} onChange={e=>handleInputChange('surname',e.target.value)}
            className="w-full p-3 rounded-xl border" placeholder="Last Name"/>
        </div>

        {/* DOB */}
        <div className="p-5 rounded-2xl bg-white/80 border shadow">
          <h2 className="text-xl font-semibold mb-4">Date Of Birth</h2>
          <input type="date" value={formData.dateOfBirth} onChange={e=>handleInputChange('dateOfBirth',e.target.value)}
            className="w-full p-3 rounded-xl border"/>
        </div>

        {/* Gender */}
        <div className="flex gap-3">
          {["male","female"].map(g=>(
            <button key={g} onClick={()=>handleInputChange('gender',g)}
              className={`flex-1 p-3 rounded-xl border ${
                formData.gender===g ? "bg-blue-600 text-white" : "bg-white"
              }`}>
              {g.charAt(0).toUpperCase()+g.slice(1)}
            </button>
          ))}
        </div>

        {/* Email */}
        <div className="p-5 rounded-2xl bg-white/80 border shadow">
          <h2 className="text-xl font-semibold mb-4">Email</h2>
          <input type="email" value={formData.email} onChange={e=>handleInputChange('email',e.target.value)}
          className="w-full p-3 rounded-xl border" placeholder="Email Address"/>
        </div>

        {/* Mobile */}
        <div className="p-5 rounded-2xl bg-white/80 border shadow">
          <h2 className="text-xl font-semibold mb-4">Mobile</h2>
          <div className="flex gap-3">
            <div className="p-3 bg-gray-100 rounded-xl border w-20 flex items-center justify-center">+974</div>
            <input value={formData.mobile} onChange={e=>handleInputChange('mobile',e.target.value)}
            className="flex-1 p-3 rounded-xl border" placeholder="Phone Number"/>
          </div>
        </div>

        {/* Location */}
        <div className="p-5 rounded-2xl bg-white/80 border shadow">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <input value={formData.location} onChange={e=>handleInputChange('location',e.target.value)}
          className="w-full p-3 rounded-xl border" placeholder="Your location"/>
        </div>

        <button className="w-full py-4 rounded-2xl bg-blue-600 text-white shadow">Update Profile</button>

      </div>
    </div>
  );

  /* ------------------ CHANGE PASSWORD ------------------ */
  const renderChangePassword = () => (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">
      <div className="flex items-center mb-6">
        <button onClick={()=>setActiveView('main')}
          className="p-3 bg-white rounded-xl border shadow flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold ml-4">Change Password</h1>
      </div>

      <div className="space-y-6">
        {[
          {label:"Old Password",field:"oldPassword",type:"password"},
          {label:"Email",field:"email",type:"email"},
          {label:"New Password",field:"newPassword",type:"password"},
          {label:"Confirm Password",field:"confirmPassword",type:"password"}
        ].map((item,i)=>(
          <div key={i} className="p-5 bg-white/80 rounded-2xl border shadow">
            <h2 className="text-xl font-semibold mb-4">{item.label}</h2>
            <input type={item.type} value={formData[item.field]}
              onChange={e=>handleInputChange(item.field,e.target.value)}
              className="w-full p-3 rounded-xl border" placeholder={item.label}/>
          </div>
        ))}

        <button className="w-full py-4 rounded-2xl bg-blue-600 text-white shadow">Update Password</button>
      </div>
    </div>
  );

  /* ------------------ DELETE ACCOUNT ------------------ */
  const renderDeleteAccount = () => (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">

      <div className="flex items-center mb-6">
        <button onClick={()=>setActiveView('main')}
          className="p-3 bg-white rounded-xl border shadow flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold ml-4">Delete My Account</h1>
      </div>

      <div className="space-y-6">

        <div className="p-5 bg-white/80 border rounded-2xl shadow">
          <p className="text-gray-700">
            Are you sure you want to delete your account? You won't be able to access it again.
          </p>
        </div>

        <div className="p-5 bg-white/80 border rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-4">Why are you leaving?</h3>

          <div className="space-y-3">
            {[
              {value:'another-account', label:'I have another account'},
              {value:'not-shopping', label:'I\'m not shopping from here anymore'},
              {value:'not-using', label:'I don\'t use this account anymore'},
              {value:'too-many-emails', label:'Too many emails/notifications'},
              {value:'security', label:'Security concerns'},
              {value:'other', label:'None of the above'}
            ].map((x,i)=>(
              <label key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow cursor-pointer">
                <input type="radio" name="reason" checked={selectedReason===x.value}
                  value={x.value} onChange={e=>setSelectedReason(e.target.value)}
                  className="w-5 h-5 flex-shrink-0"/>
                <span className="flex-1">{x.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={()=>setActiveView('deleteConfirm')}
          className="w-full py-4 rounded-2xl bg-red-600 text-white shadow">
          Delete My Account
        </button>

      </div>
    </div>
  );

  /* ------------------ DELETE CONFIRM ------------------ */
  const renderDeleteConfirm = () => (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 overflow-x-hidden">

      <div className="flex items-center mb-6">
        <button onClick={()=>setActiveView('deleteAccount')}
          className="p-3 bg-white rounded-xl border shadow flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold ml-4">Delete My Account</h1>
      </div>

      <div className="space-y-6">

        <div className="p-5 bg-white/80 border rounded-2xl shadow">
          <p className="text-gray-700">
            This action is permanent. You cannot undo this.
          </p>
        </div>

        <button className="w-full py-4 bg-red-600 rounded-2xl text-white shadow">
          Confirm Delete
        </button>

      </div>
    </div>
  );

  /* ------------------ RENDER ------------------ */
  switch (activeView) {
    case 'personalInfo': return renderPersonalInfo();
    case 'changePassword': return renderChangePassword();
    case 'deleteAccount': return renderDeleteAccount();
    case 'deleteConfirm': return renderDeleteConfirm();
    default: return renderMainView();
  }
}

export default Settings;
