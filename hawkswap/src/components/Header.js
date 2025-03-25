import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Hawk Swap</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>  {/* Link to home page */}
          <li><Link to="/about">About</Link></li>
          <li><Link to="/listanitem">List an Item</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
