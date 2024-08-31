"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DisplayAllArticles from '@/components/DisplayListArticles/DisplayAllArticles';
import FilterMenuBlog from '@/components/FilterMenuBlog/FilterMenuBlog';

const BlogHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fonction sécurisée pour récupérer les paramètres
  const getParam = (param: string): string => {
    const value = searchParams.get(param);
    return value !== null ? value : '';
  };

  const initialAuthor = getParam('author');
  const initialTags = getParam('tags') ? getParam('tags').split(',') : [];
  const initialSortOrder = getParam('sortOrder') || 'dateDesc';
  const initialSearchKeyword = getParam('searchKeyword');
  const initialPage = parseInt(getParam('page') || '1', 10);

  const [filters, setFilters] = useState({
    author: initialAuthor,
    tags: initialTags,
    sortOrder: initialSortOrder,
    searchKeyword: initialSearchKeyword,
  });

  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const query: Record<string, string> = {
      sortOrder: filters.sortOrder,
    };

    if (filters.author) query.author = filters.author;
    if (filters.tags.length > 0) query.tags = filters.tags.join(',');
    if (filters.searchKeyword) query.searchKeyword = filters.searchKeyword;
    if (currentPage > 1) query.page = currentPage.toString();

    const queryString = new URLSearchParams(query).toString();

    router.replace(`/blog?${queryString}`);

  }, [filters, currentPage, router]);

  useEffect(() => {
    const query: Record<string, string> = {
      sortOrder: filters.sortOrder,
    };

    if (filters.author) query.author = filters.author;
    if (filters.tags.length > 0) query.tags = filters.tags.join(',');
    if (filters.searchKeyword) query.searchKeyword = filters.searchKeyword;
    if (currentPage > 1) query.page = currentPage.toString();

    const queryString = new URLSearchParams(query).toString();

    router.replace(`/blog?${queryString}`);
  }, [filters, currentPage, router]);

  return (
    <div className="container mx-auto p-4 mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
      <h1 className="text-4xl font-bold text-primary mb-4 text-center">Tous les articles du Blog</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Parcourez tous les articles publiés sur notre blog. Utilisez les filtres pour affiner votre recherche par auteur, date, popularité ou tags.
      </p>
      <FilterMenuBlog filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 mt-12 gap-6 mb-10">
        <DisplayAllArticles
          filters={filters}
          currentPage={currentPage}
          articlesPerPage={9}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default BlogHome;