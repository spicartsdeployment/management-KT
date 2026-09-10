import React from 'react';
import clsx from 'clsx';
import './assets/scss/Card.scss';

/**
 * Card Component
 * Reusable card wrapper with consistent styling and variants
 * 
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Card variant: 'default', 'glass', 'elevated'
 * @param {string} padding - Padding size: 'none', 'sm', 'default', 'lg'
 * @param {function} onClick - Optional click handler
 * @param {object} props - Additional props passed to div
 */
const Card = ({ 
  children, 
  className = '', 
  variant = 'default', // 'default', 'glass', 'elevated'
  padding = 'default', // 'none', 'sm', 'default', 'lg'
  onClick,
  ...props 
}) => {
  // Converted from Tailwind: rounded-glass transition-all duration-300
  const baseClasses = 'common-card-base';
  
  // Converted from Tailwind variant classes
  const variantClasses = {
    default: 'common-card-default',
    glass: 'common-card-glass',
    elevated: 'common-card-elevated'
  };
  
  // Converted from Tailwind: p-4, p-6, p-8
  const paddingClasses = {
    none: '',
    sm: 'common-card-padding-sm',
    default: 'common-card-padding-default',
    lg: 'common-card-padding-lg'
  };
  
  // Converted from Tailwind: cursor-pointer hover:shadow-lg hover:scale-[1.02]
  const hoverClasses = onClick ? 'common-card-clickable' : '';
  
  return (
    <div
      className={clsx(
        'card',
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      onClick={onClick}
      data-testid="common-card"
      {...props}
    >
      {children}
    </div>
  );
};


import PropTypes from 'prop-types';

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'glass', 'elevated']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  onClick: PropTypes.func
};

export default Card;
