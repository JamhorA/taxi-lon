import React from 'react';

interface UserStatusBadgeProps {
  isActive: boolean;
}

export default function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'}`}
    >
      {isActive ? 'Aktiv' : 'Inaktiv'}
    </span>
  );
}