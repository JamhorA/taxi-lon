import React from 'react';
import EditableField from '../common/EditableField';
import { formatCurrency } from '../../utils/formatters';

interface VatDetail {
  moms_percentage: number;
  brutto: number;
  netto: number;
  moms_kr: number;
}

interface VatDetailsTableProps {
  details: VatDetail[];
  title: string;
  prefix: string;
  onUpdate: (field: string, value: string) => void;
}

export default function VatDetailsTable({ details, title, prefix, onUpdate }: VatDetailsTableProps) {
  if (!details?.length) return null;

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Moms %</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Brutto</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Netto</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Moms kr</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {details.map((detail, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <EditableField
                    value={detail.moms_percentage}
                    onSave={(value) => onUpdate(`${prefix}.${index}.moms_percentage`, value)}
                    type="number"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <EditableField
                    value={formatCurrency(detail.brutto)}
                    onSave={(value) => onUpdate(`${prefix}.${index}.brutto`, value)}
                    type="number"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <EditableField
                    value={formatCurrency(detail.netto)}
                    onSave={(value) => onUpdate(`${prefix}.${index}.netto`, value)}
                    type="number"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <EditableField
                    value={formatCurrency(detail.moms_kr)}
                    onSave={(value) => onUpdate(`${prefix}.${index}.moms_kr`, value)}
                    type="number"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}