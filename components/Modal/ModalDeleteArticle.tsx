import React from 'react';
import { Article } from '@/models/article';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (slug: string) => void;
  title: string;
  article: Article | null;
}

const ModalDeleteArticle: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, article }) => {
  if (!isOpen || !article) return null;
  console.log(article)

  const handleConfirm = () => {
    onConfirm(article.slug);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
        <div className="mb-4 text-secondary">
          <p>Are you sure you want to delete the article &quot;{article.title}&quot;?</p>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300">Cancel</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteArticle;
