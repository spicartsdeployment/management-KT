import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import '../../../assets/scss/Communication.scss';

/**
 * SearchBar - Search contacts with fixed height (no layout shift on focus)
 */
const SearchBar = ({ search, setSearch }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  
  return (
    <div className="search-bar">
      <div className={`search-bar__input-wrapper ${isFocused ? 'search-bar__input-wrapper--focused' : ''}`}>
        <MagnifyingGlassIcon className="search-bar__icon" />
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search contacts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          data-testid="school-input-search-contacts"
        />
      </div>
    </div>
  );
};

export default SearchBar;
