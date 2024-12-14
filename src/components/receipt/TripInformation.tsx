import React from 'react';
import EditableField from '../common/EditableField';
import { formatNumber } from '../../utils/formatters';

interface TripInformationProps {
  data: {
    taxitrafik_km?: number;
    betalda_km?: number;
    turer?: number;
    start_time?: string;
    end_time?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function TripInformation({ data, onUpdate }: TripInformationProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Körningsinformation</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Starttid</label>
          <EditableField
            value={data.start_time || ''}
            onSave={(value) => onUpdate('start_time', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sluttid</label>
          <EditableField
            value={data.end_time || ''}
            onSave={(value) => onUpdate('end_time', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Taxitrafik KM</label>
          <EditableField
            value={formatNumber(data.taxitrafik_km)}
            onSave={(value) => onUpdate('taxitrafik_km', value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Betalda KM</label>
          <EditableField
            value={formatNumber(data.betalda_km)}
            onSave={(value) => onUpdate('betalda_km', value)}
            type="number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Antal Turer</label>
          <EditableField
            value={data.turer?.toString() || '0'}
            onSave={(value) => onUpdate('turer', value)}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}