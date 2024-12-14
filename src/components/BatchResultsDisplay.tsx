import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Save, Loader2 } from 'lucide-react';
import ExtractedDataDisplay from './receipt/ExtractedDataDisplay';
import { validateReceiptData } from '../services/receiptValidationService';
import { saveShiftData } from '../services/shiftService';
import { OCR_CONFIG } from '../services/ocr/config';
import toast from 'react-hot-toast';

interface BatchResultsDisplayProps {
  results: Array<{ file: File; text: string; isValid: boolean }>;
}

interface ValidationState {
  [key: number]: {
    isValid: boolean;
    message: string;
  };
}

export default function BatchResultsDisplay({ results }: BatchResultsDisplayProps) {
  const [expandedResults, setExpandedResults] = useState<number[]>([]);
  const [validationStates, setValidationStates] = useState<ValidationState>({});
  const [editedData, setEditedData] = useState<{ [key: number]: any }>({});
  const [savingStates, setSavingStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    validateResults();
    const initialData = results.reduce((acc, result, index) => {
      try {
        if (result.isValid) {
          acc[index] = JSON.parse(result.text);
        } else {
          acc[index] = { ...OCR_CONFIG.DEFAULT_DATA };
        }
      } catch (error) {
        console.error(`Error parsing result ${index}:`, error);
        acc[index] = { ...OCR_CONFIG.DEFAULT_DATA };
      }
      return acc;
    }, {} as { [key: number]: any });
    setEditedData(initialData);
  }, [results]);

  const validateResults = async () => {
    const validations: ValidationState = {};
    for (let i = 0; i < results.length; i++) {
      try {
        if (!results[i].isValid) {
          validations[i] = { isValid: false, message: 'Ogiltig data' };
          continue;
        }
        const result = await validateReceiptData(results[i].text);
        validations[i] = {
          isValid: result.isValid,
          message: result.isValid ? 'Giltig data' : 'Ogiltig data'
        };
      } catch (error) {
        validations[i] = {
          isValid: false,
          message: error instanceof Error ? error.message : 'Valideringsfel'
        };
      }
    }
    setValidationStates(validations);
  };

  const handleSave = async (index: number) => {
    setSavingStates(prev => ({ ...prev, [index]: true }));
    try {
      await saveShiftData(editedData[index]);
      toast.success(`Skift ${index + 1} har sparats`);
      setValidationStates(prev => ({
        ...prev,
        [index]: {
          isValid: true,
          message: 'Sparat'
        }
      }));
    } catch (error) {
      console.error('Error saving shift:', error);
      if (error instanceof Error && error.message.includes('finns redan registrerat')) {
        toast.error(`Skift ${index + 1} finns redan registrerat`);
        setValidationStates(prev => ({
          ...prev,
          [index]: {
            isValid: true,
            message: 'Skiftet finns redan i databasen'
          }
        }));
      } else {
        toast.error('Ett oväntat fel inträffade');
      }
    } finally {
      setSavingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedResults(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleDataUpdate = async (index: number, field: string, value: string) => {
    setEditedData(prev => {
      const updatedData = { ...prev };
      if (!updatedData[index]) {
        updatedData[index] = { ...OCR_CONFIG.DEFAULT_DATA };
      }
      const fields = field.split('.');
      let current = updatedData[index];
      for (let i = 0; i < fields.length - 1; i++) {
        if (!current[fields[i]]) {
          current[fields[i]] = {};
        }
        current = current[fields[i]];
      }
      current[fields[fields.length - 1]] = value;

      return updatedData;
    });

    try {
      const updatedDataString = JSON.stringify(editedData[index]);
      const validationResult = await validateReceiptData(updatedDataString);
      setValidationStates(prev => ({
        ...prev,
        [index]: {
          isValid: validationResult.isValid,
          message: validationResult.isValid ? 'Giltig data' : 'Ogiltig data'
        }
      }));
    } catch (error) {
      console.error('Validation error after update:', error);
    }
  };

  return (
    <div className="space-y-8">
      {results.map((result, index) => {
        const isExpanded = expandedResults.includes(index);
        const validation = validationStates[index] || { isValid: false, message: '' };
        const currentData = editedData[index];
        const isSaving = savingStates[index] || false;

        const getBackgroundClass = () => {
          if (validation.message === 'Sparat') return 'bg-blue-50 border-blue-200';
          if (validation.message === 'Skiftet finns redan i databasen') return 'bg-green-50 border-green-200';
          if (validation.isValid) return 'bg-green-50 border-green-200';
          return 'bg-red-50 border-red-200';
        };

        return (
          <div
            key={index}
            className={`rounded-lg shadow-lg overflow-hidden transition-colors duration-200 ${getBackgroundClass()}`}
          >
            <div className={`p-4 ${getBackgroundClass()} border-b border-gray-200`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Resultat {index + 1} - {result.file.name}
                  </h3>
                  <div className={`flex items-center ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.message === 'Sparat' ? (
                      <CheckCircle className="w-5 h-5 mr-1 text-blue-600" />
                    ) : validation.message === 'Skiftet finns redan i databasen' ? (
                      <CheckCircle className="w-5 h-5 mr-1 text-green-600" />
                    ) : validation.isValid ? (
                      <CheckCircle className="w-5 h-5 mr-1" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-1" />
                    )}
                    <span className="text-sm">{validation.message}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {validation.message === 'Sparat' ? (
                    <button
                      disabled
                      className="flex items-center px-3 py-1 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Sparat
                    </button>
                  ) : (
                    validation.isValid && (
                      <button
                        onClick={() => handleSave(index)}
                        disabled={isSaving}
                        className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            Sparar...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Spara
                          </>
                        )}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Visa mindre
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Visa mer
                      </>
                    )}
                  </button>
                </div>
              </div>
                            {currentData && (
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Org.nr:</span> {currentData.org_nr}
                  </div>
                  <div>
                    <span className="font-medium">Reg.nr:</span> {currentData.regnr}
                  </div>
                  <div>
                    <span className="font-medium">Förar-ID:</span> {currentData.forarid}
                  </div>
                  <div>
                    <span className="font-medium">Rapport.nr:</span> {currentData.rapportnr}
                  </div>
                </div>
              )}
            </div>

            {isExpanded && currentData && (
              <div className="p-6 bg-white">
                <ExtractedDataDisplay
                  data={currentData}
                  onUpdate={(field, value) => handleDataUpdate(index, field, value)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
