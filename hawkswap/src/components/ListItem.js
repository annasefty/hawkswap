import React, { useState } from 'react';
import '../Listitem.css'; // Update the path to the CSS file

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('school supplies'); // Add state for item category
  const [itemImage, setItemImage] = useState(null); // Add state for item image

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Item listed:', { itemName, itemDescription, itemPrice, itemCategory, itemImage });
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  return (
    <div className="list-item-container">
      <h1>List an Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Description:</label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Price:</label>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Category:</label>
          <select
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
          >
            <option value="school supplies">School Supplies</option>
            <option value="furniture">Furniture</option>
            <option value="clothes">Clothes</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Item Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">List Item</button>
      </form>
    </div>
  );
};

export default ListItem;