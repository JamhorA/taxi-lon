import React, { useState, useEffect } from 'react';
import { Copy, Download, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateReceiptData } from '../services/receiptValidationService';
import { saveShiftData } from '../services/shiftService';
import ExtractedDataDisplay from './receipt/ExtractedDataDisplay';

interface ResultDisplayProps {
  title: string;
  text: string;
}

export default function ResultDisplay({ title, text }: ResultDisplayProps) {
  const [isValid, setIsValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Kopierad till urklipp');
    } catch (err) {
      toast.error('Kunde inte kopiera texten');
    }
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDataUpdate = (field: string, value: string) => {
    setParsedData(prevData => {
      const newData = { ...prevData };
      let currentObj = newData;
      const fields = field.split('.');
      
      for (let i = 0; i < fields.length - 1; i++) {
        if (!currentObj[fields[i]]) {
          currentObj[fields[i]] = {};
        }
        currentObj = currentObj[fields[i]];
      }
      
      const lastField = fields[fields.length - 1];
      currentObj[lastField] = value;
      
      return newData;
    });
  };

  useEffect(() => {
    try {
      const data = JSON.parse(text);
      setParsedData(data);
      validateData();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setParsedData(null);
    }
  }, [text]);

  const validateData = async () => {
    try {
      const result = await validateReceiptData(text);
      setIsValid(result.isValid);
    } catch (error) {
      console.error('Error validating receipt data:', error);
      setIsValid(false);
    }
  };

  const handleSave = async () => {
    if (!isValid) {
      toast.error('Data måste valideras innan den kan sparas');
      return;
    }

    setIsSaving(true);
    try {
      await saveShiftData(parsedData);
      toast.success('Data sparad');
    } catch (error) {
      console.error('Error saving data:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Kunde inte spara data');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-4 mt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Copy className="w-4 h-4 mr-2" />
            Kopiera
          </button>
          <button
            onClick={downloadText}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Ladda ner
          </button>
          {isValid && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Sparar...' : 'Spara'}
            </button>
          )}
        </div>
      </div>

      {parsedData ? (
        <ExtractedDataDisplay 
          data={parsedData} 
          onUpdate={handleDataUpdate}
        />
      ) : (
        <div className="w-full min-h-[200px] p-4 bg-white border border-gray-200 rounded-lg">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
            {text || 'Ingen text har extraherats än...'}
          </pre>
        </div>
      )}
    </div>
  );
}