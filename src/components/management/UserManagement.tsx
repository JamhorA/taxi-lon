import React from 'react';
import { UserCircle, RefreshCw } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import UserList from './users/UserList';

interface UserManagementProps {
  companies: Array<{ id: string; name: string; org_nr: string }>;
}

export default function UserManagement({ companies }: UserManagementProps) {
  const { users, loading, error, updateUserStatus, fetchUsers } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <UserCircle className="w-6 h-6 mr-2" />
          Användarhantering
        </h2>
        <button
          onClick={fetchUsers}
          className="p-2 text-gray-500 hover:text-gray-700"
          title="Uppdatera"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Användare</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Hantera användare och deras behörigheter
          </p>
        </div>

        <UserList 
          users={users}
          companies={companies}
          onStatusChange={updateUserStatus}
        />
      </div>
    </div>
  );
}