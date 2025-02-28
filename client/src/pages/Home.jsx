import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import PhotoGallery from "../Components/Gallary";
import AboutUs from "../Components/AboutUs";
import ImageSlider from "../Components/ImageSlider";

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <header className="hero-section text-center text-white">
          <div className="container" style={{ color: 'black', margin: '0', padding: '0' }}>
            <h1>Welcome to Vyanketesh Multistate Bank Tasgaon Branch</h1>
          </div>
        </header>

        <AboutUs/>
        <ImageSlider/>
        <PhotoGallery />


        {/* Location Section */}
        <section className="location-section">
          <h2 className="location-title">Our Location</h2>
          <div className="map-container">
            <iframe
              title="Office Location"
            
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d815.6739702626094!2d74.60142920848477!3d17.03501125406033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1737453145071!5m2!1sen!2sin" 
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <iframe src="https://www.google.com/maps/embed?pb=!4v1737452961160!6m8!1m7!1sQ7TjGkCtVDW-qFAzG4vgkA!2m2!1d17.0352520149077!2d74.60086870713032!3f247.5841!4f0!5f0.7820865974627469"   ></iframe>
         
          </div>
          <p className="location-address">
            Vyanketesh Multistate Bank, Tasgaon Branch, <br />
            Main Street, Tasgaon, Maharashtra, India.
          </p>
        </section>

      </div>
    </div>
  );
};

export default Home;