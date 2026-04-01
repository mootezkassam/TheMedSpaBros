import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container navbar__inner">
        <a href="#hero" className="navbar__logo-link">
          <img
            src="/logo.png"
            alt="The MedSpa Bros"
            className="navbar__logo"
          />
        </a>

        <div className="navbar__links">
          <a href="#problem">Why Us</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#results">Results</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#contact" className="navbar__cta">Book Free Audit →</a>
        </div>

        {/* Hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="hamburger-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {['#problem', '#how-it-works', '#results', '#pricing', '#faq'].map((href, i) => (
              <a key={i} href={href} onClick={() => setMenuOpen(false)}>
                {href.replace('#', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </a>
            ))}
            <a href="#contact" className="navbar__cta" onClick={() => setMenuOpen(false)}>
              Book Free Audit →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
