import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerConversations } from "../api";
import SmartImage from "../components/SmartImage";
import { error } from "../utils/logger";

/* ───────── TIME FORMAT ───────── */
const timeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

/* ───────── COMPONENT ───────── */
export default function Messages() {
  const navigate = useNavigate();
  const scrollPos = useRef(0);
  const fetchTimeout = useRef(null);

  const [search, setSearch] = useState("");

  /* 🚀 Instant cache */
  const [conversations, setConversations] = useState(() => {
    try {
      const cached = localStorage.getItem("whatsapp_conversations");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  /* 🚀 Fetch */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await getCustomerConversations();
      const list = res.data?.data || res.data?.conversations || res.data || [];
      const safe = Array.isArray(list) ? list : [];
      setConversations(safe);
      localStorage.setItem("whatsapp_conversations", JSON.stringify(safe));
    } catch (err) {
      error("Messages fetch failed", err);
    }
  }, []);

  /* 🚀 Sync */
  useEffect(() => {
    window.scrollTo(0, scrollPos.current);
    fetchConversations();

    const onFocus = () => {
      clearTimeout(fetchTimeout.current);
      fetchTimeout.current = setTimeout(fetchConversations, 150);
    };

    window.addEventListener("focus", onFocus);
    const interval = setInterval(fetchConversations, 30000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
      clearTimeout(fetchTimeout.current);
    };
  }, [fetchConversations]);

  /* 🔍 Search filter */
  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => {
      const company = c.participants?.find(
        (p) => p.participant_type === "App\\Models\\company"
      )?.participant;
      return (
        company?.name_en?.toLowerCase().includes(q) ||
        company?.name_ar?.toLowerCase().includes(q) ||
        c.last_message?.body?.toLowerCase().includes(q)
      );
    });
  }, [search, conversations]);

  /* 🚀 Open chat */
  const openConversation = (conv) => {
    scrollPos.current = window.scrollY;

    if (conv.unread_count > 0) {
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conv.id ? { ...c, unread_count: 0 } : c
        );
        localStorage.setItem("whatsapp_conversations", JSON.stringify(updated));
        return updated;
      });
    }

    navigate(`/customer-login/chat/${conv.id}`, {
      state: { conversation: conv, cachedAt: Date.now() },
    });
  };

  /* ───────── RENDER ───────── */
  return (
    <div className="min-h-screen w-full px-[clamp(12px,3vw,32px)] mt-28 md:mt-20">
      {/* 🏆 HEADER SECTION */}
      <div className="sticky top-0 z-40 pt-[clamp(16px,4vh,24px)] pb-[clamp(12px,2vh,16px)] backdrop-blur-xl bg-gradient-to-b from-white via-white/95 to-white/90">
        <div className="w-full">
          {/* Title */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-[clamp(8px,2vw,16px)] mb-[clamp(16px,3vh,24px)] px-[clamp(4px,1vw,8px)]">
            <div className="flex items-center gap-[clamp(8px,2vw,12px)]">
              <div>
                <h1 className="text-2xl sm:text-3xl  font-semibold text-gray-900 leading-tight  ">
                  Messages
                </h1>
                <p className="text-[clamp(12px,3vw,14px)] text-gray-500 mt-[clamp(2px,0.5vh,4px)]">
                  {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* 🔍 SEARCH BAR */}
          <div className="px-[clamp(4px,1vw,8px)]">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company or message..."
                className="
                  w-full h-[clamp(44px,8vh,56px)]
                  pl-[clamp(48px,10vw,56px)] pr-[clamp(40px,8vw,48px)]
                  bg-white/95 backdrop-blur-xl
                  rounded-[clamp(12px,2vw,16px)] xs:rounded-[clamp(16px,3vw,20px)]
                  border border-white/80
                  shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)]
                  hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_12px_48px_rgba(0,0,0,0.08)]
                  text-[clamp(14px,3vw,16px)]
                  focus:outline-none
                  focus:ring-3 focus:ring-blue-500/30
                  transition-all duration-300
                "
              />
              <svg
                className="absolute left-[clamp(16px,3vw,20px)] top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="9" cy="9" r="7" />
                <path d="M15 15L19 19" />
              </svg>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                    absolute right-[clamp(16px,3vw,20px)] top-1/2 -translate-y-1/2
                    w-[clamp(28px,5vw,32px)] h-[clamp(28px,5vw,32px)]
                    rounded-full
                    bg-gray-100
                    flex items-center justify-center
                    text-gray-400
                    hover:text-gray-600
                    hover:bg-gray-200
                    transition-colors
                  "
                >
                  <svg 
                    className="w-[clamp(14px,3vw,16px)] h-[clamp(14px,3vw,16px)]" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 💬 CONVERSATIONS LIST */}
      <div className="w-full mt-[clamp(16px,3vh,24px)]">
        {filtered.length === 0 ? (
          <div className="
            text-center py-[clamp(48px,10vh,80px)]
            rounded-[clamp(12px,2vw,16px)]
            bg-gradient-to-br from-gray-50/50 to-white/50
            backdrop-blur-sm
            border border-white/70
            shadow-[0_4px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]
          ">
            <div className="
              w-[clamp(64px,15vw,80px)] h-[clamp(64px,15vw,80px)] 
              mx-auto mb-[clamp(16px,4vh,24px)] 
              rounded-[clamp(12px,2vw,16px)] 
              bg-gradient-to-br from-gray-200 to-gray-100 
              flex items-center justify-center 
              shadow-inner
            ">
              <svg 
                className="w-[clamp(32px,6vw,40px)] h-[clamp(32px,6vw,40px)] text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-[clamp(18px,4vw,24px)] font-semibold text-gray-700 mb-[clamp(8px,2vh,12px)]">
              {search ? "No matches found" : "No conversations yet"}
            </h3>
            <p className="text-gray-500 mx-auto text-[clamp(14px,3vw,16px)] px-[clamp(16px,3vw,24px)] max-w-[512px]">
              {search 
                ? "Try searching with different keywords" 
                : "Start a conversation with a company to see messages here"}
            </p>
          </div>
        ) : (
          <div className="space-y-[clamp(12px,2vh,16px)] px-[clamp(4px,1vw,8px)]">
            {filtered.map((conv) => {
              const company = conv.participants?.find(
                (p) => p.participant_type === "App\\Models\\company"
              )?.participant;

              const unread = conv.unread_count || 0;
              const last = conv.last_message;

              return (
                <div
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className="
                    group cursor-pointer
                    rounded-[clamp(12px,2vw,16px)]
                    bg-gradient-to-br from-white to-gray-50
                    backdrop-blur-xl
                    border border-white/90
                    p-[clamp(12px,2vw,20px)]
                    flex gap-[clamp(12px,2vw,20px)]
                    transition-all duration-300
                    transform
                    hover:scale-[1.02]
                    active:scale-[0.995]
                    relative
                    overflow-hidden
                    before:absolute
                    before:inset-0
                    before:bg-gradient-to-br
                    before:from-white/70
                    before:to-transparent
                    before:opacity-0
                    before:transition-opacity
                    before:duration-300
                    hover:before:opacity-100
                    after:absolute
                    after:inset-0
                    after:rounded-[clamp(12px,2vw,16px)]
                    after:border
                    after:border-white/40
                    after:pointer-events-none
                  "
                  style={{
                    boxShadow: `
                      0 2px 0 rgba(255, 255, 255, 0.9),
                      0 4px 6px -1px rgba(0, 0, 0, 0.05),
                      0 10px 20px -2px rgba(0, 0, 0, 0.04),
                      0 0 0 1px rgba(255, 255, 255, 0.5),
                      inset 0 1px 0 rgba(255, 255, 255, 0.8),
                      inset 0 -2px 10px rgba(0, 0, 0, 0.03)
                    `,
                  }}
                >
                  {/* 3D Avatar Container */}
                  <div className="relative flex-shrink-0">
                    <div 
                      className="
                        w-[clamp(48px,10vw,64px)] h-[clamp(48px,10vw,64px)]
                        rounded-[clamp(8px,1.5vw,12px)]
                        bg-gradient-to-br from-white to-gray-100
                        overflow-hidden
                        relative
                        before:absolute
                        before:inset-0
                        before:rounded-[clamp(8px,1.5vw,12px)]
                        before:border
                        before:border-white/60
                        before:pointer-events-none
                      "
                      style={{
                        boxShadow: `
                          0 4px 12px rgba(0, 0, 0, 0.08),
                          0 2px 4px rgba(0, 0, 0, 0.04),
                          inset 0 1px 0 rgba(255, 255, 255, 0.8),
                          inset 0 -2px 0 rgba(0, 0, 0, 0.05)
                        `
                      }}
                    >
                      <SmartImage
                        image={company?.logo}
                        alt={company?.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Subtle reflection effect */}
                    <div className="
                      absolute top-0 left-0
                      w-full h-1/2
                      bg-gradient-to-b from-white/40 to-transparent
                      rounded-t-[clamp(8px,1.5vw,12px)]
                      pointer-events-none
                    " />
                  </div>

          {/* Content */}
                  <div className="flex-1 min-w-0 pt-1 relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 truncate text-lg">
                        {company?.name_en || company?.name_ar}
                      </h3>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-xs text-gray-500 font-medium px-2 py-1 rounded-full bg-white/80 shadow-sm">
                          {timeAgo(last?.created_at)}
                        </span>
                        {unread > 0 && (
                          <span
                            className="
                              min-w-[24px] h-6 px-2
                              rounded-full
                              text-xs font-bold
                              text-white
                              bg-gradient-to-br from-blue-500 to-blue-600
                              flex items-center justify-center
                              shadow-badge
                              relative
                              before:absolute
                              before:inset-0
                              before:rounded-full
                              before:border
                              before:border-white/30
                              before:pointer-events-none
                            "
                            style={{
                              boxShadow: `
                                0 3px 8px rgba(59, 130, 246, 0.4),
                                0 1px 0 rgba(255, 255, 255, 0.3),
                                inset 0 1px 0 rgba(255, 255, 255, 0.4)
                              `
                            }}
                          >
                            {unread > 99 ? "99+" : unread}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2 pl-2 border-l-2 border-blue-200/50">
                        {last?.body || " "}
                      </p>
                      
                      {/* Subtle text gradient */}
                      <div className="
                        absolute -inset-x-[clamp(8px,1.5vw,12px)] 
                        -inset-y-[clamp(4px,1vw,6px)]
                        bg-gradient-to-r from-transparent via-white/5 to-transparent
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity duration-300
                        rounded-[clamp(8px,1.5vw,12px)]
                        pointer-events-none
                      " />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}