import React, { useState } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/vyanklogo.png'

export default function Navbar() {
    const [isMenuActive, setIsMenuActive] = useState(false);

 
    // Toggle the mobile menu
    const toggleMenu = () => {
        setIsMenuActive(!isMenuActive);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-brand">
                    <img src={logo}></img>
                </div>
                <div className="menu-toggle" id="mobile-menu" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={`navbar-menu ${isMenuActive ? 'active' : ''}`} id="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/">About</Link>
                    <Link to="/">Contact</Link>
                    
                    <Link to="/login" onClick={() => setIsMenuActive(false)}>Login / Ragister</Link>
                </div>
                
            </nav>
        </>
    );
}