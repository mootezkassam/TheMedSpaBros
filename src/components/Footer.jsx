import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <img src="/logo.png" alt="The MedSpa Bros" className="footer__logo" />
      <p className="footer__tagline">
        Two Brothers. One Obsession. Full Schedules.
      </p>
      <nav className="footer__nav">
        <a href="#problem">Why Us</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#results">Results</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
        <a href="/book">Book Free Audit</a>
      </nav>
      <p className="footer__copy">
        © {new Date().getFullYear()} The Medspa Bros. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
