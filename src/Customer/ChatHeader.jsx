import React, { useMemo, useCallback } from "react";

const ChatHeader = React.memo(({ conversation, navigate, API_BASE }) => {
  if (!conversation) {
    return <div className="h-[72px] bg-white border-b" />;
  }

  /* ─────────────── DERIVED DATA ─────────────── */
  const { companyName, companyStatus, logoData } = useMemo(() => {
    const company = conversation.participants?.find(
      (p) => p.participant_type === "App\\Models\\company"
    )?.participant;

    let parsedLogo = null;
    
    // Parse the logo field (it's a JSON string in your data)
    if (company?.logo) {
      try {
        // Check if logo is already an object or a JSON string
        if (typeof company.logo === 'string') {
          parsedLogo = JSON.parse(company.logo);
        } else {
          parsedLogo = company.logo;
        }
      } catch (e) {
        console.warn("Failed to parse logo JSON:", company.logo);
        parsedLogo = company.logo;
      }
    }

    return {
      companyName:
        company?.name_en ||
        company?.name_ar ||
        conversation.title ||
        "Company",
      companyStatus:
        conversation.participant_status ||
        conversation.other_participant_status ||
        "offline",
      logoData: parsedLogo,
    };
  }, [conversation]);

  const handleBack = useCallback(() => {
    navigate("/customer-login");
  }, [navigate]);

  // Get logo URLs with API_BASE prefix
  const logoWebp = logoData?.webp ? `${API_BASE}/${logoData.webp}` : null;
  const logoAvif = logoData?.avif ? `${API_BASE}/${logoData.avif}` : null;

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-white backdrop-blur-3xl border-b border-white/30 shadow-soft">
        <div className="p-2">
          <div className="glass-card rounded-2xl shadow-elevated px-4 py-3.5 flex items-center gap-3 backdrop-blur-xl bg-white/10 border border-white/20">
            {/* Back Button */}
            <button
              onClick={handleBack}
              aria-label="Back"
              className="p-2 rounded-xl hover:bg-white/40 active:bg-white/60 
                         transition-all duration-300 hover:scale-105 active:scale-95
                         glass-border shadow-sm group bg-white/20 backdrop-blur-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Company Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative group">
                {/* Logo Display - Now properly handles both webp and avif */}
                {logoWebp || logoAvif ? (
                  <div className="relative overflow-hidden">
                    <picture>
                      {logoAvif && (
                        <source srcSet={logoAvif} type="image/avif" />
                      )}
                      {logoWebp && (
                        <source srcSet={logoWebp} type="image/webp" />
                      )}
                      <img
                        src={logoWebp || logoAvif}
                        alt={companyName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white/60 shadow-soft"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.parentElement.parentElement.innerHTML = `
                            <div class="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              ${companyName.charAt(0)}
                            </div>
                          `;
                        }}
                      />
                    </picture>
                  </div>
                ) : (
                  // Fallback avatar when no logo
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-soft">
                    {companyName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Status indicator */}
                <span
                  className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                    companyStatus === "online"
                      ? "bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse"
                      : "bg-gray-400/60"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="font-semibold text-gray-800 truncate">
                  {companyName}
                </h1>
                <p
                  className={`text-xs truncate ${
                    companyStatus === "online"
                      ? "text-emerald-600"
                      : "text-gray-500"
                  }`}
                >
                  {companyStatus === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>

          
           
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatHeader;