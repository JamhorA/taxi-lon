import React, { useState, useEffect } from 'react';
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { validateReceiptData } from '../../services/receiptValidationService';
import { saveShiftData } from '../../services/shiftService';
import EditableField from '../common/EditableField';
import { formatCurrency, formatNumber, formatDateTime } from '../../utils/formatters';
import VatDetailsTable from './VatDetailsTable';
import { ensureDefaultVatRates } from '../../utils/vat';

interface ExtractedDataDisplayProps {
  data: any;
  onUpdate: (field: string, value: string) => void;
}

export default function ExtractedDataDisplay({ data, onUpdate }: ExtractedDataDisplayProps) {
  const [localData, setLocalData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);
  const [validationStatus, setValidationStatus] = useState({
    isValid: false,
    message: ''
  });

  useEffect(() => {
    console.log('ExtractedDataDisplay: Initializing data with VAT details');
    const initializedData = {
      ...data,
      kontant_details: {
        ...data.kontant_details,
        moms_details: ensureDefaultVatRates(data.kontant_details?.moms_details)
      },
      kredit_details: {
        ...data.kredit_details,
        moms_details: ensureDefaultVatRates(data.kredit_details?.moms_details)
      },
      total_inkort_details: {
        ...data.total_inkort_details,
        moms_details: ensureDefaultVatRates(data.total_inkort_details?.moms_details)
      },
      varav_bom_avbest_details: {
        ...data.varav_bom_avbest_details,
        moms_details: ensureDefaultVatRates(data.varav_bom_avbest_details?.moms_details)
      }
    };

    console.log('ExtractedDataDisplay: Initialized data:', initializedData);
    setLocalData(initializedData);
    validateData(initializedData);
  }, [data]);

  const validateData = async (dataToValidate: any) => {
    try {
      console.log('ExtractedDataDisplay: Validating data:', dataToValidate);
      const validationResult = await validateReceiptData(JSON.stringify(dataToValidate));
      setValidationStatus({
        isValid: validationResult.isValid,
        message: validationResult.isValid ? 'Giltig data' : 'Ogiltig data'
      });
      console.log('ExtractedDataDisplay: Validation result:', validationResult);
      return validationResult.isValid;
    } catch (error) {
      console.error('ExtractedDataDisplay: Validation error:', error);
      setValidationStatus({
        isValid: false,
        message: error instanceof Error ? error.message : 'Valideringsfel'
      });
      return false;
    }
  };

  const handleFieldUpdate = async (field: string, value: string) => {
    console.log('ExtractedDataDisplay: Updating field:', field, 'with value:', value);
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
    
    console.log('ExtractedDataDisplay: Updated data:', updatedData);
    setLocalData(updatedData);
    await validateData(updatedData);
    onUpdate(field, value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('ExtractedDataDisplay: Starting save process with data:', localData);
      await saveShiftData(localData);
      toast.success('Skiftet har sparats');
    } catch (error) {
      console.error('ExtractedDataDisplay: Error saving shift:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ett oväntat fel inträffade');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">

      {!validationStatus.isValid && validationStatus.message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <p className="ml-3 text-sm text-yellow-700">{validationStatus.message}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Basic Information Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grundinformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Org.nr</label>
              <EditableField
                value={localData.org_nr || ''}
                onSave={(value) => handleFieldUpdate('org_nr', value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Reg.nr</label>
              <EditableField
                value={localData.regnr || ''}
                onSave={(value) => handleFieldUpdate('regnr', value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Förar-ID</label>
              <EditableField
                value={localData.forarid || ''}
                onSave={(value) => handleFieldUpdate('forarid', value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Drosk.nr</label>
              <EditableField
                value={localData.drosknr || ''}
                onSave={(value) => handleFieldUpdate('drosknr', value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Rapport.nr</label>
              <EditableField
                value={localData.rapportnr || ''}
                onSave={(value) => handleFieldUpdate('rapportnr', value)}
                className="text-base"
              />
            </div>
          </div>
        </div>

        {/* Trip Information Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Körningsinformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Taxitrafik KM</label>
              <EditableField
                value={formatNumber(localData.taxitrafik_km)}
                onSave={(value) => handleFieldUpdate('taxitrafik_km', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Betalda KM</label>
              <EditableField
                value={formatNumber(localData.betalda_km)}
                onSave={(value) => handleFieldUpdate('betalda_km', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Antal Turer</label>
              <EditableField
                value={localData.turer?.toString() || '0'}
                onSave={(value) => handleFieldUpdate('turer', value)}
                type="number"
                className="text-base"
              />
            </div>
          </div>
        </div>

        {/* Time Period Section */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tidsperiod</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Starttid</label>
              <EditableField
                value={formatDateTime(localData.start_time)}
                onSave={(value) => handleFieldUpdate('start_time', value)}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Sluttid</label>
              <EditableField
                value={formatDateTime(localData.end_time)}
                onSave={(value) => handleFieldUpdate('end_time', value)}
                className="text-base"
              />
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ekonomisk Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Kontant</label>
              <EditableField
                value={formatCurrency(localData.kontant)}
                onSave={(value) => handleFieldUpdate('kontant', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Total Kredit</label>
              <EditableField
                value={formatCurrency(localData.total_kredit)}
                onSave={(value) => handleFieldUpdate('total_kredit', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Drikskredit</label>
              <EditableField
                value={formatCurrency(localData.drikskredit)}
                onSave={(value) => handleFieldUpdate('drikskredit', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Att Redovisa</label>
              <EditableField
                value={formatCurrency(localData.att_redovisa)}
                onSave={(value) => handleFieldUpdate('att_redovisa', value)}
                type="number"
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Lönegrund ex. moms</label>
              <EditableField
                value={formatCurrency(localData.lonegr_ex_moms)}
                onSave={(value) => handleFieldUpdate('lonegr_ex_moms', value)}
                type="number"
                className="text-base"
              />
            </div>
          </div>
        </div>

        {/* VAT Details Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Momsdetaljer</h3>
          
          {/* Kontant VAT Details */}
          {localData.kontant_details?.moms_details && (
            <VatDetailsTable
              details={localData.kontant_details.moms_details}
              title="Kontant Momsdetaljer"
              prefix="kontant_details.moms_details"
              onUpdate={handleFieldUpdate}
            />
          )}

          {/* Kredit VAT Details */}
          {localData.kredit_details?.moms_details && (
            <VatDetailsTable
              details={localData.kredit_details.moms_details}
              title="Kredit Momsdetaljer"
              prefix="kredit_details.moms_details"
              onUpdate={handleFieldUpdate}
            />
          )}

          {/* Total Inkört Details */}
          {localData.total_inkort_details && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Inkört</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Total Belopp</label>
                <EditableField
                  value={formatCurrency(localData.total_inkort_details.total_inkort)}
                  onSave={(value) => handleFieldUpdate('total_inkort_details.total_inkort', value)}
                  type="number"
                  className="text-base"
                />
              </div>
              <VatDetailsTable
                details={localData.total_inkort_details.moms_details}
                title="Total Inkört Momsdetaljer"
                prefix="total_inkort_details.moms_details"
                onUpdate={handleFieldUpdate}
              />
            </div>
          )}

          {/* BOM Details */}
          {localData.varav_bom_avbest_details?.moms_details && (
            <VatDetailsTable
              details={localData.varav_bom_avbest_details.moms_details}
              title="BOM/Avbeställning Momsdetaljer"
              prefix="varav_bom_avbest_details.moms_details"
              onUpdate={handleFieldUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}