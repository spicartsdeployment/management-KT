import React from 'react';
import clsx from 'clsx';

/**
 * Skeleton Component
 * Displays loading placeholder with animation
 * 
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Skeleton variant: 'text', 'rectangular', 'circular'
 * @param {string|number} width - Skeleton width
 * @param {string|number} height - Skeleton height
 * @param {number} lines - Number of lines for text variant
 * @param {string} animation - Animation type: 'pulse', 'wave'
 */
const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animation = 'pulse',
  ...props 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse-slow'
  };
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-glass',
    circular: 'rounded-full'
  };
  
  const style = {
    width: width || undefined,
    height: height || undefined,
  };
  
  if (variant === 'text') {
    return (
      <div className="space-y-2" data-testid="common-skeleton-text">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              animationClasses[animation],
              variantClasses[variant],
              'h-4',
              index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div
      className={clsx(
        baseClasses,
        animationClasses[animation],
        variantClasses[variant],
        !width && !height && {
          'h-4': variant === 'text',
          'h-12': variant === 'rectangular',
          'h-10 w-10': variant === 'circular'
        },
        className
      )}
      style={style}
      data-testid={`common-skeleton-${variant}`}
      {...props}
    />
  );
};

/**
 * SkeletonCard - Preset skeleton for card layout
 */
export const SkeletonCard = ({ className = '', ...props }) => (
  <div className={clsx('p-6 space-y-4', className)} data-testid="common-skeleton-card" {...props}>
    <Skeleton variant="rectangular" height="200px" />
    <Skeleton variant="text" lines={2} />
    <div className="flex space-x-4">
      <Skeleton variant="circular" width="40px" height="40px" />
      <div className="flex-1">
        <Skeleton variant="text" lines={1} />
      </div>
    </div>
  </div>
);

/**
 * SkeletonTable - Preset skeleton for table layout
 */
export const SkeletonTable = ({ rows = 5, columns = 4, className = '', ...props }) => (
  <div className={clsx('space-y-3', className)} data-testid="common-skeleton-table" {...props}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" height="20px" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" height="16px" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * SkeletonWidget - Preset skeleton for widget layout
 */
export const SkeletonWidget = ({ className = '', ...props }) => (
  <div className={clsx('p-4 space-y-3', className)} data-testid="common-skeleton-widget" {...props}>
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="120px" height="20px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
    <Skeleton variant="text" width="80px" height="32px" />
    <Skeleton variant="rectangular" height="60px" />
  </div>
);

import PropTypes from 'prop-types';

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['text', 'rectangular', 'circular']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lines: PropTypes.number,
  animation: PropTypes.oneOf(['pulse', 'wave'])
};

export const SkeletonCardPropTypes = {
  className: PropTypes.string
};
export const SkeletonTablePropTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  className: PropTypes.string
};
export const SkeletonWidgetPropTypes = {
  className: PropTypes.string
};

SkeletonCard.propTypes = SkeletonCardPropTypes;
SkeletonTable.propTypes = SkeletonTablePropTypes;
SkeletonWidget.propTypes = SkeletonWidgetPropTypes;

export default Skeleton;
