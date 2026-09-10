import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

/**
 * CustomDropdown Component
 * Fully customizable dropdown with complete styling control
 * Replaces native <select> for better UX and design consistency
 */

function useClickOutside(ref, onClose) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClose]);
}

function useScrollFocused(listRef, focusedIndex, isOpen) {
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && listRef.current) {
      const el = listRef.current.children[focusedIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, isOpen, listRef]);
}

function handleOpenKeyDown(e, options, value, setIsOpen, setFocusedIndex) {
  if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
    e.preventDefault();
    setIsOpen(true);
    setFocusedIndex(options.findIndex((opt) => opt.value === value));
  }
}

function handleNavigationKey(e, key, options, setFocusedIndex, setIsOpen, buttonRef) {
  if (key === "Escape") {
    e.preventDefault(); setIsOpen(false); setFocusedIndex(-1); buttonRef.current?.focus();
  } else if (key === "ArrowDown") {
    e.preventDefault(); setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
  } else if (key === "ArrowUp") {
    e.preventDefault(); setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
  } else if (key === "Home") {
    e.preventDefault(); setFocusedIndex(0);
  } else if (key === "End") {
    e.preventDefault(); setFocusedIndex(options.length - 1);
  }
}

function handleClosedKeyDown(e, options, focusedIndex, handleSelect, setIsOpen, setFocusedIndex, buttonRef) {
  const navKeys = ["Escape", "ArrowDown", "ArrowUp", "Home", "End"];
  if (navKeys.includes(e.key)) {
    handleNavigationKey(e, e.key, options, setFocusedIndex, setIsOpen, buttonRef);
    return;
  }
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (focusedIndex >= 0) handleSelect(options[focusedIndex].value);
  }
}

function DropdownArrow({ isOpen }) {
  return (
    <svg
      className={`custom-dropdown__arrow ${isOpen ? "custom-dropdown__arrow--open" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

DropdownArrow.propTypes = { isOpen: PropTypes.bool.isRequired };

function DropdownOption({ option, isSelected, isFocused, index, onSelect, onHover }) {
  return (
    <li
      role="option"
      aria-selected={isSelected}
      className={`custom-dropdown__option ${isSelected ? "custom-dropdown__option--selected" : ""} ${isFocused ? "custom-dropdown__option--focused" : ""}`}
      onClick={() => onSelect(option.value)}
      onMouseEnter={() => onHover(index)}
    >
      {option.label}
    </li>
  );
}

DropdownOption.propTypes = {
  option: PropTypes.shape({ value: PropTypes.string, label: PropTypes.string }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
};

function DropdownMenu({ listRef, id = undefined, options, value = undefined, focusedIndex, onSelect, onHover }) {
  return (
    <ul ref={listRef} className="custom-dropdown__menu" role="listbox" aria-labelledby={id}>
      {options.map((option, index) => (
        <DropdownOption
          key={option.value}
          option={option}
          isSelected={option.value === value}
          isFocused={index === focusedIndex}
          index={index}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </ul>
  );
}

DropdownMenu.propTypes = {
  listRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  id: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  value: PropTypes.string,
  focusedIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
};

function useDropdown({ value, onChange, options, id, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const close = useCallback(() => { setIsOpen(false); setFocusedIndex(-1); }, []);
  useClickOutside(dropdownRef, close);
  useScrollFocused(listRef, focusedIndex, isOpen);
  const handleSelect = (optionValue) => {
    onChange({ target: { name: id, value: optionValue } });
    setIsOpen(false); setFocusedIndex(-1); buttonRef.current?.focus();
  };
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!isOpen) { handleOpenKeyDown(e, options, value, setIsOpen, setFocusedIndex); return; }
    handleClosedKeyDown(e, options, focusedIndex, handleSelect, setIsOpen, setFocusedIndex, buttonRef);
  };
  return { isOpen, setIsOpen, focusedIndex, setFocusedIndex, dropdownRef, buttonRef, listRef, handleSelect, handleKeyDown };
}

export default function CustomDropdown({ value = undefined, onChange, options, id = undefined, testId = undefined, className = "", disabled = false, placeholder = "Select an option" }) {
  const { isOpen, setIsOpen, focusedIndex, dropdownRef, buttonRef, listRef, handleSelect, handleKeyDown } =
    useDropdown({ value, onChange, options, id, disabled });
  const displayValue = options.find((opt) => opt.value === value)?.label || placeholder;
  return (
    <div ref={dropdownRef} className={`custom-dropdown ${className} ${disabled ? "custom-dropdown--disabled" : ""}`} onKeyDown={handleKeyDown}>
      <button
        ref={buttonRef} id={id} type="button" className="custom-dropdown__button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={id}
        data-testid={testId} disabled={disabled}
      >
        <span className={`custom-dropdown__value ${!value ? "custom-dropdown__value--placeholder" : ""}`}>
          {displayValue}
        </span>
        <DropdownArrow isOpen={isOpen} />
      </button>
      {isOpen && !disabled && (
        <DropdownMenu listRef={listRef} id={id} options={options} value={value}
          focusedIndex={focusedIndex} onSelect={handleSelect} onHover={(i) => { /* handled by hook */ void i; }}
        />
      )}
    </div>
  );
}

CustomDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })).isRequired,
  id: PropTypes.string,
  testId: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};
