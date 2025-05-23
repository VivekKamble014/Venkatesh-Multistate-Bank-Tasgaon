import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import PhotoGallery from "../Components/Gallary";
import ownerimg from "../assets/owner.png";
import ImageSlider from "../Components/ImageSlider";
import BankImg from "../assets/multiwork.png"

import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMailBulk, FaVoicemail } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      <div className="home-container">
      <header className="hero-section">
    
        <div className="buttons-container">
          <h1>Welcome to </h1>
          <h1>Venkatesh Multistate Bank, Tasgaon</h1>
         

      </div>
    </header>
    <section className="owner-section">
      <div className="owner-container">
        {/* Owner Image */}
        <div className="owner-image">
          <img src={ownerimg} alt="Owner" />
        </div>

        {/* Owner Description */}
        <div className="owner-description">
          <h2>Meet Our Branch Owner</h2>
          <h3>Mr. Ganesh M. Gawali</h3>
          <p>
          Mr. Ganesh M. Gawali is the esteemed branch owner of Venkatesh Multistate Bank, Tasgaon Branch, renowned for his visionary leadership and dedication to financial excellence. With extensive experience in the banking and finance sector, he has been instrumental in shaping the bank’s success and delivering top-tier financial services to the community
          </p>
          <p>
          His commitment to customer-centric banking solutions and technological innovation has made banking more accessible, secure, and efficient for individuals and businesses alike. Under his leadership, the Tasgaon branch has flourished, offering trustworthy financial solutions tailored to meet the diverse needs of customers.
          </p>
          <p>
          Driven by a mission to foster financial growth and stability, Mr. Gawali continues to lead Venkatesh Multistate Bank, Tasgaon Branch, with a focus on integrity, transparency, and excellence, ensuring a prosperous future for all.
          </p>
        </div>
      </div>
    </section>


    <section>
      <PhotoGallery/>
    </section>
    <section id="Aboutus" className="about-section">
      <div className="about-container">
        {/* Left Div - Image */}
        <div className="about-image">
          <img src={BankImg} alt="Bank Building" />
        </div>

        {/* Right Div - Text Content */}
        <div className="about-content">
          <h2>About Venkatesh Multistate Bank</h2>
          <p>
            Established with a vision to provide secure and innovative banking solutions, 
            Venkatesh Multistate Bank has been serving customers with dedication and integrity. 
          </p>
          <ul>
            <li>🏦 Trusted Financial Institution</li>
            <li>📈 Innovative Digital Banking</li>
            <li>👨‍💼 Personalized Customer Service</li>
            <li>💳 Secure & Fast Transactions</li>
          </ul>
          <a href="https://venkateshmultistate.com/" target="blank"><button className="learn-more">Learn More</button></a>
          
        </div>
      </div>
    </section>


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
            Venkatesh Multistate Bank, Tasgaon Branch, <br />
            Main Street, Tasgaon, Maharashtra, India.
          </p>
        </section>

    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          
          {/* Left Section - Bank Info */}
          <div className="footer-section about">
            <h2>Venkatesh Multistate Bank</h2>
            <p>Reliable & secure banking services for individuals and businesses.</p>
            <p>© 2025 Venkatesh Multistate Bank. All Rights Reserved.</p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">AboutUs</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Right Section - Contact Info */}
          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>📍 Tasgaon, Maharashtra, India</p>
            <p>📞 +91 8600543983</p>
            <p>✉️ venkateshmultistatetasgaon@vyanketeshbank.com</p>
          </div>

        </div>

        {/* Social Media Section */}
        <div className="footer-social">
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>
    </footer>

      </div>
    </div>
  );
};

export default Home;