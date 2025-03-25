import React, { useState } from 'react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section>
      <div className="wrap">
        <div className="search">
          <input
            type="text"
            className="searchTerm"
            placeholder="What are you looking for?"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit" className="searchButton">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Search;
