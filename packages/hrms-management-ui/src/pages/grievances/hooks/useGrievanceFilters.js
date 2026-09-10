import React, { useCallback, useMemo } from 'react';
import { MOCK_GRIEVANCES } from '../grievancesMockData';

/**
 * useGrievanceFilters - Filter and sort grievances based on state
 * @param {Array} grievances - Full list of grievances
 * @param {Object} filters - Filter state
 * @param {Object} sort - Sort state
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Items per page
 * @returns {Object} Filtered/sorted grievances and pagination info
 */
export const useGrievanceFilters = (grievances = MOCK_GRIEVANCES, filters = {}, sort = {}, currentPage = 1, pageSize = 10) => {
  // Apply filters
  const filtered = useMemo(() => {
    return grievances.filter((grievance) => {
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          grievance.id.toLowerCase().includes(search) ||
          grievance.complainantName.toLowerCase().includes(search) ||
          grievance.title.toLowerCase().includes(search) ||
          grievance.description.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && grievance.category !== filters.category) return false;

      // Priority filter
      if (filters.priority && grievance.priority !== filters.priority) return false;

      // Status filter
      if (filters.status && grievance.status !== filters.status) return false;

      // Assigned to filter
      if (filters.assignedTo && grievance.assignedTo !== filters.assignedTo) return false;

      // Complainant type filter
      if (filters.complainantType && grievance.complainantType !== filters.complainantType) return false;

      // Date range filter
      if (filters.dateRange) {
        const createdDate = new Date(grievance.createdDate);
        if (filters.dateRange.from && createdDate < new Date(filters.dateRange.from)) return false;
        if (filters.dateRange.to && createdDate > new Date(filters.dateRange.to)) return false;
      }

      return true;
    });
  }, [grievances, filters]);

  // Apply sorting
  const sorted = useMemo(() => {
    const copy = [...filtered];
    const sortField = sort.field || 'createdDate';
    const sortOrder = sort.order || 'desc';

    copy.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle date fields
      if (sortField.includes('Date')) {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      // Handle null values
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Compare values
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return copy;
  }, [filtered, sort]);

  // Apply pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedData = sorted.slice(startIdx, startIdx + pageSize);

  return {
    data: paginatedData,
    total: sorted.length,
    totalPages,
    currentPage,
    pageSize,
    filtered,
    sorted,
  };
};

/**
 * useGrievanceSorting - Handle column sorting
 * @returns {Object} Sort state and handlers
 */
export const useGrievanceSorting = (initialSort = { field: 'createdDate', order: 'desc' }) => {
  const [sort, setSort] = React.useState(initialSort);

  const handleSort = useCallback((field) => {
    setSort((prevSort) => {
      if (prevSort.field === field) {
        // Toggle order if same field
        return { field, order: prevSort.order === 'asc' ? 'desc' : 'asc' };
      }
      // New field, default to descending
      return { field, order: 'desc' };
    });
  }, []);

  return { sort, handleSort };
};

/**
 * useGrievanceSearch - Debounced search handler
 * @param {Function} onSearch - Callback when search changes
 * @param {number} debounceMs - Debounce delay in ms
 * @returns {Object} Search state and handlers
 */
export const useGrievanceSearch = (onSearch, debounceMs = 300) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const debounceTimer = React.useRef(null);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
  }, [onSearch, debounceMs]);

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return { searchTerm, handleSearchChange };
};
