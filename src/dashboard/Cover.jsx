import React, { useMemo, useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaPinterest,
  FaSnapchat,
  FaGooglePlusG,
} from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

export default function Cover({ companyInfo = {}, setActiveTab }) {
  // Use local state to prevent stale data
  const [localCompanyInfo, setLocalCompanyInfo] = useState({
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
  });

  // Update local state when companyInfo changes
  useEffect(() => {
    console.log("🔄 Cover component received new companyInfo:", companyInfo?.companyName || "No name");
    
    // Reset to defaults first if no valid company info
    if (!companyInfo || Object.keys(companyInfo).length === 0) {
      setLocalCompanyInfo({
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
      });
      return;
    }

    // Only update if we have valid data
    setLocalCompanyInfo({
      companyName: companyInfo.companyName || "",
      companyDescription: companyInfo.companyDescription || "",
      contactMobile: companyInfo.contactMobile || "",
      address: companyInfo.address || "",
      specialties: Array.isArray(companyInfo.specialties) ? companyInfo.specialties : [],
      logo: companyInfo.logo || null,
      coverPhoto: companyInfo.coverPhoto || null,
      facebook: companyInfo.facebook || "",
      instagram: companyInfo.instagram || "",
      youtube: companyInfo.youtube || "",
      linkedin: companyInfo.linkedin || "",
      pinterest: companyInfo.pinterest || "",
      snapchat: companyInfo.snapchat || "",
      whatsapp: companyInfo.whatsapp || "",
      google: companyInfo.google || "",
    });
  }, [companyInfo]);

  const {
    companyName,
    companyDescription,
    contactMobile,
    address,
    specialties,
    logo,
    coverPhoto,
    facebook,
    instagram,
    youtube,
    linkedin,
    pinterest,
    snapchat,
    whatsapp,
    google,
  } = localCompanyInfo;

  const coverSrc = useMemo(() => {
    if (!coverPhoto) return "/cover.jpg";
    
    // Handle both string URLs and File objects
    if (typeof coverPhoto === "string") {
      // Check if it's a valid URL or needs processing
      if (coverPhoto.startsWith("http") || coverPhoto.startsWith("/") || coverPhoto.startsWith("data:")) {
        return coverPhoto;
      }
      // If it's just a filename or path, try to construct URL
      try {
        // Try to create object URL if it looks like a file path
        if (coverPhoto.includes("/") || coverPhoto.includes("\\")) {
          return coverPhoto;
        }
      } catch (err) {
        console.error("Error processing cover photo:", err);
      }
    }
    
    // Fallback to default
    return "/cover.jpg";
  }, [coverPhoto]);

  const logoSrc = useMemo(() => {
    if (!logo) return null;
    
    // Handle both string URLs and File objects
    if (typeof logo === "string") {
      // Check if it's a valid URL
      if (logo.startsWith("http") || logo.startsWith("/") || logo.startsWith("data:")) {
        return logo;
      }
      // If it's just a filename or path
      try {
        return logo;
      } catch (err) {
        console.error("Error processing logo:", err);
      }
    }
    
    return null;
  }, [logo]);

  const socialIcons = useMemo(
    () => ({
      facebook: { icon: <FaFacebook />, link: facebook },
      instagram: { icon: <FaInstagram />, link: instagram },
      youtube: { icon: <FaYoutube />, link: youtube },
      linkedin: { icon: <FaLinkedin />, link: linkedin },
      pinterest: { icon: <FaPinterest />, link: pinterest },
      snapchat: { icon: <FaSnapchat />, link: snapchat },
      whatsapp: {
        icon: <FaWhatsapp />,
        link: whatsapp
          ? whatsapp.startsWith("http")
            ? whatsapp
            : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
          : "",
      },
      google: { icon: <FaGooglePlusG />, link: google },
    }),
    [facebook, instagram, youtube, linkedin, pinterest, snapchat, whatsapp, google]
  );

  const activeSocialIcons = useMemo(
    () => Object.entries(socialIcons).filter(([, obj]) => obj.link && obj.link.trim() !== ""),
    [socialIcons]
  );

  const iconChunks = useMemo(() => {
    const rows = [];
    for (let i = 0; i < activeSocialIcons.length; i += 3) {
      rows.push(activeSocialIcons.slice(i, i + 3));
    }
    return rows;
  }, [activeSocialIcons]);

  // Debug log
  useEffect(() => {
    console.log("🎯 Cover component rendering with:", {
      companyName,
      hasLogo: !!logo,
      hasCover: !!coverPhoto,
      socialIconsCount: activeSocialIcons.length
    });
  }, [companyName, logo, coverPhoto, activeSocialIcons.length]);

  return (
    <div className="relative w-full overflow-hidden shadow-md mb-6 max-w-full min-w-0">

      {/* COVER PHOTO */}
      <div className="w-full h-52 sm:h-48 md:h-56 lg:h-64 bg-gray-300 min-w-0">
        <img
          src={coverSrc}
          alt="Cover"
          className="w-full h-full object-cover min-w-0"
          onError={(e) => {
            console.error("❌ Cover image failed to load:", coverSrc);
            e.target.src = "/cover.jpg";
          }}
        />
      </div>

      {/* EDIT BUTTON */}
      <button
        onClick={() => setActiveTab("Settings")}
        className="
          absolute top-3 right-3 sm:top-4 sm:right-4 z-50 px-3 py-1.5 sm:px-4 sm:py-2
          bg-gray-900/10 text-white rounded-lg sm:rounded-xl border border-white/20 
          backdrop-blur-md flex items-center gap-2 transition-all duration-300
          hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]
          min-w-0
        "
      >
        <FiEdit className="text-xs sm:text-sm" />
        <span className="hidden xs:inline">Edit</span>
      </button>

      {/* SOCIAL ICON DOCK */}
      {activeSocialIcons.length > 0 && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 max-w-[calc(100%-24px)] min-w-0">
          <div
            className="
              bg-white/20 backdrop-blur-md border border-white/20 p-2 sm:p-3 md:p-4
              rounded-2xl shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]
              min-w-0
            "
          >
            <div className="flex flex-col sm:flex-row gap-3 min-w-0">
              {iconChunks.map((chunk, i) => (
                <div key={i} className="flex gap-3 justify-center sm:justify-start min-w-0">
                  {chunk.map(([key, { icon, link }]) => (
                    <a
                      key={key}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 
                        flex items-center justify-center min-w-0
                        text-white text-sm sm:text-base md:text-lg
                        rounded-xl bg-white/20 border border-white/30
                        backdrop-blur-md transition-all duration-300 group
                        hover:bg-white/30 hover:scale-110 hover:-translate-y-1
                      "
                      onClick={(e) => {
                        if (!link || link.trim() === "") {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className="z-10 group-hover:scale-110 transition-transform">
                        {icon}
                      </div>

                      {/* Tooltip */}
                      <div
                        className="
                          absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px]
                          bg-white/20 backdrop-blur-lg border border-white/30 px-2 py-1 rounded
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          pointer-events-none whitespace-nowrap
                        "
                      >
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

      {/* COMPANY INFO BLOCK */}
      <div className="absolute bottom-0 left-0 w-full p-4 flex items-start gap-3 sm:gap-4 min-w-0">

        {/* LOGO */}
        <div
          className="
            w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0 min-w-0
            rounded-lg sm:rounded-xl overflow-hidden 
            border border-white/20 backdrop-blur-md
            shadow-[inset_1px_1px_2px rgba(255,255,255,0.2)]
          "
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                console.error("❌ Logo failed to load:", logoSrc);
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
              No Logo
            </div>
          )}
        </div>

        {/* TEXT BLOCK */}
        <div className="flex-1 min-w-0">

          <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate">
            {companyName || "Company Name"}
          </h1>

          <p className="text-white text-xs sm:text-sm opacity-90 mt-1 line-clamp-2 min-w-0">
            {companyDescription || "Company Description"}
          </p>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 min-w-0">
              {specialties.map((s, index) => (
                <span
                  key={`${s}-${index}`}
                  className="
                    px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-full 
                    text-white bg-gray-900/10 border border-white/20 
                    backdrop-blur-sm max-w-full truncate min-w-0
                  "
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-2 mt-2 min-w-0">

            {contactMobile && (
              <div
                className="
                  px-3 py-1 rounded-md text-xs sm:text-sm text-white 
                  bg-gray-900/10 border border-white/20 backdrop-blur-sm min-w-0
                "
              >
                {contactMobile}
              </div>
            )}

            {address && (
              <div
                className="
                  flex items-center gap-2 px-3 py-1 rounded-md text-xs sm:text-sm text-white 
                  bg-gray-900/10 border border-white/20 backdrop-blur-sm min-w-0
                "
              >
                <FaMapMarkerAlt className="text-white/80 text-xs flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-xs min-w-0">
                  {address}
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}