import React, { useState, useCallback } from 'react';
import { Scan, Loader2 } from 'lucide-react';
import ResultDisplay from '../components/ResultDisplay';
import ImageUploadSection from '../components/ImageUploadSection';
import BatchImageUpload from '../components/BatchImageUpload';
import BatchResultsDisplay from '../components/BatchResultsDisplay';
import { extractFullImageText } from '../services/ocrService';
import { ImageState } from '../types';

export default function ReceiptView() {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    preview: '',
    extractedText: '',
    isProcessing: false
  });
  const [batchResults, setBatchResults] = useState<string[]>([]);

  const handleImageAccepted = useCallback(async (acceptedFile: File) => {
    try {
      // Clear previous data first
      if (imageState.preview) {
        URL.revokeObjectURL(imageState.preview);
      }
      
      // Reset state with new file
      setImageState({
        file: acceptedFile,
        preview: URL.createObjectURL(acceptedFile),
        extractedText: '',
        isProcessing: true
      });
      
      const text = await extractFullImageText(acceptedFile);
      setImageState(prev => ({
        ...prev,
        extractedText: text,
        isProcessing: false
      }));
    } catch (error) {
      console.error('Error processing image:', error);
      setImageState(prev => ({
        ...prev,
        extractedText: '',
        isProcessing: false
      }));
    }
  }, [imageState.preview]);

  const handleRemoveImage = useCallback(() => {
    if (imageState.preview) {
      URL.revokeObjectURL(imageState.preview);
    }
    setImageState({
      file: null,
      preview: '',
      extractedText: '',
      isProcessing: false
    });
  }, [imageState.preview]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <Scan className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Kvittohantering</h1>
        <p className="mt-2 text-gray-600">
          Ladda upp och analysera kvitton
        </p>
      </div>

      <div className="space-y-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Enskild Kvitto</h2>
          <ImageUploadSection
            title="Kvitto Analys"
            description="Ladda upp ett kvitto för fullständig textextraktion"
            imageState={imageState}
            onFileAccepted={handleImageAccepted}
            onRemoveFile={handleRemoveImage}
          />

          {imageState.isProcessing ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-lg text-gray-700">
                Bearbetar bild...
              </span>
            </div>
          ) : imageState.extractedText && (
            <ResultDisplay 
              title="Extraherad Information"
              text={imageState.extractedText} 
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Batch Uppladdning</h2>
          <BatchImageUpload onResultsReceived={setBatchResults} />
          
          {batchResults.length > 0 && (
            <BatchResultsDisplay results={batchResults} />
          )}
        </div>
      </div>
    </div>
  );
}