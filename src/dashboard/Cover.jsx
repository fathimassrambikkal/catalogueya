import React, { useMemo, useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useFixedWords } from "../hooks/useFixedWords";
import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon,
  TwitterIcon,
  PinterestIcon,
  SnapchatIcon,
} from "../components/SocialSvg";
import { FiEdit } from "react-icons/fi";
import { getImageUrl } from "../companyDashboardApi";

export default function Cover({ companyInfo = {}, setActiveTab }) {
  // Use local state to prevent stale data


  const { fixedWords } = useFixedWords();
const fw = fixedWords?.fixed_words || {};
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
      companyName: companyInfo.companyName || companyInfo.name || "",
      companyDescription: companyInfo.companyDescription || companyInfo.description || "",
      contactMobile: companyInfo.contactMobile || companyInfo.phone || companyInfo.mobile || "",
      address: companyInfo.address || "",
      specialties: Array.isArray(companyInfo.specialties) ? companyInfo.specialties : [],
      logo: companyInfo.logo || companyInfo.logo_url || null,
      coverPhoto: companyInfo.coverPhoto || companyInfo.cover_photo || companyInfo.banner || null,
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
    return getImageUrl(coverPhoto);
  }, [coverPhoto]);

  const logoSrc = useMemo(() => {
    return getImageUrl(logo);
  }, [logo]);


const SOCIAL_ICON_MAP = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  pinterest: PinterestIcon,
  snapchat: SnapchatIcon,
  twitter: TwitterIcon,
  tweeter: TwitterIcon,
  whatsapp: WhatsappIcon,
};

const activeSocialIcons = useMemo(() => {
  const raw = {
    facebook,
    instagram,
    youtube,
    linkedin,
    pinterest,
    snapchat,
    twitter: localCompanyInfo.twitter,
    whatsapp: whatsapp
      ? whatsapp.startsWith("http")
        ? whatsapp
        : `https://wa.me/${whatsapp.replace(/\D/g, "")}`
      : "",
  };

  return Object.entries(raw)
    .filter(([, url]) => url && url.trim() !== "")
    .map(([key, url]) => ({
      key,
      url,
      Icon: SOCIAL_ICON_MAP[key],
    }))
    .filter(item => item.Icon);
}, [facebook, instagram, youtube, linkedin, pinterest, snapchat, whatsapp]);



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
  <div className="relative w-full">

    {/* COMPACT COVER - minimal height */}
    <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden">
      {coverSrc ? (
        <img
          src={coverSrc}
          alt="Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
      )}
      
      {/* Ultra-minimal overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
    </div>

    {/* CONTENT - directly overlapping */}
    <div className="relative px-4 -mt-12 sm:-mt-14 md:-mt-16">
      
      {/* Main card - floating minimal */}
 <div
  className="
    relative
    bg-white
    
  

    px-[clamp(24px,5vw,60px)]
    py-[clamp(28px,5vw,60px)]
    p-2 sm:p-4

    rounded-[28px]

  "
>
        <div className="flex items-start gap-3 sm:gap-4">

          {/* LOGO - smaller */}
          <div className="
            w-16 h-16 sm:w-20 sm:h-20
            rounded-xl sm:rounded-2xl
            overflow-hidden
            ring-2 ring-white/50
            shadow-md
            flex-shrink-0
            
          ">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white/60 text-xs">
                {fw.logo || "Logo"}
              </div>
            )}
          </div>

          {/* TEXT AREA */}
          <div className="flex-1 min-w-0 space-y-1.5">
            
            {/* Title row with edit button */}
            <div className="flex items-center justify-between gap-2">
              <h2 className="
                text-gray-900
                font-semibold
                text-base sm:text-lg
                truncate
              ">
                {companyName || fw.company_name || "Company Name"}
              </h2>
              
              {/* EDIT BUTTON - small */}
              <button
                onClick={() => setActiveTab("Settings")}
                className="
                  w-7 h-7 sm:w-8 sm:h-8
                  rounded-full
                  bg-gray-100
                  flex items-center justify-center
                  text-gray-600
                  hover:bg-gray-200
                  transition-colors
                  flex-shrink-0
                "
                aria-label="Edit profile"
              >
                <FiEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Description - minimal */}
            <p className="
              text-gray-500
              text-xs sm:text-sm
              line-clamp-2
              leading-relaxed
            ">
              {companyDescription || fw.company_description || "Company Description"}
            </p>

            {/* Specialties - tiny chips */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {specialties.slice(0, 3).map((s, index) => (
                  <span
                    key={`${s}-${index}`}
                    className="
                      px-2 py-0.5
                      text-[10px] sm:text-xs
                      bg-gray-100
                      text-gray-600
                      rounded-full
                    "
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

      {/* Contact row - compact */}
<div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500">

  {/* {contactMobile && (
    <span className="flex items-center gap-1.5">
      <IconPhoneModern className="w-3.5 h-3.5 text-gray-900" />
      {contactMobile}
    </span>
  )} */}

  {address && (
    <span className="flex items-center gap-1.5 truncate max-w-[150px]">
      <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
      <span className="truncate">{address}</span>
    </span>
  )}

</div>
          </div>
        </div>

        {/* Social Icons - minimal */}
        {activeSocialIcons.length > 0 && (
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-100">
            {activeSocialIcons.map(({ key, url, Icon }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-7 h-7 sm:w-8 sm:h-8
                  rounded-full
                  bg-gray-50
                  hover:bg-gray-100
                  flex items-center justify-center
                  text-gray-500 hover:text-gray-700
                  transition-colors
                "
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}