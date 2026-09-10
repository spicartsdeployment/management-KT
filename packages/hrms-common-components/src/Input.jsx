import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Input Component
 * Reusable input field with label, error handling, and icons
 * 
 * @param {string} className - Additional CSS classes
 * @param {string} type - Input type
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {ReactNode} leftIcon - Icon to show on the left
 * @param {ReactNode} rightIcon - Icon to show on the right
 * @param {string} variant - Input variant: 'default', 'glass'
 * @param {string} size - Input size: 'sm', 'default', 'lg'
 * @param {boolean} fullWidth - Whether input takes full width
 */
const Input = forwardRef(({
  className = '',
  type = 'text',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  ...props
}, ref) => {
  const baseClasses = 'block rounded-glass border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    default: 'bg-white dark:bg-dark-card border-light-border dark:border-dark-border text-light-text dark:text-dark-text focus:border-light-accent focus:ring-light-accent/20',
    glass: 'backdrop-blur-glass bg-white/50 dark:bg-dark-card/50 border-white/20 dark:border-white/10 text-light-text dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:border-light-accent focus:ring-light-accent/20'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  const errorClasses = error 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
    : '';
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={props.id || props.name || undefined}
          className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          id={props.id || props.name || undefined}
          className={clsx(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            widthClasses,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          data-testid={`common-field-${props.name || 'input'}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});


import PropTypes from 'prop-types';

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'glass']),
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  fullWidth: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string
};

Input.displayName = 'Input';

export default Input;
