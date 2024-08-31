"use client";

import React, { useEffect, useState } from 'react';
import ArticleCard from '@/components/Cards/ArticleCard/ArticleCard';
import useArticles from '@/hooks/useArticles';
import Loader from '@/app/loader';
import Pagination from '../Pagination/Pagination';

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

interface DisplayAllArticlesProps {
  filters: {
    author: string;
    tags: string[];
    sortOrder: string;
    searchKeyword: string;
  };
  currentPage: number;
  articlesPerPage: number;
  setCurrentPage: (page: number) => void;
}

const DisplayAllArticles: React.FC<DisplayAllArticlesProps> = ({ filters, currentPage, articlesPerPage, setCurrentPage }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const {articles: fetchedArticles, isPending} = useArticles()

  useEffect(() => {
    const loadArticles = async () => {
      let filteredArticles = fetchedArticles ?? []

      if (filters.author) {
        filteredArticles = filteredArticles.filter(article => article.author === filters.author);
      }

      if (filters.tags.length > 0) {
        filteredArticles = filteredArticles.filter(article =>
          filters.tags.every(tag => article.tags?.includes(tag) || false)
        );
      }

      if (filters.searchKeyword) {
        filteredArticles = filteredArticles.filter(article =>
          article.title.toLowerCase().includes(filters.searchKeyword.toLowerCase())
        );
      }

      if (filters.sortOrder === 'dateAsc') {
        filteredArticles = filteredArticles.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (filters.sortOrder === 'dateDesc') {
        filteredArticles = filteredArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filters.sortOrder === 'popularity') {
        filteredArticles = filteredArticles.sort((a, b) => b.views - a.views);
      }

      setTotalArticles(filteredArticles.length);
      const startIndex = (currentPage - 1) * articlesPerPage;
      const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

      setArticles(paginatedArticles);
    };

    loadArticles();
  }, [filters, currentPage, articlesPerPage, fetchedArticles]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article: Article) => (
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
      <Pagination
        currentPage={currentPage}
        totalArticles={totalArticles}
        articlesPerPage={articlesPerPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default DisplayAllArticles;
