import React from 'react';
import EditableField from '../common/EditableField';
import { formatCurrency } from '../../utils/formatters';

interface FinancialInformationProps {
  data: {
    kontant?: number;
    total_kredit?: number;
    drikskredit?: number;
    att_redovisa?: number;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function FinancialInformation({ data, onUpdate }: FinancialInformationProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Ekonomisk Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Kontant</label>
          <EditableField
            value={formatCurrency(data.kontant)}
            onSave={(value) => onUpdate('kontant', value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Kredit</label>
          <EditableField
            value={formatCurrency(data.total_kredit)}
            onSave={(value) => onUpdate('total_kredit', value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Drikskredit</label>
          <EditableField
            value={formatCurrency(data.drikskredit)}
            onSave={(value) => onUpdate('drikskredit', value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Att Redovisa</label>
          <EditableField
            value={formatCurrency(data.att_redovisa)}
            onSave={(value) => onUpdate('att_redovisa', value)}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}