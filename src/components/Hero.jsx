import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WebGLShader } from './ui/web-gl-shader';
import './Hero.css';

const Hero = () => {
  const tickerRef = useRef(null);

  const stats = [
    '3-5x ROAS Average',
    '$23 Cost Per Lead',
    '68 New Patients/Month',
    '4.2x ROAS Month One',
    '$127K Month',
    'Month-to-Month Only',
    'No Contracts. Ever.',
    '48-Hour Lead Delivery',
  ];

  return (
    <section className="hero" id="hero">
      {/* WebGL animated line background */}
      <WebGLShader className="absolute inset-0 w-full h-full block" />

      {/* Overlay to keep text crisp — very subtle fade from white */}
      <div className="hero__shader-overlay" />

      {/* Floating background shapes */}
      <div className="hero__bg-shape hero__bg-shape--1" />
      <div className="hero__bg-shape hero__bg-shape--2" />

      <div className="container hero__content">
        <motion.div
          className="hero__badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="hero__badge-dot" />
          Paid Ads. Medspas Only.
        </motion.div>

        <motion.h1
          className="hero__headline"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          We Fill MedSpas.
          <br />
          <span className="hero__headline--accent">That's It.</span>
        </motion.h1>

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          Two brothers. One obsession. We run paid ads exclusively for medspas —
          and we're really fucking good at it. No SEO packages. No social media
          management. No fluff. Just ads that put patients in your chair.
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <a href="/book" className="btn-primary" id="hero-cta-book">
            Book Your Free Ad Audit →
          </a>
          <a href="#how-it-works" className="hero__cta-ghost" id="hero-cta-learn">
            See how it works
          </a>
        </motion.div>

        <motion.p
          className="hero__proof"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          Currently managing <strong>$500,000+/mo</strong> in medspa ad spend.
          Average client sees <strong>3–5× ROAS</strong> in 90 days.
        </motion.p>
      </div>

      {/* Animated ticker */}
      <motion.div
        className="hero__ticker"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="hero__ticker-track" ref={tickerRef}>
          {[...stats, ...stats].map((s, i) => (
            <span key={i} className="hero__ticker-item">
              {s} <span className="hero__ticker-dot">✦</span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
