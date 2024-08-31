import React, { ChangeEvent, useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoZoneProps {
  onChange?: (file: File) => void;
  value?: string;
  readOnly?: boolean;
  onRemove: () => void; 
}

const VideoZone: React.FC<VideoZoneProps> = ({ onChange, value, readOnly = false, onRemove }) => {
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
    <div className="relative border rounded p-2 ">
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-primary text-white rounded m-1 p-1 hover:bg-terciaire transition duration-200"
        title="Remove video zone"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <p className="mb-4 text-colorInput">Sélectionnez une vidéo :</p>
      {preview && (
        <div className="mb-4">
          <video controls className="max-h-40 mb-2 w-full">
            <source src={preview} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      {!readOnly && (
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="border rounded p-2 w-full mb-4 text-colorInput"
        />
      )}
    </div>
  );
};

export default VideoZone;
