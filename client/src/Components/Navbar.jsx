import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from '../assets/vyanklogo.png'

export default function Navbar() {
    const [isMenuActive, setIsMenuActive] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check the user's theme preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.body.classList.add('dark-mode'); // Apply dark mode to the body
        } else {
            setIsDarkMode(false);
            document.body.classList.remove('dark-mode'); // Remove dark mode if it's not set
        }
    }, []);

    // Toggle the theme between dark and light mode
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Save theme preference to localStorage
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Save theme preference to localStorage
        }
    };

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
                    <Link to="/" onClick={() => setIsMenuActive(false)}>Home</Link>
                    <Link to="/login" onClick={() => setIsMenuActive(false)}>Login / Ragister</Link>
                </div>
                {/* <button className="theme-toggle" onClick={toggleTheme}>
                    {isDarkMode ? '🌞' : '🌙'}
                </button> */}
            </nav>
        </>
    );
}