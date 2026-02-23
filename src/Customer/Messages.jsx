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
  <div className="min-h-screen w-full px-4 sm:px-6 lg:px-8 mt-20 md:mt-16 bg-white">
    {/* 🏆 HEADER SECTION */}
    <div className="sticky top-0 z-40 pt-4 pb-3 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
      <div className=" w-full">
        {/* Title */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              Messages
            </h1>
            <span className="text-sm font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          
        
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="px-1">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="
                w-full h-12
                pl-11 pr-10
                bg-gray-50
                border-0
                rounded-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-[15px] placeholder:text-gray-400
                transition-all duration-200
              "
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M14 14L17 17" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  w-6 h-6
                  rounded-full
                  bg-gray-200
                  flex items-center justify-center
                  text-gray-500
                  hover:bg-gray-300
                  transition-colors
                "
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* 💬 CONVERSATIONS LIST */}
    <div className=" w-full py-2">
      {filtered.length === 0 ? (
        <div className="text-center py-20 px-4">
          <div className="
            w-16 h-16 
            mx-auto mb-4 
            rounded-full 
            bg-gray-50 
            flex items-center justify-center 
            border border-gray-100
          ">
            <svg 
              className="w-7 h-7 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {search ? "No Results" : "No Messages"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            {search 
              ? "No conversations match your search" 
              : "Start a conversation to connect with companies"}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
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
                className={`
                  group cursor-pointer
                  py-3 px-1
                  flex gap-3
                  transition-colors duration-200
                  ${unread > 0 ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}
                `}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="
                    w-12 h-12 
                    rounded-full 
                    bg-gray-100 
                    flex items-center justify-center 
                    overflow-hidden
                    border border-gray-200
                  ">
                    <SmartImage
                      image={company?.logo}
                      alt={company?.name_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                 
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`
                      font-semibold truncate pr-2
                      ${unread > 0 ? 'text-gray-900' : 'text-gray-700'}
                    `}>
                      {company?.name_en || company?.name_ar}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {timeAgo(last?.created_at)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className={`
                      text-sm 
                      line-clamp-1 
                      pr-2
                      ${unread > 0 
                        ? 'text-gray-900 font-medium' 
                        : 'text-gray-500'
                      }
                    `}>
                      {last?.body || "Start a conversation..."}
                    </p>
                    
                    {unread > 0 && (
                      <span className="
                        w-5 h-5
                        rounded-full
                        text-xs font-semibold
                        text-white
                        bg-blue-500
                        flex items-center justify-center
                        flex-shrink-0
                      ">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
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