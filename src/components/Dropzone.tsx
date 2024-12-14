import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function Dropzone({ onFileAccepted }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        toast.error('Filen är för stor. Maximal storlek är 10MB.');
      } else if (error.code === 'file-invalid-type') {
        toast.error('Ogiltigt filformat. Endast JPEG, PNG och PDF stöds.');
      } else {
        toast.error('Filen kunde inte laddas upp.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': []
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-200 ease-in-out cursor-pointer
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
            {isDragActive ? 'Släpp filen här...' : 'Dra och släpp en fil här'}
          </p>
          <p className="mt-1 text-sm text-gray-500">eller klicka för att välja en fil</p>
        </div>
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <ImageIcon className="w-4 h-4 mr-1" />
              <span>PNG, JPEG</span>
            </div>
            <div className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              <span>PDF</span>
            </div>
          </div>
          <p className="text-xs">Max filstorlek: 10MB</p>
        </div>
      </div>
    </div>
  );
}