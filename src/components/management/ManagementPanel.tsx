import React, { useState, useEffect } from 'react';
import { useUserRole } from '../../hooks/useUserRole';
import { Navigate } from '../navigation/Navigate';
import CompanyForm from '../company/CompanyForm';
import CarForm from '../car/CarForm';
import DriverForm from '../driver/DriverForm';
import AdminBackoffice from './AdminBackoffice';
import UserManagement from './UserManagement';
import { useCompany } from '../../hooks/useCompany';
import { Database } from '../../types/supabase';
import { Users } from 'lucide-react';

type Company = Database['public']['Tables']['Companies']['Row'];

export default function ManagementPanel() {
  const { isAdmin, loading } = useUserRole();
  const [activeTab, setActiveTab] = useState<'company' | 'car' | 'driver' | 'admin' | 'users'>('company');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { companies, fetchCompanies } = useCompany();

  useEffect(() => {
    fetchCompanies();
  }, []);

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

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab('car');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('company')}
            className={`${
              activeTab === 'company'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Företag
          </button>
          <button
            onClick={() => setActiveTab('car')}
            disabled={!selectedCompany}
            className={`${
              activeTab === 'car'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Bilar
          </button>
          <button
            onClick={() => setActiveTab('driver')}
            disabled={!selectedCompany}
            className={`${
              activeTab === 'driver'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Förare
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`${
              activeTab === 'admin'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Administration
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Users className="w-4 h-4 mr-2" />
            Användare
          </button>
        </nav>
      </div>

      {selectedCompany && activeTab !== 'admin' && activeTab !== 'users' && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Valt företag</h3>
          <p className="mt-1 text-sm text-blue-600">
            {selectedCompany.name} (Org.nr: {selectedCompany.org_nr})
          </p>
        </div>
      )}

      {activeTab === 'company' && (
        <div className="mt-6">
          <CompanyForm onCompanySelect={handleCompanySelect} />
        </div>
      )}

      {activeTab === 'car' && selectedCompany && (
        <div className="mt-6">
          <CarForm companyId={selectedCompany.id} />
        </div>
      )}

      {activeTab === 'driver' && selectedCompany && (
        <div className="mt-6">
          <DriverForm companyId={selectedCompany.id} />
        </div>
      )}

      {activeTab === 'admin' && (
        <div className="mt-6">
          <AdminBackoffice />
        </div>
      )}

      {activeTab === 'users' && (
        <div className="mt-6">
          <UserManagement companies={companies} />
        </div>
      )}

      {(activeTab === 'car' || activeTab === 'driver') && !selectedCompany && (
        <div className="text-center py-6 text-gray-500">
          Välj först ett företag för att hantera bilar och förare
        </div>
      )}
    </div>
  );
}