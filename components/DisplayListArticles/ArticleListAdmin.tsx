"use client";

import React, { useEffect, useState } from 'react';
import useArticles from '@/hooks/useArticles';
import Loader from '@/app/loader';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon } from '@heroicons/react/24/outline'; // Importer les icônes outline
import ModalDeleteArticle from '@/components/Modal/ModalDeleteArticle';
import { Article } from '@/models/article'; 
import Link from 'next/link';

const ArticleListArrow: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const { articles: fetchedArticles, isPending, deleteArticle } = useArticles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Article; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        if (fetchedArticles) {
          setArticles(fetchedArticles);
        } else {
          setArticles([]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    loadArticles();
  }, [fetchedArticles]);

  const openModal = (article: Article) => {
    setArticleToDelete(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setArticleToDelete(null);
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteArticle(slug);
      setArticles(articles.filter(article => article.slug !== slug));
      closeModal();
    } catch (err) {
      setError('Failed to delete article');
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortConfig !== null) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key: keyof Article) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Article) => {
    if (!sortConfig) {
      return <ChevronDownIcon className="h-5 w-5 text-gray-400" />;
    }

    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? (
        <ChevronUpIcon className="h-5 w-5 text-primary" /> // Couleur primaire pour l'icône active
      ) : (
        <ChevronDownIcon className="h-5 w-5 text-primary" /> // Couleur primaire pour l'icône active
      );
    } else {
      return <ChevronDownIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <ModalDeleteArticle
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        article={articleToDelete}
      />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-3 px-4 border-b bg-terciaire text-white cursor-pointer" onClick={() => requestSort('title')}>
              <div className="flex items-center justify-between">
                Title {getSortIcon('title')}
              </div>
            </th>
            <th className="py-3 px-4 border-b bg-terciaire text-white cursor-pointer" onClick={() => requestSort('createdAt')}>
              <div className="flex items-center justify-between">
                Date {getSortIcon('createdAt')}
              </div>
            </th>
            <th className="py-3 px-6 border-b bg-terciaire text-white cursor-pointer" onClick={() => requestSort('views')}>
              <div className="flex items-center justify-between">
                Views {getSortIcon('views')}
              </div>
            </th>
            <th className="py-3 px-4 border-b bg-terciaire text-white cursor-pointer" onClick={() => requestSort('author')}>
              <div className="flex items-center justify-between">
                Author {getSortIcon('author')}
              </div>
            </th>
            <th className="py-3 px-6 border-b bg-terciaire text-white cursor-pointer" onClick={() => requestSort('likes')}>
              <div className="flex items-center justify-between">
                Likes {getSortIcon('likes')}
              </div>
            </th>
            <th className="py-3 px-4 border-b bg-terciaire text-white">Tags</th>
            <th className="py-3 px-4 border-b bg-terciaire text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedArticles.map((article, index) => (
            <tr key={article.slug} className={index % 2 === 0 ? 'bg-white' : 'bg-secondaire'}>
              <td className="font-semibold py-2 px-4 border-b">{article.title}</td>
              <td className="font-semibold py-2 px-4 border-b">{new Date(article.createdAt).toLocaleDateString()}</td>
              <td className="font-semibold py-2 px-6 border-b">{article.views}</td>
              <td className="font-semibold py-2 px-4 border-b">{article.author}</td>
              <td className="font-semibold py-2 px-6 border-b">{article.likes}</td>
              <td className="font-semibold py-2 px-4 border-b">{article.tags ? article.tags.join(', ') : ''}</td>
              <td className="font-semibold py-2 px-4 border-b">
                <div className="flex space-x-3">
                  <Link href={`/blog/${article.slug}`} passHref>
                    <EyeIcon className="h-5 w-5 text-blue-500 hover:text-blue-700 transition duration-300" />
                  </Link>
                  <button onClick={() => openModal(article)}>
                    <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-900 transition duration-300" /> 
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleListArrow;
