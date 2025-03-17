import React from 'react';
import '../styles/PhotoGallery.css';
import g1 from '../assets/g1.png';
import g2 from '../assets/g2.png';
import g3 from '../assets/g3.png';
import imgCopy2 from '../assets/image copy 2.png';
import imgCopy4 from '../assets/image copy 4.png';
import imgCopy from '../assets/image copy.png';

export default function PhotoGallery() {
    const images = [g1, g2, g3, imgCopy2 ];

    return (
        <section className="gallery-section">
            <h2>Our Bank Gallery</h2>
            <div className="gallery-grid">
                {images.map((img, index) => (
                    <div key={index} className="gallery-item">
                        <img src={img} alt={`Gallery ${index + 1}`} />
                    </div>
                ))}
            </div>
        </section>
    );
}