import React, { ChangeEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Assurez-vous d'avoir installé @heroicons/react

interface LinkZoneProps {
  value?: string;
  readOnly?: boolean;
  onChange?: (link: string) => void;
  onRemove: () => void;
}

const LinkZone: React.FC<LinkZoneProps> = ({ value = '', readOnly = false, onChange, onRemove }) => {
  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 bg-primary text-white rounded m-1 p-1 hover:bg-terciaire transition duration-200"
        title="Remove link zone"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
      <input
        type="text"
        value={value}
        placeholder="Entrez le lien"
        onChange={handleLinkChange}
        readOnly={readOnly}
        className={`border rounded p-2 w-full mb-4 ${readOnly ? 'bg-gray-100' : ''}`}
      />
    </div>
  );
};

export default LinkZone;
