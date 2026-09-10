import React from 'react';
import clsx from 'clsx';

/**
 * LoadingSpinner Component
 * Displays animated loading spinner
 * 
 * @param {string} size - Spinner size: 'sm', 'default', 'lg', 'xl'
 * @param {string} className - Additional CSS classes
 * @param {boolean} fullScreen - Whether to display as full-screen overlay
 */
const LoadingSpinner = ({ size = 'default', className = '', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    default: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4'
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-light-bg dark:bg-dark-bg z-50" data-testid="common-spinner-fullscreen">
        <div className="text-center">
          <div className={clsx(
            'animate-spin rounded-full border-gray-300 border-t-light-accent mx-auto',
            sizeClasses[size]
          )} />
          <p className="mt-4 text-light-text-secondary dark:text-dark-text-secondary">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={clsx('flex items-center justify-center p-4', className)} data-testid="common-spinner">
      <div className={clsx(
        'animate-spin rounded-full border-gray-300 border-t-light-accent',
        sizeClasses[size]
      )} />
    </div>
  );
};

import PropTypes from 'prop-types';

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'default', 'lg', 'xl']),
  className: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;
