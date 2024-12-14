import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { updateUserStatus } from '../../../services/user/userService';
import toast from 'react-hot-toast';

interface UserStatusToggleProps {
  isActive: boolean;
  userId: string;
  onChange: (isActive: boolean) => void;
}

export default function UserStatusToggle({ isActive, userId, onChange }: UserStatusToggleProps) {
  const [updating, setUpdating] = useState(false);

  const handleClick = async () => {
    if (updating) return;

    setUpdating(true);
    try {
      await updateUserStatus(userId, !isActive);
      onChange(!isActive);
      toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={updating}
      className={`inline-flex items-center p-2 border border-transparent rounded-full
        ${updating ? 'bg-gray-100 cursor-not-allowed' : 
          isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      title={updating ? 'Processing...' : isActive ? 'Deactivate user' : 'Activate user'}
    >
      {updating ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      ) : isActive ? (
        <X className="h-5 w-5" />
      ) : (
        <Check className="h-5 w-5" />
      )}
    </button>
  );
}