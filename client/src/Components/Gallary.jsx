import React from 'react';
import '../styles/PhotoGallery.css';
import g1 from '../assets/g1.png';
import g2 from '../assets/g2.png';
import g3 from '../assets/g3.png';
import g4 from '../assets/g4.png';
import g5 from '../assets/g5.png';
import g6 from '../assets/g6.png';


export default function PhotoGallery() {
    const images = [g1, g2, g3, g4,g5, g6 ];

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