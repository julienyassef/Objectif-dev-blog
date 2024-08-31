"use client";

import React from 'react';
import { Article } from '@/models/article';
import Image from 'next/image';

interface ContentElementType {
  type: string;
  value: string;
}

interface ArticlePageComponentProps {
  article: Article;
}

// Composant pour afficher chaque élément de contenu
const ContentElement: React.FC<{ element: ContentElementType }> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return <p className="my-4 text-lg text-gray-700 text-justify">{element.value}</p>;
    case 'vidéo':
      return (
        <div className="my-4">
          <video controls className="w-full rounded-md">
            <source src={element.value} type="video/mp4" />
            <source src={element.value} type="video/webm" />
            <p>Votre navigateur ne supporte pas la vidéo HTML5.</p>
          </video>
        </div>
      );
    case 'photo':
      return (
        <div className="my-4">
          <Image src={element.value} alt="" width={400} height={300} className="w-full rounded-md mb-6" />
        </div>
      );
    case 'link':
      return (
        <a href={element.value} className="my-4 text-colorBg font-bold underline" target="_blank" rel="noopener noreferrer">
          {element.value}
        </a>
      );
    case 'h2':
      return <h2 className="my-4 text-2xl font-bold text-gray-800">{element.value}</h2>;
    default:
      return null;
  }
};



const ArticlePageComponent: React.FC<ArticlePageComponentProps> = ({ article }) => {
  // Trouver la première photo et l'exclure des autres éléments
  const otherElements = article.content.filter((element, index) => element.type !== 'photo' || index !== article.content.findIndex((el) => el.type === 'photo'));

  return (
    <div className="container mx-auto pl-6 pr-6">
      {otherElements.map((element, index) => (
        <ContentElement key={index} element={element} />
      ))}
    </div>
  );
};

export default ArticlePageComponent;
