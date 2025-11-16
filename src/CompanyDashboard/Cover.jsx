import React, { useMemo } from "react";
import { 
  FaWhatsapp, FaMapMarkerAlt, FaFacebook, FaInstagram, 
  FaYoutube, FaLinkedin, FaPinterest, FaSnapchat, FaGooglePlusG 
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export default function Cover({ companyInfo = {}, setActiveTab }) {
  const {
    companyName = "Company Name",
    companyDescription = "Company Description",
    contactMobile = "",
    address = "",
    specialties = [],
    logo = null,
    coverPhoto = null,
    facebook = "",
    instagram = "",
    youtube = "",
    linkedin = "",
    pinterest = "",
    snapchat = "",
    whatsapp = "",
    google = "",
  } = companyInfo;

  // Memoized src for images (avoids creating new URL each render)
  const coverSrc = useMemo(() => {
    if (!coverPhoto) return "/cover.jpg";
    return typeof coverPhoto === "string" ? coverPhoto : URL.createObjectURL(coverPhoto);
  }, [coverPhoto]);

  const logoSrc = useMemo(() => {
  if (!logo) return "";
  return typeof logo === "string" ? logo : URL.createObjectURL(logo);
}, [logo]);

  const socialIcons = {
    facebook: { icon: <FaFacebook />, color: "bg-blue-600", value: facebook },
    instagram: { icon: <FaInstagram />, color: "bg-pink-500", value: instagram },
    youtube: { icon: <FaYoutube />, color: "bg-red-600", value: youtube },
    linkedin: { icon: <FaLinkedin />, color: "bg-blue-700", value: linkedin },
    pinterest: { icon: <FaPinterest />, color: "bg-red-600", value: pinterest },
    snapchat: { icon: <FaSnapchat />, color: "bg-yellow-400", value: snapchat },
    whatsapp: { 
      icon: <FaWhatsapp />, 
      color: "bg-green-500", 
      value: whatsapp 
        ? (whatsapp.startsWith("http") ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g,'')}`) 
        : "" 
    },
    google: { icon: <FaGooglePlusG />, color: "bg-red-500", value: google },
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden shadow-md mb-6">

      {/* COVER PHOTO */}
      <div className="w-full h-56 bg-gray-300">
        <img src={coverSrc} alt="cover" className="object-cover w-full h-full" />
      </div>

        <button
        onClick={() => setActiveTab("Settings")}
        className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded flex items-center gap-1 z-50"
        >
        <FiEdit /> Edit
        </button>


      {/* COMPANY INFO */}
      <div className="flex flex-col md:flex-row items-start gap-4 p-4 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white">

        {/* LOGO */}
        <div className="w-20 h-20 bg-white rounded shadow-md overflow-hidden flex items-center justify-center">
          <img src={logoSrc} alt="logo" className="w-full h-full object-contain" />
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <p className="text-sm opacity-90">{companyDescription}</p>

          {/* SPECIALTIES */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {specialties.map((spec) => (
                <span key={spec} className="bg-white/20 px-2 py-1 rounded text-sm">{spec}</span>
              ))}
            </div>
          )}

          {/* CONTACT & WHATSAPP */}
          <div className="flex items-center gap-3 mt-2">
            {whatsapp && (
              <a href={socialIcons.whatsapp.value} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="text-green-500 text-xl" />
              </a>
            )}
            {contactMobile && <span>{contactMobile}</span>}
          </div>

          {/* ADDRESS */}
          {address && (
            <div className="flex items-center gap-2 mt-1">
              <FaMapMarkerAlt className="text-white/80" />
              <span>{address}</span>
            </div>
          )}

          {/* SOCIAL ICONS */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {Object.entries(socialIcons).map(([key, { icon, color, value }]) => {
              if (!value || key === "whatsapp") return null;
              return (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 flex items-center justify-center rounded text-white font-semibold ${color}`}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
