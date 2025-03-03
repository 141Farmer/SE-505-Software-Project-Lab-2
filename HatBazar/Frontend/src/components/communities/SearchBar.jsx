// components/SearchBar/SearchBar.jsx
import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, className }) => {
  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search posts..."
        className="border p-2 w-1/2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;