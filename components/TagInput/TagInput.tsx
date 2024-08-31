"use client";

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useTags from '@/hooks/useTags';
import Loader from '@/app/loader';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTag, setPendingTag] = useState('');
  const { tags: allTags = [], addNewTag, isPending } = useTags();

  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filteredSuggestions = (allTags ?? []).filter(tag =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !tags.includes(newTag)) {
      if (!allTags?.includes(newTag)) {
        setPendingTag(newTag);
        setIsModalOpen(true);
      } else {
        setTags([...tags, newTag]);
        setInputValue('');
        setSuggestions([]);
      }
    }
  };

  const handleConfirmAddTag = async () => {
    try {
      await addNewTag(pendingTag);
      setTags([...tags, pendingTag]);
    } catch (error) {
      console.error('Failed to add tag', error);
    } finally {
      setIsModalOpen(false);
      setPendingTag('');
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    if (!tags.includes(suggestion)) {
      setTags([...tags, suggestion]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap">
        {tags.map((tag, index) => (
          <div key={index} className="bg-primary text-white px-2 py-1 rounded-full mr-2 mb-2 flex items-center">
            <span>{tag}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Ajouter un tag"
        className="border rounded p-2 w-full mb-2"
      />
      {suggestions.length > 0 && (
        <ul className="border rounded p-2 w-full mb-6 bg-white">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="cursor-pointer text-terciaire p-1 hover:bg-gray-200"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleAddTag} className="bg-colorBg/80 text-s mt-2 mb-6 text-white p-2 rounded hover:bg-terciaire transition duration-200">
        Créer un nouveau tag
      </button>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirmation de création de tag"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-4 rounded shadow-lg max-w-md mx-auto">
          <h2 className="text-xl mb-4 text-center">Voulez-vous vraiment créer un nouveau tag ?</h2>
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-700 transition duration-200"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmAddTag}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-colorModal transition duration-200"
            >
              Confirmer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagInput;
