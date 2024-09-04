import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import useArticles from '@/hooks/useArticles';
import { Article } from '@/models/article';

interface LikeButtonProps {
  slug: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ slug }) => {
  const { articles } = useArticles();
  const article = articles?.find((article: Article) => article.slug === slug);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (article) {
      setLiked(article.likes > 0);
    }
  }, [slug, article]);

  const handleLike = async () => {
    setLiked(!liked);

    // Appelez le point de terminaison API côté serveur
    const response = await fetch('/api/toggle-like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug, like: !liked }),
    });

    const data = await response.json();
    if (!data.success) {
      console.error(data.error);
    }
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
