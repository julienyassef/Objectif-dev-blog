"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DisplayAllArticles from '@/components/DisplayListArticles/DisplayAllArticles';
import FilterMenuBlog from '@/components/FilterMenuBlog/FilterMenuBlog';
import Head from 'next/head';

const BlogHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <>
      <Head>
        <title>Tous les articles du Blog - Objectif Dev</title>
        <meta name="description" content="Parcourez tous les articles publiés sur le blog Objectif Dev. Utilisez les filtres pour affiner votre recherche par auteur, date, popularité ou tags." />
        <meta property="og:title" content="Tous les articles du Blog - Objectif Dev" />
        <meta property="og:description" content="Parcourez tous les articles publiés sur le blog Objectif Dev. Utilisez les filtres pour affiner votre recherche par auteur, date, popularité ou tags." />
        <meta property="og:image" content="https://objectifdev.fr/assets/logo.png" />
        <meta property="og:url" content="https://objectifdev.fr/blog" />
        <link rel="canonical" href="https://objectifdev.fr/blog" />
        {/* JSON-LD pour les données structurées */}
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Tous les articles du Blog - Objectif Dev",
            "description": "Parcourez tous les articles publiés sur le blog Objectif Dev. Utilisez les filtres pour affiner votre recherche par auteur, date, popularité ou tags.",
            "url": "https://objectifdev.fr/blog",
            "mainEntity": [{
              "@type": "BlogPosting",
              "headline": "Titre de l'article",
              "author": {
                "@type": "Person",
                "name": "Nom de l'auteur"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Objectif Dev",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://objectifdev.fr/assets/logo.png"
                }
              },
              "datePublished": "2024-08-31",
              "image": "URL de l'image de l'article"
            }]
          }`}
        </script>
      </Head>

      <div className="container mx-auto p-4 mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Tous les articles du Blog</h1>
          <p className="text-lg text-gray-600 mb-8">
            Parcourez tous les articles publiés sur notre blog. Utilisez les filtres pour affiner votre recherche par auteur, date, popularité ou tags.
          </p>
        </header>

        <section>
          <FilterMenuBlog filters={filters} setFilters={setFilters} />
        </section>

        <section className="grid grid-cols-1 mt-12 gap-6 mb-10">
          <DisplayAllArticles
            filters={filters}
            currentPage={currentPage}
            articlesPerPage={9}
            setCurrentPage={setCurrentPage}
          />
        </section>
      </div>
    </>
  );
}

export default BlogHome;
