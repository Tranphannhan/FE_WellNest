import React from 'react';
import './Pagination.css';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Hàm tạo mảng page hiển thị
  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Hiện hết các trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // totalPages > 5
      if (currentPage <= 3) {
        // Hiện 1 2 3 ... totalPages
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Hiện 1 ... totalPages-2 totalPages-1 totalPages
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Hiện 1 ... currentPage ... totalPages
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="pagination">
      <button
        className="nav-button"
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        Quay lại
      </button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="dots">
              ...
            </span>
          );
        } else {
          return (
            <button
              key={page}
              className={`page-button ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageClick(page as number)}
            >
              {page}
            </button>
          );
        }
      })}

      <button
        className="nav-button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        Tiếp
      </button>
    </div>
  );
};

export default Pagination;
