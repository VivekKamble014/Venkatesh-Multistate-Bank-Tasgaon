import React, { useState } from 'react';
import '../styles/PhotoGallery.css';
import g1 from '../assets/g1.png';
import g2 from '../assets/g2.png';
import g3 from '../assets/g3.png';
import imgCopy2 from '../assets/image copy 2.png';
import imgCopy4 from '../assets/image copy 4.png';
import imgCopy from '../assets/image copy.png';

export default function PhotoGallery() {
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const photos = [g1, g2, g3, imgCopy2, imgCopy4, imgCopy];


    const openPhoto = (photo) => {
        setSelectedPhoto(photo);
    };

    const closePhoto = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="photo-gallery">
            <h1>Photo Gallery</h1>
            <div className="gallery-grid">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className="gallery-photo"
                        onClick={() => openPhoto(photo)}
                    />
                ))}
            </div>

            {selectedPhoto && (
                <div className="photo-modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={closePhoto}>&times;</span>
                        <img src={selectedPhoto} alt="Selected" className="modal-photo" />
                    </div>
                </div>
            )}
        </div>
    );
}