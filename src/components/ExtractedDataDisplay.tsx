import React, { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { validateReceiptData } from '../services/receiptValidationService';
import { saveShiftData } from '../services/shiftService';
import EditableField from './common/EditableField';

interface ExtractedDataDisplayProps {
  data: any;
  onUpdate: (field: string, value: string) => void;
}

export default function ExtractedDataDisplay({ data, onUpdate }: ExtractedDataDisplayProps) {
  const [localData, setLocalData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    isValid: false,
    message: ''
  });

  useEffect(() => {
    setLocalData(data);
    validateData(data);
    setHasChanges(false);
  }, [data]);

  const validateData = async (dataToValidate: any) => {
    try {
      const validationResult = await validateReceiptData(JSON.stringify(dataToValidate));
      setValidationStatus({
        isValid: validationResult.isValid,
        message: validationResult.isValid ? '' : 'Data validation failed'
      });
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus({
        isValid: false,
        message: error instanceof Error ? error.message : 'Unknown validation error'
      });
    }
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0,00 kr';
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '0,00';
    return new Intl.NumberFormat('sv-SE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleFieldUpdate = async (field: string, value: string) => {
    const updatedData = { ...localData };
    let currentObj = updatedData;
    const fields = field.split('.');
    
    for (let i = 0; i < fields.length - 1; i++) {
      if (!currentObj[fields[i]]) {
        currentObj[fields[i]] = {};
      }
      currentObj = currentObj[fields[i]];
    }
    
    const lastField = fields[fields.length - 1];
    currentObj[lastField] = value;
    
    setLocalData(updatedData);
    setHasChanges(true);
    await validateData(updatedData);
    onUpdate(field, value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveShiftData(localData);
      toast.success('Ändringar sparade');
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Kunde inte spara ändringar');
    } finally {
      setIsSaving(false);
    }
  };

  const renderVatDetailsTable = (details: any[], title: string) => {
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
                      onSave={(value) => handleFieldUpdate(`vat_details.${index}.moms_percentage`, value)}
                      type="number"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <EditableField
                      value={formatCurrency(detail.brutto)}
                      onSave={(value) => handleFieldUpdate(`vat_details.${index}.brutto`, value)}
                      type="number"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <EditableField
                      value={formatCurrency(detail.netto)}
                      onSave={(value) => handleFieldUpdate(`vat_details.${index}.netto`, value)}
                      type="number"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <EditableField
                      value={formatCurrency(detail.moms_kr)}
                      onSave={(value) => handleFieldUpdate(`vat_details.${index}.moms_kr`, value)}
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
  };

  return (
    <div className="space-y-6">
      {hasChanges && !validationStatus.isValid && validationStatus.message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{validationStatus.message}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grundinformation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Org.nr</label>
                <EditableField
                  value={localData.org_nr || ''}
                  onSave={(value) => handleFieldUpdate('org_nr', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reg.nr</label>
                <EditableField
                  value={localData.regnr || ''}
                  onSave={(value) => handleFieldUpdate('regnr', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Förar-ID</label>
                <EditableField
                  value={localData.forarid || ''}
                  onSave={(value) => handleFieldUpdate('forarid', value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rapport.nr</label>
                <EditableField
                  value={localData.rapportnr || ''}
                  onSave={(value) => handleFieldUpdate('rapportnr', value)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ekonomisk Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Kontant</label>
                <EditableField
                  value={formatCurrency(localData.kontant)}
                  onSave={(value) => handleFieldUpdate('kontant', value)}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Kredit</label>
                <EditableField
                  value={formatCurrency(localData.total_kredit)}
                  onSave={(value) => handleFieldUpdate('total_kredit', value)}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Drikskredit</label>
                <EditableField
                  value={formatCurrency(localData.drikskredit)}
                  onSave={(value) => handleFieldUpdate('drikskredit', value)}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Att Redovisa</label>
                <EditableField
                  value={formatCurrency(localData.att_redovisa)}
                  onSave={(value) => handleFieldUpdate('att_redovisa', value)}
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>

        {renderVatDetailsTable(localData.vat_details, 'Momsdetaljer')}
        {renderVatDetailsTable(localData.bom_details, 'BOM/Avbeställning')}
        
        {localData.total_inkort_details && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Inkört</h3>
            <EditableField
              value={formatCurrency(localData.total_inkort_details.total_inkort)}
              onSave={(value) => handleFieldUpdate('total_inkort_details.total_inkort', value)}
              type="number"
            />
            {renderVatDetailsTable(localData.total_inkort_details.moms_details, 'Total Inkört Momsdetaljer')}
          </div>
        )}
      </div>
    </div>
  );
}