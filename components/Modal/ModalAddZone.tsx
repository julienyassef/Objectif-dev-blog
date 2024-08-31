import React from 'react';

interface ModalAddZoneProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'text' | 'vidéo' | 'photo' | 'link' | 'h2') => void;
}

const ModalAddZone: React.FC<ModalAddZoneProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="p-12 bg-colorModal rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-white">Ajouter une nouvelle zone</h2>
        <button 
        onClick={() => onSelect('h2')} 
        className="block w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Titre de section (h2)
        </button>
        <button
          onClick={() => onSelect('text')}
          className="block w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Texte
        </button>
        <button
          onClick={() => onSelect('vidéo')}
          className="block w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Vidéo
        </button>
        <button
          onClick={() => onSelect('photo')}
          className="block w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Photo
        </button>
        <button
          onClick={() => onSelect('link')}
          className="block w-full px-4 py-2 mb-4 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Lien
        </button>
        <button
          onClick={onClose}
          className="block w-full px-4 py-2 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ModalAddZone;
