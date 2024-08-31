"use client";

import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import useTags from '@/hooks/useTags';
import useAuthors from '@/hooks/useAuthors';
import Loader from '@/app/loader';
import './FilterMenuBlog.css'

interface FilterMenuProps {
  filters: {
    author: string;
    tags: string[];
    sortOrder: string;
    searchKeyword: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    author: string;
    tags: string[];
    sortOrder: string;
    searchKeyword: string;
  }>>;
}

const FilterMenuBlog: React.FC<FilterMenuProps> = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);
  const { tags: allTags = [], addNewTag, isPending: isTagsPending } = useTags();
  const { authors, isPending: isAuthorsPending } = useAuthors();

  const toggleFilterMenu = () => {
    if (isExpanded) {
      setFilters({
        author: '',
        tags: [],
        sortOrder: 'dateDesc',
        searchKeyword: ''
      });
      setTagInput('');
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
    setIsExpanded(!isExpanded);
  };
  
  

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, author: e.target.value }));
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortOrder: e.target.value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchKeyword: e.target.value }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value) {
      const filteredSuggestions = allTags?.filter(tag =>
        tag.toLowerCase().includes(value.toLowerCase())
      ) || [];
      setTagSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setTagSuggestions([]);
      setShowSuggestions(false);
    }
  };
  

  const handleAddTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({ ...prev, tags: [...filters.tags, tag] }));
    }
    setTagInput('');
    setTagSuggestions([]);
    setShowSuggestions(false);
  };

  const handleRemoveTag = (tag: string) => {
    setFilters(prev => ({ ...prev, tags: filters.tags.filter(t => t !== tag) }));
  };

  if (isTagsPending || isAuthorsPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center mb-10 w-full">
      <h3 className="text-2xl text-gray-800 font-black mb-8">Menu Filtrer</h3>
      <div className="relative w-full">
        <button
          className="bg-primary text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mb-4 absolute top-[-20px] left-1/2 transform -translate-x-1/2 border border-white hover:bg-terciaire transition-colors duration-300 z-20"
          onClick={toggleFilterMenu}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isExpanded ? <MinusIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
        </button>
        {isExpanded && (
          <div className={`mb-6 p-6 border-2 border-colorBg rounded-lg  ${isHovered ? 'filter-grayscale' : ''}`}>
            <div className="mb-4">
              <label className="block text-lg text-terciaire font-medium mb-2">Recherche dans le titre</label>
              <input 
                type="text" 
                className="block w-full border-2 border-colorBg text-colorInput rounded p-2  focus:border-primary focus:outline-none" 
                onChange={handleSearchChange} 
                value={filters.searchKeyword} 
                placeholder="Rechercher..." 
              />
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              <div className="flex-1">
                <label className="block text-lg text-terciaire font-medium mb-2">Trier par</label>
                <select 
                  className="block w-full border-2 border-colorBg text-colorInput rounded p-2  focus:border-primary focus:outline-none" 
                  onChange={handleSortOrderChange} 
                  value={filters.sortOrder}
                >
                  <option value="dateDesc">Date décroissante</option>
                  <option value="dateAsc">Date croissante</option>
                  <option value="popularity">Popularité</option>
                  <option value="likes">Nombre de likes</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-lg text-terciaire font-medium mb-2">Rechercher par Tags</label>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full border-2 border-colorBg text-colorInput rounded p-2  focus:border-primary focus:outline-none" 
                    onChange={handleTagChange}
                    onFocus={() => setShowSuggestions(true)}
                    value={tagInput}
                    placeholder="Sélectionner un tag"
                  />
                  {showSuggestions && tagSuggestions.length > 0 && (
                    <ul className="absolute z-10 border rounded p-2 w-full bg-white mt-2 shadow-sm max-h-40 overflow-y-auto">
                      {tagSuggestions.map((tag: string, index: number) => (
                        <li
                          key={index}
                          onClick={() => handleAddTag(tag)}
                          className="cursor-pointer text-terciaire p-1 hover:bg-gray-200"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {filters.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center bg-primary text-white px-2 py-1 rounded-full">
                      {tag}
                      <button 
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-white hover:text-gray-200"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-lg text-terciaire font-medium mb-2">Sélectionner un Auteur</label>
                <select 
                  className="block w-full border-2 border-colorBg text-colorInput rounded p-2  focus:border-primary focus:outline-none "  
                  onChange={handleAuthorChange} 
                  value={filters.author}
                >
                  <option value="">Tous les auteurs</option>
                  {authors?.map((author, index) => (
                    <option key={index} value={author.name}>{author.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterMenuBlog;
