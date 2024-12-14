import React from 'react';

interface VatDetailsFormProps {
  data: any;
  onUpdate: (data: any) => void;
  onPrev: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function VatDetailsForm({
  data,
  onUpdate,
  onPrev,
  onSubmit
}: VatDetailsFormProps) {
  const handleVatDetailsChange = (
    type: 'kontant' | 'kredit' | 'total_inkort' | 'bom',
    index: number,
    field: string,
    value: string
  ) => {
    const newValue = parseFloat(value) || 0;
    const newData = { ...data };

    if (type === 'kontant') {
      newData.kontant_details.moms_details[index] = {
        ...newData.kontant_details.moms_details[index],
        [field]: newValue
      };
    } else if (type === 'kredit') {
      newData.kredit_details.moms_details[index] = {
        ...newData.kredit_details.moms_details[index],
        [field]: newValue
      };
    } else if (type === 'total_inkort') {
      newData.total_inkort_details.moms_details[index] = {
        ...newData.total_inkort_details.moms_details[index],
        [field]: newValue
      };
    } else if (type === 'bom') {
      newData.varav_bom_avbest_details.moms_details[index] = {
        ...newData.varav_bom_avbest_details.moms_details[index],
        [field]: newValue
      };
    }

    onUpdate(newData);
  };

  const addVatDetail = (type: 'kontant' | 'kredit' | 'total_inkort' | 'bom') => {
    const newData = { ...data };
    const newDetail = {
      moms_percentage: 0,
      brutto: 0,
      netto: 0,
      moms_kr: 0
    };

    if (type === 'kontant') {
      newData.kontant_details.moms_details.push(newDetail);
    } else if (type === 'kredit') {
      newData.kredit_details.moms_details.push(newDetail);
    } else if (type === 'total_inkort') {
      newData.total_inkort_details.moms_details.push(newDetail);
    } else if (type === 'bom') {
      newData.varav_bom_avbest_details.moms_details.push(newDetail);
    }

    onUpdate(newData);
  };

  const renderVatDetailInputs = (
    type: 'kontant' | 'kredit' | 'total_inkort' | 'bom',
    details: any[],
    title: string
  ) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => addVatDetail(type)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Lägg till momsdetalj
        </button>
      </div>
      {details.map((detail, index) => (
        <div key={index} className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Moms %
            </label>
            <input
              type="number"
              value={detail.moms_percentage}
              onChange={(e) =>
                handleVatDetailsChange(type, index, 'moms_percentage', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brutto
            </label>
            <input
              type="number"
              value={detail.brutto}
              onChange={(e) =>
                handleVatDetailsChange(type, index, 'brutto', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Netto
            </label>
            <input
              type="number"
              value={detail.netto}
              onChange={(e) =>
                handleVatDetailsChange(type, index, 'netto', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Moms Kr
            </label>
            <input
              type="number"
              value={detail.moms_kr}
              onChange={(e) =>
                handleVatDetailsChange(type, index, 'moms_kr', e.target.value)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.01"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {renderVatDetailInputs(
        'kontant',
        data.kontant_details.moms_details,
        'Kontant Momsdetaljer'
      )}
      {renderVatDetailInputs(
        'kredit',
        data.kredit_details.moms_details,
        'Kredit Momsdetaljer'
      )}
      {renderVatDetailInputs(
        'total_inkort',
        data.total_inkort_details.moms_details,
        'Total Inkört Momsdetaljer'
      )}
      {renderVatDetailInputs(
        'bom',
        data.varav_bom_avbest_details.moms_details,
        'BOM/Avbeställning Momsdetaljer'
      )}

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Tillbaka
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Spara Skift
        </button>
      </div>
    </div>
  );
}