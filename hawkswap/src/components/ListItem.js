import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Popup from './Popup';
import '../Listitem.css';

const ListItem = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImage, setItemImage] = useState(null);
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = async () => {
    if (!itemImage) {
      setError('Please select an image to upload.');
      return null;
    }

    try {
      const extension = itemImage.name.split('.').pop().toLowerCase();
      const allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      if (!allowedFormats.includes(extension)) {
        setError('Please upload an image in JPG, PNG, GIF, or WebP format.');
        return null;
      }

      const filePath = `users/${user.uid}/${Date.now()}_${itemImage.name}`;
      const storageRef = ref(storage, filePath);
      const metadata = {
        contentType: `image/${extension === 'jpg' ? 'jpeg' : extension}`,
        customMetadata: {
          uploadedBy: user.email,
          uploadTime: new Date().toISOString()
        }
      };

      const snapshot = await uploadBytes(storageRef, itemImage, metadata);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      return null;
    }
  };

  const validatePrice = (price) => {
    const priceFloat = parseFloat(price);
    return !isNaN(priceFloat) && priceFloat >= 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePrice(itemPrice)) {
      setError('Please enter a valid price.');
      setLoading(false);
      return;
    }

    try {
      const imageUrl = await handleImageUpload();
      if (!imageUrl) {
        setLoading(false);
        return;
      }

      const itemData = {
        name: itemName,
        description: itemDescription,
        category: itemCategory,
        price: parseFloat(itemPrice),
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        sellerName: user.displayName || 'Anonymous',
        sellerPhotoUrl: user.photoURL,
        createdAt: new Date(),
        status: 'available',
      };

      await addDoc(collection(db, 'items'), itemData);

      setItemName('');
      setItemDescription('');
      setItemCategory('');
      setItemPrice('');
      setItemImage(null);
      setPopupMessage('Item listed successfully!');
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePopupClose = () => {
    setPopupMessage('');
    window.location.reload();
  };

  return (
    <div className="fullscreen-form-wrapper">
      <div className="list-item-form">
        <h1>List an Item</h1>
        {error && <p className="error-message">{error}</p>}
        {popupMessage && <Popup message={popupMessage} onClose={handlePopupClose} />}
        {!user ? (
          <p className="error-message">You must be logged in to list an item.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group-row centered-inputs">
              <div className="form-group">
                <label htmlFor="itemName">Item Name</label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="itemPrice">Price ($)</label>
                <input
                  type="number"
                  id="itemPrice"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="itemDescription">Item Description</label>
              <textarea
                id="itemDescription"
                value={itemDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setItemDescription(e.target.value);
                  }
                }}
                required
              ></textarea>

              <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.25rem' }}>
                {itemDescription.length} / 200 characters
              </p>


            </div>
            <div className="form-group">
              <label htmlFor="itemCategory">Category</label>
              <select
                id="itemCategory"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="itemImage">Upload Image</label>
              <input
                type="file"
                id="itemImage"
                accept="image/*"
                onChange={(e) => setItemImage(e.target.files[0])}
                required
              />
            </div>
            {itemImage && (
              <div className="image-preview">
                <img src={URL.createObjectURL(itemImage)} alt="Preview" />
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? <span className="loader"></span> : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ListItem;
