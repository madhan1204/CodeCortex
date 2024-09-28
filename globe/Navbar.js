// Navbar.js
import React from 'react';
import './Navbar.css'; // Create a separate CSS file for the navbar styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Ecochill</h1>
      <div className="navbar-links">
        <a href="#home">Home</a>
        <a href="#load-calculation">Load Calculation</a>
        <a href="#contact-us">Contact Us</a>
      </div>
    </nav>
  );
};

export default Navbar;
