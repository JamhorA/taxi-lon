import React from 'react';
import { Calculator, TrendingUp, Route, DollarSign } from 'lucide-react';

interface ShiftSummaryProps {
  totalIncome: number;
  totalTrips: number;
  totalTaxiKm: number;
  totalPaidKm: number;
  totalSalaryBase: number;
}

export default function ShiftsSummary({ 
  totalIncome, 
  totalTrips, 
  totalTaxiKm, 
  totalPaidKm,
  totalSalaryBase 
}: ShiftSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('sv-SE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Kredit</p>
            <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Antal Turer</p>
            <p className="text-xl font-semibold text-gray-900">{totalTrips}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <Route className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Kilometer</p>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(totalTaxiKm)} km <span className="text-sm text-gray-500">total</span>
              </p>
              <p className="text-sm text-gray-500">
                {formatNumber(totalPaidKm)} km <span className="text-xs">betalda</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Lönegrund</p>
            <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalSalaryBase)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}