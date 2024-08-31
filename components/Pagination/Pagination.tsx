import React from 'react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalArticles: number;
  articlesPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, setCurrentPage, totalArticles, articlesPerPage }) => {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  if (totalPages <= 1) {
    return null; // N'affiche pas la pagination si une seule page
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button 
        onClick={handlePreviousPage} 
        disabled={currentPage === 1} 
        className="mx-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-terciaire disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <span className="mx-2 text-lg font-medium text-gray-700">
        {currentPage} / {totalPages}
      </span>
      <button 
        onClick={handleNextPage} 
        disabled={currentPage === totalPages} 
        className="mx-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-terciaire disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
