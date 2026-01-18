import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerConversations } from "../api";

/* ───────── UTILITY FUNCTIONS ───────── */
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const fallbackImage = (e) => {
  e.target.src = "/placeholder.png";
  e.target.onerror = null;
};

/* ───────── MESSAGES COMPONENT ───────── */
export default function Messages() {
  const navigate = useNavigate();
  const scrollPos = useRef(0);
  const fetchTimeout = useRef(null);

  // 🚀 Instant initial state
  const [conversations, setConversations] = useState(() => {
    try {
      const cached = localStorage.getItem("whatsapp_conversations");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // 🚀 Background fetch
  const fetchConversations = useCallback(async () => {
    try {
      const res = await getCustomerConversations();
      const list = res.data?.data || res.data?.conversations || res.data || [];
      const safeList = Array.isArray(list) ? list : [];

      setConversations(safeList);
      
      try {
        localStorage.setItem("whatsapp_conversations", JSON.stringify(safeList));
      } catch (e) {
        // Ignore storage errors
      }
    } catch (err) {
      console.error("Failed to refresh conversations", err);
    }
  }, []);

  // 🚀 Initial load + sync
  useEffect(() => {
    window.scrollTo(0, scrollPos.current);
    fetchConversations();

    const onFocus = () => {
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
      fetchTimeout.current = setTimeout(fetchConversations, 150);
    };

    window.addEventListener("focus", onFocus);
    const syncInterval = setInterval(fetchConversations, 30000);

    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(syncInterval);
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
    };
  }, [fetchConversations]);

  // 🚀 Optimistic navigation
  const openConversation = (conv) => {
    scrollPos.current = window.scrollY;

    if (conv.unread_count > 0) {
      setConversations(prev => {
        const updated = prev.map(c => 
          c.id === conv.id ? { ...c, unread_count: 0 } : c
        );
        localStorage.setItem("whatsapp_conversations", JSON.stringify(updated));
        return updated;
      });
    }

    navigate(`/customer-login/chat/${conv.id}`, {
      state: { 
        conversation: conv,
        messages: conv.messages || [],
        cachedAt: Date.now()
      }
    });
  };

  // 🚀 Render
  return (
    <div className="min-h-full
 w-full p-4 sm:p-6">
      
      <div className="w-full ">
        {/* Premium Header - Centered and spread */}
        <div className="mb-8 mt-10">
          <div className="flex justify-center items-center mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Messages
          </h1>
          
          </div>

          
      
        </div>

        {/* Conversations List - Premium Layout */}
        <div>
          {conversations.length === 0 ? (
            // Premium Empty State
            <div className="flex flex-col items-center justify-center h-[50vh] rounded-3xl  p-8">
              <div className="w-24 h-24 mb-6 rounded-3xl  flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
               
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
              
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => {
                const company = conv.participants?.find(
                  p => p.participant_type === "App\\Models\\company"
                )?.participant;

                const unread = conv.unread_count || 0;
                const lastMsg = conv.last_message;
                const isOnline = conv.is_online;
                const companyName = company?.name_en || company?.name_ar ;

                return (
                  <div
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className="
                      group relative
                      bg-white/60 hover:bg-white/90
                      border border-white/40 hover:border-white/60
                      rounded-2xl
                      p-4
                      flex items-center gap-4
                      cursor-pointer
                      backdrop-blur-sm
                      transition-all duration-300
                      active:scale-[0.995] active:duration-150
                      shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                      hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                      overflow-hidden
                    "
                  >
                    {/* Premium Avatar Container */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                        <img
                          src={company?.logo ? `https://catalogueyanew.com.awu.zxu.temporary.site/${company.logo}` : "/placeholder.png"}
                          alt={companyName}
                          loading="lazy"
                          className="w-full h-full object-cover "
                          onError={fallbackImage}
                        />
                      </div>
                      
                     
                    
                    </div>

                    {/* Content Container - Full Width */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                            {companyName}
                          </h3>
                        
                        </div>
                        
                        {/* Time & Badge Container */}
                        <div className="flex flex-col items-end gap-2">
                          {lastMsg?.created_at && (
                            <span className="text-xs text-gray-400/90 whitespace-nowrap">
                              {timeAgo(lastMsg.created_at)}
                            </span>
                          )}
                          
                          {unread > 0 && (
                            <div className="
                              bg-gradient-to-r from-blue-500 to-blue-600
                              text-white text-xs font-semibold
                              min-w-[24px] h-6
                              px-2
                              rounded-full
                              flex items-center justify-center
                              shadow-[0_4px_12px_rgba(59,130,246,0.3)]
                              animate-[fadeIn_0.3s_ease-out]
                            ">
                              {unread > 99 ? "99+" : unread}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Last Message Preview with Icon */}
                      <div className="flex items-start gap-2">
                        
                        <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                          {lastMsg?.body }
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Premium Bottom Gradient */}
        
      </div>

      {/* Premium Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { 
            opacity: 0; 
            transform: translateY(10px) scale(0.95); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
      
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
        
        /* Mobile Optimizations */
        @media (max-width: 640px) {
          .message-item {
            -webkit-tap-highlight-color: transparent;
          }
          
          .message-item:active {
            transform: scale(0.99);
          }
        }
        
        /* Image Loading */
        img {
          content-visibility: auto;
          will-change: transform;
        }
        
        /* Smooth Interactions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}