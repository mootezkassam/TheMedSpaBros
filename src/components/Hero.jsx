import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const FRAME_COUNT = 121;

const Hero = () => {
  const tickerRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(-1);
  const tickingRef = useRef(false);
  const [framesLoaded, setFramesLoaded] = useState(false);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    const drawFrame = (index) => {
      const img = framesRef.current[index];
      if (!img || !img.complete) return;
      const cw = canvas.width;
      const ch = canvas.height;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cw, ch);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW, drawH, drawX, drawY;

      if (window.innerWidth > 768) {
        if (canvasRatio > imgRatio) {
          drawW = cw; drawH = cw / imgRatio;
        } else {
          drawH = ch; drawW = ch * imgRatio;
        }
      } else {
        const zoom = 1.15;
        if (canvasRatio > imgRatio) {
          drawH = ch * zoom; drawW = drawH * imgRatio;
        } else {
          drawW = cw * zoom; drawH = drawW / imgRatio;
        }
      }
      drawX = (cw - drawW) / 2;
      drawY = (ch - drawH) / 2;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Preload frames
    let loaded = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === FRAME_COUNT) {
          setFramesLoaded(true);
          resizeCanvas();
          drawFrame(0);
        }
      };
      framesRef.current[i - 1] = img;
    }

    // Scroll handler
    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const section = sectionRef.current;
          if (!section) { tickingRef.current = false; return; }
          const rect = section.getBoundingClientRect();
          const scrollable = section.offsetHeight - window.innerHeight;
          const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
          const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={sectionRef}>
      {/* Sticky canvas layer */}
      <div className="hero__sticky">
        <canvas
          ref={canvasRef}
          className="hero__canvas"
          style={{ opacity: framesLoaded ? 1 : 0 }}
        />

        {/* Hero content overlaid on top of first frame */}
        <div className="hero__overlay">
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
              <a href="#contact" className="btn-primary" id="hero-cta-book">
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
