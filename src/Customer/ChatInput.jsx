import React from "react";

const ChatInput = React.memo(
  ({
    input,
    files,
    onTyping,
    onSend,
    onFileChange,
    removeFile,
  }) => {
    const fileInputRef = React.useRef(null);

    // Handle Enter key press
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() || files.length > 0) {
          onSend();
        }
      }
    };

    // Trigger file input
    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    return (
      <>
        {/* ATTACHMENTS PREVIEW */}
        {files.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative w-20 h-20 rounded-xl border border-gray-200 bg-white shadow-sm flex-shrink-0"
                >
                  {/* IMAGE PREVIEW */}
                  {file.type.startsWith("image") && (
                    <div className="w-full h-full">
                      <img
                        src={file.localUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentNode.querySelector('.file-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="file-fallback hidden absolute inset-0 bg-gray-100 rounded-xl items-center justify-center">
                        <span className="text-gray-400 text-sm">📷</span>
                      </div>
                    </div>
                  )}

                  {/* VIDEO PREVIEW */}
                  {file.type.startsWith("video") && (
                    <div className="relative w-full h-full">
                      <video
                        src={file.localUrl}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTHER FILES PREVIEW */}
                  {!file.type.startsWith("image") && !file.type.startsWith("video") && (
                    <div className="w-full h-full bg-gray-50 rounded-xl flex flex-col items-center justify-center p-2">
                      <div className="text-xl mb-1">
                        {file.type.includes("pdf") ? "📄" : 
                         file.type.includes("word") || file.type.includes("document") ? "📝" : 
                         "📎"}
                      </div>
                      <div className="text-xs text-gray-600 text-center truncate w-full">
                        {file.file.name.length > 10 
                          ? `${file.file.name.substring(0, 8)}...`
                          : file.file.name}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {(file.file.size / 1024).toFixed(0)}KB
                      </div>
                    </div>
                  )}

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                    aria-label="Remove file"
                    type="button"
                  >
                    ✕
                  </button>

                  {/* FILE TYPE BADGE */}
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {file.type.split('/')[1]?.substring(0, 3) || 'file'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INPUT AREA */}
        <div className=" p-4 bg-gradient-to-t from-white/80 via-white/40 to-transparent">
          <div className="glass-input rounded-2xl shadow-elevated px-4 py-2.5 flex items-center gap-2.5 backdrop-blur-xl border border-white/50">
            {/* ATTACH BUTTON */}
            <button
              onClick={triggerFileInput}
              className="p-3 rounded-xl cursor-pointer transition-all duration-300 
                       hover:bg-blue-500/10 active:bg-blue-500/20 
                       glass-border hover:shadow-sm group"
              aria-label="Attach files"
              type="button"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(59 130 246)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={onFileChange}
                accept="image/*,video/*,application/pdf"
              />
            </button>

            {/* MESSAGE INPUT */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={onTyping}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="w-full px-4 py-3.5 bg-transparent outline-none 
                         placeholder-gray-400/60 text-gray-800 text-[15px]
                         font-light tracking-wide min-w-0 focus:ring-0"
              />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent" />
            </div>

            {/* SEND BUTTON - NO LOADER */}
            <button
              onClick={onSend}
              disabled={!input.trim() && files.length === 0}
              className={`p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center group ${
                (input.trim() || files.length > 0)
                  ? "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:scale-105 active:scale-95"
                  : "bg-gray-200/50 text-gray-400/50 cursor-not-allowed"
              }`}
              aria-label="Send message"
              type="button"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* MINIMAL CSS */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  }
);

export default ChatInput;