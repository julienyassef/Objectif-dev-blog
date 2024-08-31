"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'; // Mise à jour des importations pour Heroicons v2
import useTags from '@/hooks/useTags';
import Loader from '@/app/loader';
import './MenuTagSelect.css';

interface MenuTagSelectProps {}

const MenuTagSelect: React.FC<MenuTagSelectProps> = () => {
  const { tags, isPending } = useTags();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleTags = () => {
    setIsExpanded(!isExpanded);
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center mb-10 w-full">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800">Sélectionner un tag</h3>
      </div>
      <div className="relative w-full">
        <button
          className="bg-primary text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mb-4 absolute top-[-20px] left-1/2 transform -translate-x-1/2 border border-white hover:bg-terciaire transition-colors duration-300 z-20"
          onClick={toggleTags}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isExpanded ? <MinusIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
        </button>
        {isExpanded && (
          <div className={`flex flex-wrap justify-center gap-4 p-4 border-2 border-colorBg rounded-lg w-full pt-6 ${isHovered ? 'filter-grayscale' : ''}`}>
            {tags?.map((tag, index) => (
              <Link key={index} href={`/blog?tags=${tag}`}>
                <div 
                  className="bg-primary text-white font-bold text-sm px-3 py-2 rounded-full hover:scale-110 transition-transform duration-300 cursor-pointer shadow-md tracking-wide hover:bg-terciaire flex items-center justify-center ball"
                >
                  {tag}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuTagSelect;
