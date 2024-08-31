import React, { useState } from 'react';
import IconShare from '@/public/assets/logoNav/icon-share';
import Modal from 'react-modal';

interface ShareButtonProps {
  slug: string;
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ slug, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/blog/${slug}`;

  const handleShare = () => {
    setIsModalOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };

  return (
    <>
      <button onClick={handleShare} className="flex items-center font-black text-gray-400 hover:text-primary">
        <IconShare width={20} height={20} color="currentColor" />
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Partager cet article"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-4 rounded shadow-lg max-w-md mx-auto">
          <h2 className="text-xl mb-4 font-bold text-center">Partager cet article</h2>
          <p className="text-center text-lg  text-secondaire font-semibold mb-4">{title}</p>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={url}
              readOnly
              className="border p-2 rounded flex-grow mr-2"
            />
            <button
              onClick={handleCopy}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition duration-200"
            >
              {copied ? 'Copié!' : 'Copier'}
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
