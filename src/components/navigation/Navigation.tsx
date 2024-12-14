import React from 'react';
import { FileText, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserRole } from '../../hooks/useUserRole';

interface NavigationProps {
  activeView: 'receipts' | 'admin' | 'profile';
  onViewChange: (view: 'receipts' | 'admin' | 'profile') => void;
}

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  const { signOut } = useAuth();
  const { isAdmin } = useUserRole();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <button
                onClick={() => onViewChange('receipts')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeView === 'receipts'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Kvittohantering
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => onViewChange('admin')}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    activeView === 'admin'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Administration
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('profile')}
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                activeView === 'profile'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Profil
            </button>

            <button
              onClick={() => signOut()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logga ut
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}