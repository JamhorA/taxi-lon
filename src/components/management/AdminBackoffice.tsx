import React, { useState } from 'react';
import { FileText, Car, User } from 'lucide-react';
import CarsAndDriversView from './CarsAndDriversView';
import ShiftsView from './ShiftsView';

export default function AdminBackoffice() {
  const [activeTab, setActiveTab] = useState<'shifts' | 'cars-drivers'>('shifts');

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('shifts')}
            className={`${
              activeTab === 'shifts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <FileText className="w-5 h-5 mr-2" />
            Skift
          </button>
          <button
            onClick={() => setActiveTab('cars-drivers')}
            className={`${
              activeTab === 'cars-drivers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <div className="flex items-center">
              <Car className="w-5 h-5" />
              <span className="mx-1">/</span>
              <User className="w-5 h-5" />
            </div>
            <span className="ml-2">Bilar & Förare</span>
          </button>
        </nav>
      </div>

      {activeTab === 'shifts' ? (
        <ShiftsView />
      ) : (
        <CarsAndDriversView />
      )}
    </div>
  );
}