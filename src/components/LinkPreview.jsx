import React, { useState, useEffect } from 'react';

const LinkPreview = ({ url, isMe }) => {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!url) return;

        const fetchMetadata = async () => {
            try {
                // Using a public, free link metadata API for demonstration. 
                // In production, this should be handled by your backend to avoid CORS and API limits.
                const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
                const data = await response.json();

                if (data.status === 'success') {
                    setMetadata(data.data);
                }
            } catch (error) {
                console.error('Error fetching link metadata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, [url]);

    if (loading) return null;
    if (!metadata || (!metadata.image && !metadata.title)) return null;

    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`block mt-2 rounded-xl border overflow-hidden transition-all hover:opacity-90 active:scale-[0.98] ${
                isMe 
                ? 'bg-blue-600/20 border-blue-400/30' 
                : 'bg-gray-50 border-gray-200'
            }`}
        >
            {metadata.image && (
                <div className="aspect-video w-full overflow-hidden border-b border-inherit">
                    <img 
                        src={metadata.image.url} 
                        alt={metadata.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-3 space-y-1">
                {metadata.title && (
                    <h4 className={`text-xs font-bold line-clamp-1 ${isMe ? 'text-blue-900' : 'text-gray-900'}`}>
                        {metadata.title}
                    </h4>
                )}
                {metadata.description && (
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                        {metadata.description}
                    </p>
                )}
                <div className="text-[9px] text-blue-500 font-medium truncate pt-1 uppercase tracking-wider">
                    {new URL(url).hostname}
                </div>
            </div>
        </a>
    );
};

export default LinkPreview;
