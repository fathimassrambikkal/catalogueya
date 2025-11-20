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
    facebook: { 
      icon: <FaFacebook />, 
      color: "text-white", 
      value: facebook 
    },
    instagram: { 
      icon: <FaInstagram />, 
      color: "text-white", 
      value: instagram 
    },
    youtube: { 
      icon: <FaYoutube />, 
      color: "text-white", 
      value: youtube 
    },
    linkedin: { 
      icon: <FaLinkedin />, 
      color: "text-white", 
      value: linkedin 
    },
    pinterest: { 
      icon: <FaPinterest />, 
      color: "text-white", 
      value: pinterest 
    },
    snapchat: { 
      icon: <FaSnapchat />, 
      color: "text-white", 
      value: snapchat 
    },
    whatsapp: { 
      icon: <FaWhatsapp />, 
      color: "text-white",
      value: whatsapp 
        ? (whatsapp.startsWith("http")
            ? whatsapp
            : `https://wa.me/${whatsapp.replace(/\D/g, '')}`
          )
        : "" 
    },
    google: { 
      icon: <FaGooglePlusG />, 
      color: "text-white", 
      value: google 
    },
  };

  // Filter social icons that have values (now includes WhatsApp)
  const activeSocialIcons = Object.entries(socialIcons).filter(([key, { value }]) => 
    value
  );

  // Split icons into chunks of 3 for mobile layout
  const chunkIcons = (icons, size) => {
    const chunks = [];
    for (let i = 0; i < icons.length; i += size) {
      chunks.push(icons.slice(i, i + size));
    }
    return chunks;
  };

  const iconChunks = chunkIcons(activeSocialIcons, 3);

  return (
    <div className="relative w-full overflow-hidden shadow-md mb-6">

      {/* COVER PHOTO - Responsive height with dark overlay only on image */}
      <div className="w-full h-52 sm:h-48 md:h-56 lg:h-64 bg-gray-300 relative">
        <img src={coverSrc} alt="cover" className="object-cover w-full h-full" />
        {/* Dark overlay gradient only on the image for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none"></div>
      </div>

      {/* EDIT BUTTON - Matching the dark theme */}
      <button
        onClick={() => setActiveTab("Settings")}
        className={`
          absolute top-3 right-3 sm:top-4 sm:right-4 z-50
          px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2
          bg-gray-900/10 backdrop-blur-md border border-white/20
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
          hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]
          hover:scale-105
          transition-all duration-300 ease-out
          text-white text-sm sm:text-base
        `}
      >
        <FiEdit className="text-xs sm:text-sm" /> 
        <span className="hidden xs:inline">Edit</span>
      </button>

      {/* FLOATING SOCIAL ICONS DOCK - 3 icons per row on mobile */}
      {activeSocialIcons.length > 0 && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40">
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20 shadow-2xl">
            {/* Mobile: Vertical layout with 3 icons per row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              {iconChunks.map((chunk, chunkIndex) => (
                <div key={chunkIndex} className="flex gap-2 justify-center sm:justify-start">
                  {chunk.map(([key, { icon, color, value }]) => (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center 
                        rounded-lg sm:rounded-xl
                        bg-gray-700/10 backdrop-blur-xl 
                        border border-white/20
                        shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
                        transition-all duration-300 ease-out group relative
                        text-sm sm:text-base md:text-lg
                        hover:bg-gray-300/20
                        hover:shadow-[0_0_5px_currentColor]
                        hover:scale-110 hover:-translate-y-1
                        ${color}
                      `}
                    >
                      {/* Icon */}
                      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {icon}
                      </div>
                      
                      {/* Tooltip - Responsive positioning */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                        bg-black/80 text-white text-xs px-2 py-1  
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        whitespace-nowrap pointer-events-none rounded-xl shadow-[0_0_5px_currentColor]">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COMPANY INFO - Updated to match right floating card theme */}
      <div className="flex flex-row items-start p-3 sm:p-4 absolute bottom-0 left-0 w-full">

        {/* LOGO - Matching dark glass theme */}
        <div className={`
          w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center
           backdrop-blur-md border border-white/20
          shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.25)]
          ml-8 sm:ml-4 md:ml-8 lg:ml-20 mb-20 sm:mb-16
        `}>
          <img src={logoSrc} alt="logo" className="w-full h-full object-contain p-1" />
        </div>

        {/* DETAILS - Dark glass container matching right side */}
        <div className="flex-1 ml-2 sm:ml-3 md:ml-4 max-w-full">
          <div className="  
            ">
            
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight text-white drop-shadow-md">{companyName}</h1>
            <p className="text-xs sm:text-sm opacity-90 max-w-2xl leading-relaxed mt-1 text-white drop-shadow-md">
              {companyDescription}
            </p>

            {/* SPECIALTIES - Matching dark badges */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-2">
                {specialties.map((spec) => (
                  <span 
                    key={spec} 
                    className={`
                      px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm
                      bg-gray-900/10 backdrop-blur-sm border border-white/20
                      shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]
                      hover:bg-gray-300/20
                      transition-all duration-300
                      break-words max-w-[120px] sm:max-w-none text-white drop-shadow-sm
                    `}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* CONTACT INFO & ADDRESS - Matching dark theme */}
            <div className="flex flex-wrap gap-2 mt-2">
              {contactMobile && (
                <div className={`
                  px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm
                  bg-gray-900/10 backdrop-blur-sm border border-white/20
                  shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]
                  w-fit text-white drop-shadow-sm
                `}>
                  {contactMobile}
                </div>
              )}

              {/* ADDRESS - Matching theme */}
              {address && (
                <div className="flex items-center gap-1 sm:gap-2 w-fit">
                  <div className={`
                    px-2 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm
                    bg-gray-900/10 backdrop-blur-sm border border-white/20
                    shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)]
                    text-white drop-shadow-sm
                  `}>
                    <FaMapMarkerAlt className="text-white/80 text-xs sm:text-sm" />
                    <span className="max-w-[150px] xs:max-w-[200px] sm:max-w-xs truncate">{address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}