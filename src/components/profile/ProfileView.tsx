import React, { useState } from 'react';
import { User, Settings, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import EmailChangeForm from './EmailChangeForm';
import PasswordChangeForm from './PasswordChangeForm';

export default function ProfileView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Settings className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Profilinställningar</h1>
        <p className="mt-2 text-gray-600">
          Hantera din profil och säkerhetsinställningar
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{user?.email}</h2>
              <p className="text-sm text-gray-500">
                Medlem sedan {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('email')}
              className={`${
                activeTab === 'email'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Ändra E-post
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center justify-center`}
            >
              <Lock className="w-4 h-4 mr-2" />
              Ändra Lösenord
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'email' ? <EmailChangeForm /> : <PasswordChangeForm />}
        </div>
      </div>
    </div>
  );
}