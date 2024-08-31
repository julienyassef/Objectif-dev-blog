import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TitleZoneProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  onRemove: () => void; // Ajoutez cette prop
}

const TitleZone: React.FC<TitleZoneProps> = ({ value = '', onChange, readOnly = false, onRemove }) => {
  return (
    <div className="relative">
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-primary text-white rounded m-1 p-1 hover:bg-terciaire transition duration-200"
        title="Remove title zone"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <input
        type="text"
        placeholder="Entrez un titre de section"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        readOnly={readOnly}
        className={`border rounded p-2 w-full text-colorInput ${readOnly ? 'bg-gray-100' : ''}`}
      />
    </div>
  );
};

export default TitleZone;
