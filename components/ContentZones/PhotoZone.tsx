import React, { ChangeEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PhotoZoneProps {
  onChange?: (file: File) => void;
  title: string;
  value?: string;
  readOnly?: boolean;
  onRemove: () => void; 
  showRemoveButton?: boolean; 
}

const PhotoZone: React.FC<PhotoZoneProps> = ({ onChange, title, value, readOnly = false, onRemove, showRemoveButton = true }) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      if (onChange) {
        onChange(file);
      }
    }
  };

  return (
    <div className="relative border rounded p-2  ">
      {showRemoveButton && (
        <button
          onClick={onRemove}
          className="absolute top-1 right-1 bg-primary text-white rounded m-1 p-1 hover:bg-terciaire transition duration-200"
          title="Remove photo zone"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
      <p className="mb-4 text-colorInput">{title}</p>
      {preview && (
        <div className="mb-3">
          <Image 
            src={preview} 
            alt="Preview" 
            width={500} 
            height={300} 
            className="mb-2" 
          />
        </div>
      )}
      {!readOnly && (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border rounded p-2 w-full mb-4 text-colorInput"
        />
      )}
    </div>
  );
};

export default PhotoZone;
