import React from "react";
import { Virtuoso } from "react-virtuoso";
import MessageBubble from "./MessageBubble";

const MessageList = React.memo(
  ({ messages, currentUserId, formatTime }) => {
    return (
      <div className="flex-1 min-h-0 overflow-hidden ">
        <Virtuoso style={{ height: "100%" }}
          data={messages}
          followOutput="auto"
          initialTopMostItemIndex={messages.length - 1}
          overscan={120}                    // 🔹 tighter, predictable
          increaseViewportBy={{ top: 64, bottom: 64 }}
          itemContent={(index, msg) => (
            <MessageBubble
              key={msg.id || index}         // 🔹 stable identity
              msg={msg}
              isMe={msg.sender_id === currentUserId}
              formatTime={formatTime}
            />
          )}
          className="scrollbar-thin"
        />
      </div>
    );
  }
);

MessageList.displayName = "MessageList";
export default MessageList;
