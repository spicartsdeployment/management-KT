import React, { useState, useRef, useEffect } from "react";

/**
 * CustomDropdown Component
 * Fully customizable dropdown with complete styling control
 * Replaces native <select> for better UX and design consistency
 */
export default function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  id, 
  testId,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(options.findIndex(opt => opt === value));
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(options[focusedIndex]);
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
      default:
        break;
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const focusedElement = listRef.current.children[focusedIndex];
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`sch-alu-custom-dropdown ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className="sch-alu-custom-dropdown__button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={id}
        data-testid={testId}
      >
        <span className="sch-alu-custom-dropdown__value">{value}</span>
        <svg 
          className={`sch-alu-custom-dropdown__arrow ${isOpen ? 'sch-alu-custom-dropdown__arrow--open' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <ul 
          ref={listRef}
          className="sch-alu-custom-dropdown__menu"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={`sch-alu-custom-dropdown__option ${
                option === value ? 'sch-alu-custom-dropdown__option--selected' : ''
              } ${
                index === focusedIndex ? 'sch-alu-custom-dropdown__option--focused' : ''
              }`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



