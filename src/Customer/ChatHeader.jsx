import React, { useMemo, useCallback } from "react";

const ChatHeader = React.memo(({ conversation, navigate, API_BASE }) => {
  if (!conversation) return null;

  /* ─────────────── DERIVED DATA (APPLE STYLE) ─────────────── */
  const { company, companyName, companyStatus, companyLogo } = useMemo(() => {
    const companyParticipant = conversation.participants?.find(
      (p) => p.participant_type === "App\\Models\\company"
    );

    const company = companyParticipant?.participant;

    return {
      company,
      companyName:
        company?.name_en ||
        company?.name_ar ||
        conversation.title ||
        "Company",
      companyStatus: conversation.participant_status,
      companyLogo: company?.logo ? `${API_BASE}/${company.logo}` : null,
    };
  }, [conversation, API_BASE]);

  /* ─────────────── STABLE HANDLER ─────────────── */
  const handleBack = useCallback(() => {
    navigate("/customer-login");
  }, [navigate]);

  return (
    <div className="sticky top-0 z-50 ">
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
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700 group-hover:text-gray-900 transition-colors"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Company Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative group">

                {/* Logo */}
                {companyLogo ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white/60 shadow-soft transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-gray-600 text-sm font-medium ring-1.5 ring-white/60 bg-white/30 backdrop-blur-sm">
                    {companyName.charAt(0)}
                  </div>
                )}

                {/* Status Dot */}
                {companyStatus && (
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full ring-2 ring-white transition-all duration-300 ${
                      companyStatus === "online"
                        ? "bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse-subtle"
                        : "bg-gray-400/60"
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h1 className="font-medium text-gray-800 tracking-tight truncate text-[15px]">
                  {companyName}
                </h1>
                <p className="text-xs text-gray-500/80 font-light mt-0.5 tracking-wide">
                  {companyStatus}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

ChatHeader.displayName = "ChatHeader";
export default ChatHeader;
