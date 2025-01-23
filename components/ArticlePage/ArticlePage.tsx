"use client";

import React from 'react';
import { Article } from '@/models/article';
import Image from 'next/image';

interface ContentElementType {
  type: string;
  value: string;
  order: number; // Ajoutez l'ordre ici
}

interface ArticlePageComponentProps {
  article: Article;
}

// Composant pour afficher chaque élément de contenu
const ContentElement: React.FC<{ element: ContentElementType }> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return <p className="my-4 mt-8 text-lg text-gray-700 text-justify">{element.value}</p>;
    case 'vidéo':
      return (
        <div className="my-4">
          <video controls className="w-full rounded-md">
            <source src={element.value} type="video/mp4" />
            <source src={element.value} type="video/webm" />
            <p>Votre navigateur ne supporte pas la vidéo.</p>
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
      return <h2 className="my-4 mt-10 text-3xl font-bold text-gray-800">{element.value}</h2>;
    default:
      return null;
  }
};

const ArticlePageComponent: React.FC<ArticlePageComponentProps> = ({ article }) => {
  // Triez les éléments de contenu par l'ordre
  const sortedContent = article.content.sort((a, b) => a.order - b.order);

  // Trouver la première photo et l'exclure des autres éléments
  const firstPhotoIndex = sortedContent.findIndex(element => element.type === 'photo');
  const firstPhoto = firstPhotoIndex !== -1 ? sortedContent[firstPhotoIndex] : null;
  const otherElements = sortedContent.filter((_, index) => index !== firstPhotoIndex);

  return (
    <div className="container mx-auto pl-6 pr-6 mb-14">
      {firstPhoto && <ContentElement key={firstPhoto.order} element={firstPhoto} />}
      {otherElements.map((element) => (
        <ContentElement key={element.order} element={element} />
      ))}
    </div>
  );
};

export default ArticlePageComponent;
