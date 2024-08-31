"use client";

import React from 'react';
import Link from 'next/link';
import { Article } from '@/models/article';
import Image from 'next/image';

interface RelatedArticleCardProps {
  article: Article;
}

const RelatedArticleCard: React.FC<RelatedArticleCardProps> = ({ article }) => {
  // Trouver le premier élément photo dans le contenu de l'article
  const photoElement = article.content.find((element) => element.type === 'photo');

  return (
    <Link href={`/blog/${article.slug}`} className="block mb-4 border rounded-md shadow-md hover:shadow-lg hover:bg-terciaire transition-shadow duration-300 flex items-center group">
      {photoElement && (
        <div className="relative w-1/3 p-2">
          <div className="relative w-full h-24 mx-auto">
            <Image 
              src={photoElement.value} 
              alt="" 
              layout="fill" 
              objectFit="cover" 
              className="rounded-md" 
            />
          </div>
        </div>
      )}
      <div className="p-4 flex-1">
        <p className="text-mg font-semibold text-gray-600 group-hover:text-white">{article.title}</p>
      </div>
    </Link>
  );
};

export default RelatedArticleCard;
