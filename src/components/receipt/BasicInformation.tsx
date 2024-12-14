import React from 'react';
import EditableField from '../common/EditableField';

interface BasicInformationProps {
  data: {
    org_nr?: string;
    regnr?: string;
    forarid?: string;
    rapportnr?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function BasicInformation({ data, onUpdate }: BasicInformationProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Grundinformation</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Org.nr</label>
          <EditableField
            value={data.org_nr || ''}
            onSave={(value) => onUpdate('org_nr', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reg.nr</label>
          <EditableField
            value={data.regnr || ''}
            onSave={(value) => onUpdate('regnr', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Förar-ID</label>
          <EditableField
            value={data.forarid || ''}
            onSave={(value) => onUpdate('forarid', value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rapport.nr</label>
          <EditableField
            value={data.rapportnr || ''}
            onSave={(value) => onUpdate('rapportnr', value)}
          />
        </div>
      </div>
    </div>
  );
}