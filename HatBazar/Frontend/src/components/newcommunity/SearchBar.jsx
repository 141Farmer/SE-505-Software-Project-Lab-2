import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, className }) => {
  return (
    <input
      type="text"
      placeholder="Search posts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    />
  );
};

export default SearchBar;
