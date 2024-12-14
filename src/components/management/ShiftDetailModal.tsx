import React from 'react';
import { X, Clock, Car, User, FileText, Route, Calculator } from 'lucide-react';
import { formatDateTime } from '../../utils/dateTime';

interface ShiftDetailModalProps {
  shift: {
    id: string;
    start_time: string;
    end_time: string;
    car: {
      regnr: string;
      drosknr: string;
    };
    driver: {
      name: string;
      forarid: string;
    };
    report_nr: string;
    taxi_km: number;
    paid_km: number;
    trips: number;
    cash: number;
    to_report: number;
    total_credit: number;
    drikskredit: number;
    lonegr_ex_moms: number;
    total_inkort_details?: Array<{
      total_inkort: number;
      moms_percentage: number;
      brutto: number;
      netto: number;
      moms_kr: number;
    }>;
    vat_details?: Array<{
      vat_rate: number;
      gross_income: number;
      net_income: number;
      vat_amount: number;
      type: 'kontant' | 'kredit';
    }>;
    bom_details?: Array<{
      moms_percentage: number;
      brutto: number;
      netto: number;
      moms_kr: number;
    }>;
  };
  onClose: () => void;
}

export default function ShiftDetailModal({ shift, onClose }: ShiftDetailModalProps) {
  if (!shift) return null;

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '0,00 kr';
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return '0,00';
    return new Intl.NumberFormat('sv-SE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const getVatDetailsByType = (type: 'kontant' | 'kredit') => {
    return (shift.vat_details || []).filter(detail => detail.type === type);
  };

  const kontantVatDetails = getVatDetailsByType('kontant');
  const kreditVatDetails = getVatDetailsByType('kredit');

  const renderVatTable = (details: typeof shift.vat_details, title: string) => {
    if (!details?.length) return null;

    return (
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-2">{title}</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Moms %</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Brutto</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Netto</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Moms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {details.map((detail, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{detail.vat_rate}%</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(detail.gross_income)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(detail.net_income)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(detail.vat_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Skiftdetaljer ({shift.report_nr})</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tidsperiod</p>
                <p className="text-base text-gray-900">
                  {formatDateTime(shift.start_time)} - {formatDateTime(shift.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Car className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Bil</p>
                <p className="text-base text-gray-900">
                  {shift.car.regnr} (Drosk: {shift.car.drosknr})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Förare</p>
                <p className="text-base text-gray-900">{shift.driver.name} ({shift.driver.forarid})</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Rapportnummer</p>
                <p className="text-base text-gray-900">{shift.report_nr}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Route className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Kilometer & Turer</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Taxi</p>
                <p className="text-lg font-medium">{formatNumber(shift.taxi_km)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Betalda</p>
                <p className="text-lg font-medium">{formatNumber(shift.paid_km)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Antal turer</p>
                <p className="text-lg font-medium">{shift.trips}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Ekonomisk Översikt</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Kontant</p>
                <p className="text-lg font-medium">{formatCurrency(shift.cash)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Kredit</p>
                <p className="text-lg font-medium">{formatCurrency(shift.total_credit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Drikskredit</p>
                <p className="text-lg font-medium">{formatCurrency(shift.drikskredit)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Att Redovisa</p>
                <p className="text-lg font-medium">{formatCurrency(shift.to_report)}</p>
              </div>
            </div>
              <div className="grid grid-cols-1 justify-center gap-4 mt-4 mb-8">
                <p className="text-xl font-bold text-gray-900">Lönegrund ex. moms</p>
                <p className="text-xl font-bold">{formatCurrency(shift.lonegr_ex_moms)}</p>
              </div>

            {shift.total_inkort_details?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-2">Total Inkört</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Moms %</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Brutto</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Netto</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Moms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shift.total_inkort_details.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{detail.moms_percentage}%</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.brutto)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.netto)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.moms_kr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {renderVatTable(kontantVatDetails, 'Kontant')}
            {renderVatTable(kreditVatDetails, 'Kredit')}

            {shift.bom_details?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-700 mb-2">BOM/Avbeställning</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Moms %</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Brutto</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Netto</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Moms</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shift.bom_details.map((detail, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{detail.moms_percentage}%</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.brutto)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.netto)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(detail.moms_kr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}