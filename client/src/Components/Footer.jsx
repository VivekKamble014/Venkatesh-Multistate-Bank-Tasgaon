import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Vyankateshwar Multistate Bank</h3>
          <p>Empowering financial solutions for all your needs.</p>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>Email: contact@vyankateshwarbank.com</li>
            <li>Phone: +91 8600543983</li>
            <li>Address: Tasgaon, Maharashtra, India</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">About Us</a></li>
            <li><a href="/Services">Services</a></li>
            <li><a href="/Services">Services</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Vyankateshwar Multistate Bank | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;