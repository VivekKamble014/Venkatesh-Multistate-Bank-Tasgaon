import React, { useState, useEffect } from "react";
import "../styles/ImageSlider.css";
import g1 from '../assets/g1.png';
import g2 from '../assets/g2.png';
import g3 from '../assets/g3.png';
import imgCopy2 from '../assets/image copy 2.png';
import imgCopy4 from '../assets/image copy 4.png';
import imgCopy from '../assets/image copy.png';

const ImageSlider = () => {
  const images = [g1, g2, g3, imgCopy2, imgCopy4, imgCopy];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      <div className="slider-content">
        <button className="arrow left-arrow" onClick={prevSlide}>
          &#8249;
        </button>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slider-image"
        />
        <button className="arrow right-arrow" onClick={nextSlide}>
          &#8250;
        </button>
      </div>
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;