"use client";

import React, { useEffect, useState } from 'react';
import ArticleCard from '@/components/Cards/ArticleCard/ArticleCard';
import useArticles from '@/hooks/useArticles';
import Loader from '@/app/loader';

interface Article {
  slug: string;
  title: string;
  content: { type: string; value: string }[];
  createdAt: Date;
  views: number;
  author: string;
  likes: number;
  tags: string[];
}

interface SortedArticlesByPopularityProps {
  limit?: number;
}

const SortedArticlesByPopularity: React.FC<SortedArticlesByPopularityProps> = ({ limit }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { articles: fetchedArticles, isPending } = useArticles();

  useEffect(() => {
    const loadArticles = async () => {
      if (fetchedArticles) {
        const sortedArticles = [...fetchedArticles].sort((a, b) => b.views - a.views);
        if (limit) {
          setArticles(sortedArticles.slice(0, limit));
        } else {
          setArticles(sortedArticles);
        }
      } else {
        setArticles([]);
      }
    };

    loadArticles();
  }, [limit, fetchedArticles]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map(article => (
        <ArticleCard
          key={article.slug}
          slug={article.slug}
          title={article.title}
          summary={article.content.find(c => c.type === 'text')?.value || ''}
          publishDate={article.createdAt.toISOString()}
          imageUrl={article.content.find(c => c.type === 'photo')?.value || ''}
        />
      ))}
    </div>
  );
};

export default SortedArticlesByPopularity;
