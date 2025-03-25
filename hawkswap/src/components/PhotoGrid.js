import React from 'react';

const PhotoGrid = () => {
  const items = [
    { imgSrc: 'images.jpg', alt: 'Photo 1', label: 'Item 1' },
    { imgSrc: 'photo2.jpg', alt: 'Photo 2', label: 'Item 2' },
    { imgSrc: 'photo3.jpg', alt: 'Photo 3', label: 'Item 3' },
    { imgSrc: 'photo4.jpg', alt: 'Photo 4', label: 'Item 4' },
    { imgSrc: 'photo5.jpg', alt: 'Photo 5', label: 'Item 5' },
    { imgSrc: 'photo6.jpg', alt: 'Photo 6', label: 'Item 6' },
    { imgSrc: 'photo7.jpg', alt: 'Photo 7', label: 'Item 7' },
    { imgSrc: 'photo8.jpg', alt: 'Photo 8', label: 'Item 8' },
    { imgSrc: 'photo9.jpg', alt: 'Photo 9', label: 'Item 9' },
  ];

  return (
    <div className="photo-grid">
      {items.map((item, index) => (
        <div key={index}>
          <img src={item.imgSrc} alt={item.alt} />
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
