// import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * Avatar Component
 * Displays user avatar with optional status indicator
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for image
 * @param {string} size - Avatar size: 'xs', 'sm', 'default', 'lg', 'xl'
 * @param {string} className - Additional CSS classes
 * @param {string} fallback - Fallback text when no image
 * @param {string} status - Status indicator: 'online', 'offline', 'busy', 'away'
 */
const Avatar = ({ 
  src, 
  alt, 
  size = 'default',
  className = '',
  fallback,
  status,
  ...props 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    default: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };
  
  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    default: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };
  
  return (
    <div className={clsx('relative inline-flex', className)} data-testid="common-avatar" {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div className={clsx(
          'rounded-full bg-gradient-to-br from-light-accent to-light-accent-hover flex items-center justify-center font-medium text-white',
          sizeClasses[size]
        )}>
          {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-dark-card',
            statusColors[status],
            statusSizes[size]
          )}
          data-testid={`common-avatar-status-${status}`}
        />
      )}
    </div>
  );
};


Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'default', 'lg', 'xl']),
  className: PropTypes.string,
  fallback: PropTypes.string,
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away'])
};

export default Avatar;
