import React from 'react';
import { format } from 'date-fns';

interface SalaryReportProps {
  driverName: string;
  driverForarId: string;
  startDate: string;
  endDate: string;
  totalSalaryBase: number;
  shifts: Array<{
    start_time: string;
    end_time: string;
    lonegr_ex_moms: number;
  }>;
}

export default function SalaryReport({
  driverName,
  driverForarId,
  startDate,
  endDate,
  totalSalaryBase,
  shifts
}: SalaryReportProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
  };

  // Calculate 37% of total salary base
  const calculatedSalary = totalSalaryBase * 0.37;

  return (
    <div className="p-8 bg-white" id="salary-report">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-6">Löneunderlag</h1>
        <div className="bg-blue-50 p-6 rounded-lg inline-block">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            {driverName}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600">Period</p>
              <p className="font-semibold">
                {format(new Date(startDate), 'yyyy-MM-dd')} - {format(new Date(endDate), 'yyyy-MM-dd')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Förar-ID</p>
              <p className="font-semibold">{driverForarId}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid gap-2">
              <div>
                <p className="text-sm text-gray-600">Total Lönegrund</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(totalSalaryBase)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Lön (37% av lönegrund)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculatedSalary)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Skiftöversikt</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tid
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lönegrund
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lön (37%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shifts.map((shift, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(shift.start_time).split(' ')[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(shift.start_time).split(' ')[1]} - {formatDate(shift.end_time).split(' ')[1]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(shift.lonegr_ex_moms)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(shift.lonegr_ex_moms * 0.37)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={2} className="px-6 py-4 text-sm text-gray-900">
                  Totalt
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                  {formatCurrency(totalSalaryBase)}
                </td>
                <td className="px-6 py-4 text-sm text-green-600 text-right">
                  {formatCurrency(calculatedSalary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Genererad: {format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
      </div>
    </div>
  );
}