import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { extractFullImageText } from '../services/ocrService';
import ImagePreview from './ImagePreview';

interface BatchImageUploadProps {
  onResultsReceived: (results: Array<{ file: File; text: string; isValid: boolean }>) => void;
}

export default function BatchImageUpload({ onResultsReceived }: BatchImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const processImages = useCallback(
    async (filesToProcess: File[]) => {
      if (filesToProcess.length === 0) {
        toast.error('Vänligen ladda upp minst en bild');
        return;
      }

      setIsProcessing(true);
      setProgress({ current: 0, total: filesToProcess.length });

      const results: Array<{ file: File; text: string; isValid: boolean }> = [];

      try {
        const processPromises = filesToProcess.map(async (file, index) => {
          try {
            const text = await extractFullImageText(file);
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));

            let isValid = false;
            try {
              JSON.parse(text);
              isValid = true;
            } catch (e) {
              console.warn(`Invalid JSON for file ${file.name}:`, e);
            }

            return { file, text, isValid };
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            return {
              file,
              text: error instanceof Error ? error.message : 'Bearbetningsfel',
              isValid: false
            };
          }
        });

        const processedResults = await Promise.all(processPromises);
        results.push(...processedResults);

        const validCount = results.filter(r => r.isValid).length;
        if (validCount > 0) {
          toast.success(`${validCount} av ${filesToProcess.length} bilder bearbetade`);
        }
        if (validCount < filesToProcess.length) {
          toast.error(`${filesToProcess.length - validCount} bilder kunde inte bearbetas`);
        }

        onResultsReceived(results);
      } catch (error) {
        console.error('Error processing images:', error);
        toast.error('Ett fel uppstod vid bearbetning av bilder');
      } finally {
        setIsProcessing(false);
        setProgress({ current: 0, total: 0 });
      }
    },
    [onResultsReceived]
  );

  const onDrop = async (acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setFiles(prev => [...prev, ...acceptedFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    // Start processing automatically with the accepted files
    await processImages(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxSize: 10 * 1024 * 1024,
    multiple: true
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`w-full mb-3 p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'
            }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <Upload className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              {isDragActive ? 'Släpp filerna här...' : 'Dra och släpp filer här'}
            </p>
            <p className="mt-1 text-sm text-gray-500">eller klicka för att välja filer</p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-1" />
              <span>PNG, JPEG, WebP</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              <span>Max 10MB per fil</span>
            </div>
          </div>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="grid mb-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <ImagePreview
                key={preview}
                url={preview}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>

          {isProcessing && (
            <div className="flex justify-center">
              <button
                disabled
                className="flex items-center mb-4 px-4 py-2 bg-gray-300 text-white rounded-md cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Bearbetar ({progress.current}/{progress.total})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
