import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function PrintButton({ onClick, disabled }: PrintButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Printer className="w-4 h-4 mr-2" />
      Skriv ut Löneunderlag
    </button>
  );
}