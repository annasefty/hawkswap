import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="title">HAWKSWAP MARKETPLACE</h1>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/listitem">List an Item</Link></li>
          </ul>
        </nav>
      </div>
    </header>

  );
};

export default Header;
