import React from 'react';
import Dropzone from './Dropzone';
import ImagePreview from './ImagePreview';
import { ImageState } from '../types';

interface ImageUploadSectionProps {
  title: string;
  description: string;
  imageState: ImageState;
  onFileAccepted: (file: File) => void;
  onRemoveFile: () => void;
}

export default function ImageUploadSection({
  title,
  description,
  imageState,
  onFileAccepted,
  onRemoveFile
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      {!imageState.file ? (
        <Dropzone onFileAccepted={onFileAccepted} />
      ) : (
        <ImagePreview
          url={imageState.preview}
          onRemove={onRemoveFile}
        />
      )}
    </div>
  );
}