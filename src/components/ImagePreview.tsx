import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  url: string;
  onRemove: () => void;
}

export default function ImagePreview({ url, onRemove }: ImagePreviewProps) {
  // Only show the URL if it's not a base64 string
  const showUrl = !url.startsWith('data:');
  
  return (
    <div className="relative">
      <div className="group relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
        <img
          src={url}
          alt="Preview"
          className="w-full h-64 object-contain"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-200" />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}