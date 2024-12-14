import React from 'react';
import { Settings } from 'lucide-react';
import ManagementPanel from '../components/management/ManagementPanel';
import { useUserRole } from '../hooks/useUserRole';
import { Navigate } from '../components/navigation/Navigate';

export default function AdminView() {
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Settings className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="mt-2 text-gray-600">
          Hantera företag, bilar och förare
        </p>
      </div>

      <ManagementPanel />
    </div>
  );
}