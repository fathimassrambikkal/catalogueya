import React, { useEffect, useRef, useState, useCallback } from "react";
import Pusher from "pusher-js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { log, warn, error as logError } from "../utils/logger";

import {
  getCustomerConversation,
  sendCustomerMessage,
  sendCustomerTyping,
  markCustomerConversationRead,
} from "../api";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

if (import.meta.env.DEV) {
  Pusher.logToConsole = true;
}



const API_BASE = "https://catalogueyanew.com.awu.zxu.temporary.site";

export default function Chat() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [conversation, setConversation] = useState(
    location.state?.conversation || null
  );
  const [messages, setMessages] = useState(location.state?.messages || []);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);

  const typingTimeoutRef = useRef(null);

  const currentUserRaw = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  let currentUser = null;
  try {
    currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
  } catch (e) {
  logError("Chat: failed to parse currentUser from localStorage", e);
}

  const currentUserId = currentUser?.id;

  // ✅ IMPORTANT: dynamic type support (User / Company / Customer...)
  const currentUserType = (currentUser?.type || "User").toLowerCase();

  // ✅ Private channel name (must match Laravel PrivateChannel)
  const channelName = currentUserId
    ? `private-${currentUserType}.${currentUserId}`
    : null;

  // 🔹 BACKGROUND FETCH ONLY - NO UI INDICATOR
  useEffect(() => {
    if (!conversationId) return;

    // Silent background fetch without loading state
    getCustomerConversation(conversationId)
      .then((res) => {
        setConversation(prev => {
  if (!prev) return res.data.conversation;

  return {
    ...res.data.conversation,
    participants:
      res.data.conversation?.participants?.length
        ? res.data.conversation.participants
        : prev.participants, // 🔒 preserve logo
  };
});

        setMessages(res.data.messages || []);
        markCustomerConversationRead(conversationId);
      })
      .catch((err) => {
  logError("Chat: conversation sync failed", err);
});

  }, [conversationId]);

  // 🔥 PUSHER DIAGNOSTIC VERSION - OPTIMIZED
  useEffect(() => {
    if (!currentUserId || !token || !channelName) {
      warn("Chat: Pusher setup skipped – missing auth data");
      return;
    }

    log("Chat: Pusher initialized", {
  userId: currentUserId,
  channelName,
  conversationId,
});


    const pusher = new Pusher("a613271cbafcf4059d6b", {
      cluster: "ap2",
      authEndpoint: `${API_BASE}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
      enabledTransports: ["ws", "wss"],
      forceTLS: true,
    });

    const channel = pusher.subscribe(channelName);

    // 🔥 Optimized event handler with early filtering
    const handleGlobalEvent = (event, data) => {
      // Fast check for relevant message events
      if (!data?.message) return;
      
      const incomingConvId = data?.conversation_id;
      
      // Early return if conversation doesn't match
      if (Number(incomingConvId) !== Number(conversationId)) return;

      const msg = data.message;
      
      setMessages((prev) => {
        // Fast duplicate check using Set for O(1) lookup
        const existingIds = new Set(prev.map(m => m.id));
        if (existingIds.has(msg.id)) return prev;
        
        // Use functional update for better performance
        const newMessages = [...prev, msg];
        
        // Auto-scroll handled by MessageList component
        return newMessages;
      });
    };

    channel.bind_global(handleGlobalEvent);

    return () => {
      // Cleanup with defensive try-catch
      try {
        channel.unbind_global(handleGlobalEvent);
        pusher.unsubscribe(channelName);
        pusher.disconnect();
      } catch (err) {
  warn("Chat: Pusher cleanup error", err);
}
    };
  }, [currentUserId, channelName, token, conversationId]);

  // 🔹 REMOVE FILE FUNCTION
  const removeFile = useCallback((id) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.localUrl) URL.revokeObjectURL(file.localUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // 🔹 FILE CHANGE FUNCTION
  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const previews = selectedFiles.map((file) => ({
      id: `local-${crypto.randomUUID()}`,
      file,
      localUrl: URL.createObjectURL(file),
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...previews]);
  }, []);

  // 🔹 SEND MESSAGE - INSTANT OPTIMISTIC UPDATE
  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic = {
      id: tempId,
      sender_id: currentUserId,
      body: input,
      attachments: files.map((f) => ({
        id: f.id,
        localUrl: f.localUrl,
        type: f.type,
      })),
      created_at: new Date().toISOString(),
      pending: true,
      delivered_at: null,
      read_at: null,
    };

    // Optimistic update
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setFiles([]);

    const formData = new FormData();
    if (input.trim()) formData.append("body", input);
    files.forEach((f) => formData.append("attachments[]", f.file));

    try {
      const res = await sendCustomerMessage(conversationId, formData);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...res.data.message, delivered_at: new Date().toISOString() }
            : msg
        )
      );
    } catch (err) {
      logError("Chat: send message failed", err);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, pending: false, failed: true } : msg
        )
      );
    }
  };

  // 🔹 TYPING
  const handleTyping = useCallback(
    (e) => {
      setInput(e.target.value);
      sendCustomerTyping(conversationId, true);

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendCustomerTyping(conversationId, false);
      }, 800);
    },
    [conversationId]
  );

  // 🔹 RENDER ATTACHMENT
  const renderAttachment = useCallback((att) => {
    const src = att.path || att.localUrl;
    if (!src) return null;

    if (att.type?.startsWith("image")) {
      return (
        <div className="relative group">
          <img
            src={src}
            alt="Attachment"
            className="max-w-xs rounded-xl border border-white/20 shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );
    }

    if (att.type?.startsWith("video")) {
      return (
        <div className="relative group">
          <video controls className="max-w-xs rounded-xl border border-white/20 shadow-lg">
            <source src={src} />
          </video>
        </div>
      );
    }

    return (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 hover:bg-white transition-colors duration-200"
      >
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm2 18H6V4h7v5h5v11z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Download file</span>
      </a>
    );
  }, []);

  const formatTime = useCallback(
    (d) =>
      new Date(d).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    []
  );

  return (
    <div className="flex flex-col  h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      <ChatHeader
        conversation={conversation}
        navigate={navigate}
        API_BASE={API_BASE}
        onBack={() => navigate(-1)}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        renderAttachment={renderAttachment}
        formatTime={formatTime}
      />

      <ChatInput
        input={input}
        files={files}
        onTyping={handleTyping}
        onSend={handleSend}
        onFileChange={handleFileChange}
        removeFile={removeFile}
      />
    </div>
  );
}