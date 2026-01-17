import React from "react";

/* ───────────────── STATUS ICON ───────────────── */
const StatusIcon = React.memo(({ type }) => {
  const base = "text-[10px] tracking-tight";

  if (type === "failed") return <span className={`${base} text-red-400`}>!</span>;
  if (type === "pending") return <span className={`${base} text-gray-300`}>●</span>;
  if (type === "read") return <span className={`${base} text-blue-500`}>✔✔</span>;
  return <span className={`${base} text-gray-400`}>✔</span>;
});

/* ───────────────── MESSAGE BUBBLE ───────────────── */
const MessageBubble = React.memo(({ msg, isMe, formatTime }) => {
  const time = formatTime
    ? formatTime(msg.created_at)
    : new Date(msg.created_at).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

  const status =
    msg.failed ? "failed" : msg.pending ? "pending" : msg.read_at ? "read" : "sent";

  return (
    <div
      className={`
        flex px-2 py-[2px]
        ${isMe ? "justify-end" : "justify-start"}
        overflow-x-hidden
      `}
    >
      <div
        className={`
          w-fit
          max-w-[min(72%,calc(100vw-32px))]
          px-3.5 py-2.5
          rounded-2xl
          text-[14px] leading-snug
          backdrop-blur-xl
          break-words
          overflow-hidden
          ${
            isMe
              ? "bg-blue-500 text-white rounded-br-md shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
              : "bg-white/90 text-gray-900 rounded-bl-md shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
          }
        `}
      >
        {/* TEXT */}
        {msg.body && (
          <div className="whitespace-pre-wrap break-words">
            {msg.body}
          </div>
        )}

        {/* ATTACHMENTS */}
        {msg.attachments?.length > 0 && (
          <div className="mt-2 space-y-2 max-w-full overflow-hidden">
            {msg.attachments.map((att) => {
              const src = att.path || att.localUrl;
              if (!src) return null;

              /* IMAGE — WhatsApp size */
              if (att.type?.startsWith("image")) {
                return (
                  <img
                    key={att.id}
                    src={src}
                    loading="lazy"
                    alt=""
                    className="
                      max-w-[180px]
                      max-h-[240px]
                      w-auto h-auto
                      rounded-xl
                      object-cover
                      shadow-sm
                    "
                  />
                );
              }

              /* VIDEO — WhatsApp size */
              if (att.type?.startsWith("video")) {
                return (
                  <video
                    key={att.id}
                    controls
                    preload="metadata"
                    className="
                      max-w-[180px]
                      max-h-[240px]
                      rounded-xl
                      shadow-sm
                    "
                  >
                    <source src={src} />
                  </video>
                );
              }

              /* FILE */
              return (
                <a
                  key={att.id}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    block max-w-full truncate
                    text-xs text-blue-600 underline
                  "
                >
                  {att.name}
                </a>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <div
          className={`
            mt-1 flex items-center justify-end gap-1
            text-[10px]
            ${isMe ? "text-white/70" : "text-gray-400"}
          `}
        >
          <span>{time}</span>
          {isMe && <StatusIcon type={status} />}
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = "MessageBubble";
export default MessageBubble;
