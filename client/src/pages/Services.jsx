import React from "react";
import "../styles/Services.css";

export default function Services() {
  const services = [
    {
      title: "Savings Account",
      description: "Secure your money and earn interest with our flexible savings accounts.",
    },
    {
      title: "Current Account",
      description: "Manage your business transactions efficiently with our current account services.",
    },
    {
      title: "Fixed Deposits",
      description: "Grow your savings with our high-interest fixed deposit plans.",
    },
    {
      title: "Loan Services",
      description: "Avail loans for personal, home, and business needs at competitive rates.",
    },
    {
      title: "Internet Banking",
      description: "Access your accounts anytime, anywhere with our secure online banking platform.",
    },
    {
      title: "Mobile Banking",
      description: "Manage your finances on the go with our user-friendly mobile app.",
    },
    {
      title: "ATM Services",
      description: "Withdraw cash and access your account 24/7 with our extensive ATM network.",
    },
  ];

  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Our Services</h1>
        <p>Discover a range of financial services tailored to meet your needs.</p>
      </header>
      <div className="services-container">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}