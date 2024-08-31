import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill'



interface TextZoneProps {
  value?: string;
  readOnly?: boolean;
  onChange?: (content: string) => void;
  onRemove?: () => void;
}

const TextZone: React.FC<TextZoneProps> = ({ value = '', readOnly = false, onChange, onRemove }) => {
  const [content, setContent] = useState<string>(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (newContent: string) => {
    setContent(newContent);

    // Créez un élément div et définissez le contenu HTML
    const div = document.createElement('div');
    div.innerHTML = newContent;

    // Récupérez le texte sans balises HTML
    const textContent = div.innerText || div.textContent || '';

    if (onChange) {
      onChange(textContent);
    }
  };

  return (
    <div className="relative h-80 border rounded p-2 w-full mb-4">
      {!readOnly && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-primary text-white rounded m-1 p-1 hover:bg-terciaire transition duration-200"
          title="Remove text zone"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
      <ReactQuill
        value={content}
        onChange={handleChange}
        readOnly={readOnly}
        className={`h-60 ${readOnly ? 'bg-gray-100' : ''}`}
      />
    </div>
  );
};

export default TextZone;
