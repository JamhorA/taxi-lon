import React, { useState } from 'react';
import { Link } from 'lucide-react';
import toast from 'react-hot-toast';

interface UrlInputProps {
  onSubmit: (url: string) => void;
}

export default function UrlInput({ onSubmit }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Vänligen ange en URL');
      return;
    }

    try {
      new URL(url); // Validate URL format
      onSubmit(url);
    } catch {
      toast.error('Ogiltig URL format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="w-full p-8 border-2 border-gray-300 rounded-xl bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-blue-50 rounded-full">
            <Link className="w-8 h-8 text-blue-500" />
          </div>
          <div className="w-full max-w-xl">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Bildadress (URL)
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exempel.com/bild.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="btn"
          >
            Extrahera Text
          </button>
        </div>
      </div>
    </form>
  );
}