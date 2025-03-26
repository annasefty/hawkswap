import React from 'react';

const PhotoGrid = ({ filter }) => {
  const items = [
    { imgSrc: 'images.jpg', alt: 'Photo 1', label: 'Devpulse' },
    { imgSrc: 'photo2.jpg', alt: 'Photo 2', label: 'Linklinks' },
    { imgSrc: 'photo3.jpg', alt: 'Photo 3', label: 'Centizu' },
    { imgSrc: 'photo4.jpg', alt: 'Photo 4', label: 'Dynabox' },
    { imgSrc: 'photo5.jpg', alt: 'Photo 5', label: 'Avaveo' },
    { imgSrc: 'photo6.jpg', alt: 'Photo 6', label: 'Demivee' },
    { imgSrc: 'photo7.jpg', alt: 'Photo 7', label: 'Jayo' },
    { imgSrc: 'photo8.jpg', alt: 'Photo 8', label: 'Blognation' },
    { imgSrc: 'photo9.jpg', alt: 'Photo 9', label: 'Layo' },
  ];

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(filter)
  );

  return (
    <div className="photo-grid">
      {filteredItems.length > 0 ? (
        filteredItems.map((item, index) => (
          <div key={index}>
            <img src={item.imgSrc} alt={item.alt} />
            <p>{item.label}</p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>No results found.</p>
      )}
    </div>
  );
};

export default PhotoGrid;
