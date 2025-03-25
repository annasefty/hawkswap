import React from 'react';
import { Link } from 'react-router-dom';

const ListItem = () => {
  return (
    <div>
      <h2>List an Item</h2>
      <p>Here you can list items you want to swap.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default ListItem;
