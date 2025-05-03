import React, { useState } from 'react';
import galleryBackground from "../../assets/img/gallery-background.jpg";

const ImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="image-gallery">
    <img id="galleryBackground" src={galleryBackground} alt="starry background"></img>
      <button onClick={goToPrevious} className="left-arrow">{'<'}</button>
      <div className="image-container">
        <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
      </div>
      <button onClick={goToNext} className="right-arrow">{'>'}</button>
    </div>
  );
};

export default ImageGallery;
