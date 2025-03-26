import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="wrap">
      <div className="search">
        <input
          type="text"
          className="searchTerm"
          placeholder="What are you looking for?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="searchButton">
        <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
};

export default Search;
