import React from 'react';
import UserListItem from './UserListItem';
import { UserWithRole } from '../../../types/user';

interface UserListProps {
  users: UserWithRole[];
  companies: Array<{ id: string; name: string }>;
  onStatusChange: (userId: string, isActive: boolean) => Promise<void>;
}

export default function UserList({ users, companies, onStatusChange }: UserListProps) {
  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return undefined;
    return companies.find(c => c.id === companyId)?.name;
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            companyName={getCompanyName(user.user_roles[0]?.company_id)}
            onStatusChange={onStatusChange}
          />
        ))}
      </ul>
    </div>
  );
}