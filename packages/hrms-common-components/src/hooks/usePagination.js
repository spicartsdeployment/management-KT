import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for pagination
 * @param {Object} config - Pagination configuration
 * @param {Array} config.data - Array of data to paginate
 * @param {number} config.itemsPerPage - Number of items per page
 * @param {number} config.initialPage - Initial page number
 * @returns {Object} Pagination state and methods
 */
export const usePagination = ({
  data = [],
  itemsPerPage = 10,
  initialPage = 1
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
    };
  }, [currentPage, totalPages, itemsPerPage]);

  // Get current page data
  const currentData = useMemo(() => {
    const { startIndex, endIndex } = paginationInfo;
    return data.slice(startIndex, endIndex);
  }, [data, paginationInfo]);

  // Navigation functions
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [paginationInfo.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [paginationInfo.hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Generate page numbers for pagination component
  const getPageNumbers = useCallback((maxVisible = 5) => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    // Data
    currentData,
    
    // Pagination info
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    ...paginationInfo,
    
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    reset,
    
    // Utilities
    getPageNumbers,
  };
};
