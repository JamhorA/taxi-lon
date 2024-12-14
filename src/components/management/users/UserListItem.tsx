import React from 'react';
import { User } from 'lucide-react';
import UserStatusBadge from './UserStatusBadge';
import UserStatusToggle from './UserStatusToggle';
import { UserWithRole } from '../../../types/user';
import { format } from 'date-fns';

interface UserListItemProps {
  user: UserWithRole;
  companyName?: string;
  onStatusChange: (userId: string, isActive: boolean) => Promise<void>;
}

export default function UserListItem({ user, companyName, onStatusChange }: UserListItemProps) {
  const userRole = user.user_roles[0];
  const createdAt = new Date(user.created_at);
  
  const handleStatusChange = async (isActive: boolean) => {
    await onStatusChange(user.id, isActive);
  };

  return (
    <li className="hover:bg-gray-50 transition-colors duration-150">
      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </h3>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {userRole?.role || 'user'}
                </span>
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                {companyName && (
                  <span className="truncate">
                    {companyName}
                  </span>
                )}
                <span className="mx-2">•</span>
                <span>
                  Created {format(createdAt, 'yyyy-MM-dd')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserStatusBadge isActive={userRole?.is_active ?? false} />
            <UserStatusToggle 
              isActive={userRole?.is_active ?? false}
              userId={user.id}
              onChange={handleStatusChange}
            />
          </div>
        </div>
      </div>
    </li>
  );
}