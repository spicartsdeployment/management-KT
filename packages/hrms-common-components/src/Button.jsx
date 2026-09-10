import PropTypes from 'prop-types';
// import React from 'react';
import clsx from 'clsx';

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 * 
 * @param {ReactNode} children - Button content
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Button variant: 'primary', 'secondary', 'ghost', 'glass'
 * @param {string} size - Button size: 'sm', 'default', 'lg'
 * @param {boolean} disabled - Whether button is disabled
 * @param {boolean} loading - Whether button is in loading state
 * @param {boolean} fullWidth - Whether button takes full width
 * @param {ReactNode} leftIcon - Icon to show on the left
 * @param {ReactNode} rightIcon - Icon to show on the right
 * @param {function} onClick - Click handler
 * @param {string} type - Button type attribute
 */
const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-glass font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-light-accent hover:bg-light-accent-hover text-white focus:ring-light-accent/50',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100 focus:ring-gray-500/50',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300 focus:ring-gray-500/50',
    glass: 'backdrop-blur-glass bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-white/20 focus:ring-white/50'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClasses,
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      data-testid={`common-button-${variant}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'glass']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.string,
};
