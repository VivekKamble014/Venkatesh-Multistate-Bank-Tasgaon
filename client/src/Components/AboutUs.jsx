
import React from "react";
import "../styles/AboutUs.css"; // CSS for styling

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Us</h1>
        <p>
          <strong>Vyankateshwar Multistate Bank, Tasgaon Branch</strong>.
          We are committed to providing top-notch banking services to our customers.
        </p>
      </header>

      <section className="owner-section">
        <div className="owner-photo">
          <img
            src="/assets/ganesh-gawali.jpg" // Replace with actual path to the photo
            alt="Ganesh Gawali"
            className="owner-image"
          />
        </div>
        <div className="owner-details">
          <h2>Branch Owner</h2>
          <p className="owner-name">Ganesh Gawali</p>
          <p className="owner-contact">
            <strong>Contact:</strong> +91-8600543983
          </p>
          <p className="owner-email">
            <strong>Email:</strong> ganesh.gawali@example.com
          </p>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;