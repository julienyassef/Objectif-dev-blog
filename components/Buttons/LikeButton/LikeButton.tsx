"use client";

import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import useArticles from '@/hooks/useArticles';
import { Article } from '@/models/article';

interface LikeButtonProps {
  slug: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ slug }) => {
  const { articles, toggleLike } = useArticles();
  const article = articles?.find((article: Article) => article.slug === slug);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (article) {
      setLiked(article.likes > 0);
    }
  }, [slug, article]);

  const handleLike = async () => {
    setLiked(!liked);
    await toggleLike(slug, !liked);
  };
  

  return (
    <button
    onClick={handleLike}
    className={`flex items-center font-black ${
        liked ? 'text-primary hover:text-gray-400' : 'text-gray-400 hover:text-primary'
    } transition-colors duration-300`}
    >
        <HeartIcon className="w-6 h-6" />
    </button>

  );
};

export default LikeButton;
