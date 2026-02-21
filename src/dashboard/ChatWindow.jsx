// src/dashboard/ChatWindow.jsx
import { useEffect, useRef, useState  } from "react";
import { Send, Paperclip, Check, CheckCheck } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";
import LinkPreview from "../components/LinkPreview";

const extractUrl = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text?.match(urlRegex);
  return match ? match[0] : null;
};

export default function ChatWindow({
  selectedChat,
  messages,
  loadingChat,
  messageBody,
  setMessageBody,
  attachments,
  setAttachments,
  handleSendMessage,
  handleAddContact,
  getAvatar,
  getName,
  getCurrentCompanyId,
  formatTime,
  onBack 
}) {
  const messagesEndRef = useRef(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Send className="text-gray-300 ml-1" size={32} />
        </div>
        <p>Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/70 bg-white flex items-center gap-3 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        {/* Mobile Back Button */}


       <button
              onClick={onBack}
              aria-label="Back"
              className=" md:hidden p-2 rounded-xl hover:bg-white/40 active:bg-white/60 
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
        {getAvatar(selectedChat) ? (
          <img
            src={getAvatar(selectedChat)}
            className="w-10 h-10 rounded-full object-cover"
            alt={getName(selectedChat)}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 font-medium text-base ring-1 ring-gray-200/50">
            {getName(selectedChat).charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="font-medium text-gray-900 text-[16px] leading-tight tracking-[-0.01em]">
            {getName(selectedChat)}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                selectedChat.other_participant_status === "online"
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
            <span
              className={`text-[11px] font-medium ${
                selectedChat.other_participant_status === "online"
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {selectedChat.other_participant_status === "online"
                ? "Online"
                : "Offline"}
            </span>
          </div>
        </div>

        {/* Add Contact Button */}
        <div className="ml-auto">
          <button
            onClick={handleAddContact}
            className="flex items-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all text-xs sm:text-sm shadow whitespace-nowrap"
          >
            <FaUserPlus size={14} />
            <span className="inline ml-1">Add</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {loadingChat ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            Loading messages...
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            No messages yet
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe =
              msg.sender_type === "App\\Models\\company" ||
              msg.sender_type === "company" ||
              msg.sender_id === getCurrentCompanyId();

            return (
              <div
                key={msg.id || i}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl break-all ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow rounded-bl-none"
                  }`}
                >
                  {msg.body && (
                    <>
                      <p className="whitespace-pre-wrap text-sm">
                        {msg.body}
                      </p>
                      {extractUrl(msg.body) && (
                        <LinkPreview
                          url={extractUrl(msg.body)}
                          isMe={isMe}
                        />
                      )}
                    </>
                  )}

                  {msg.attachments &&
                    msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.path || att.url || att}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block text-xs underline ${
                              isMe
                                ? "text-blue-100"
                                : "text-blue-500"
                            }`}
                          >
                            {att.name ||
                              `Attachment ${idx + 1}`}
                          </a>
                        ))}
                      </div>
                    )}

                  <div className="text-[10px] mt-1 flex items-center justify-end gap-1 tracking-tighter">
                    {formatTime(msg.created_at)}
                    {isMe && (
                      <span className="text-blue-200">
                        {msg.read_at ? (
                          <CheckCheck size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-100 flex gap-2 items-end"
      >
        <label className="p-2 text-gray-400 hover:text-blue-500 cursor-pointer">
          <Paperclip size={20} />
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) =>
              setAttachments([...e.target.files])
            }
          />
        </label>

        <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2 flex flex-col">
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
              {attachments.map((f, i) => (
                <div
                  key={i}
                  className="bg-white px-2 py-0.5 rounded text-xs flex items-center gap-1 border"
                >
                  <span className="truncate max-w-[100px]">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() =>
                      setAttachments(
                        attachments.filter(
                          (_, idx) => idx !== i
                        )
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            value={messageBody}
            onChange={(e) =>
              setMessageBody(e.target.value)
            }
            placeholder="Type a message..."
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm resize-none max-h-32"
            rows="1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={
            !messageBody.trim() &&
            attachments.length === 0
          }
          className="p-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}