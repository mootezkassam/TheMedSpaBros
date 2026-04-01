import React, { useEffect, useRef, useState } from 'react';
import './ScrollAnimation.css';

const FRAME_COUNT = 121;
const HOLD_DURATION = 600;

const annotations = [
  {
    show: 0.02, hide: 0.22,
    number: '01',
    title: 'Empty Chairs',
    desc: 'Monday morning. Every slot wide open. The week ahead — completely blank.',
  },
  {
    show: 0.25, hide: 0.48,
    number: '02',
    title: 'First Bookings Drop',
    desc: 'Botox at 9. HydraFacial at 10. The momentum starts building.',
    stat: '6',
    statLabel: 'Bookings In',
  },
  {
    show: 0.50, hide: 0.73,
    number: '03',
    title: 'The Rush Is Real',
    desc: 'Morpheus8, CO₂ Laser, CoolSculpting — premium treatments stacking up.',
    stat: '$15K+',
    statLabel: 'Revenue Booked',
  },
  {
    show: 0.75, hide: 0.98,
    number: '04',
    title: 'Fully Booked',
    desc: '30 appointments. $20,850 in weekly revenue. Every single chair filled.',
    stat: '100%',
    statLabel: 'Fill Rate',
  },
];

const ScrollAnimation = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(-1);
  const tickingRef = useRef(false);
  const cardRefs = useRef([]);
  const snapStateRef = useRef(annotations.map(() => ({ snapped: false })));
  const isSnappingRef = useRef(false);
  const hintRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* ── Resize canvas (Retina-aware) ── */
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    /* ── Draw frame with cover-fit (desktop) / zoomed contain-fit (mobile) ── */
    const drawFrame = (index) => {
      const img = framesRef.current[index];
      if (!img || !img.complete) return;

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      // White fill behind frame (no flash between frames)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cw, ch);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cw / ch;
      let drawW, drawH, drawX, drawY;

      if (window.innerWidth > 768) {
        // Desktop: cover-fit
        if (canvasRatio > imgRatio) {
          drawW = cw;
          drawH = cw / imgRatio;
        } else {
          drawH = ch;
          drawW = ch * imgRatio;
        }
      } else {
        // Mobile: zoomed contain-fit
        const zoom = 1.15;
        if (canvasRatio > imgRatio) {
          drawH = ch * zoom;
          drawW = drawH * imgRatio;
        } else {
          drawW = cw * zoom;
          drawH = drawW / imgRatio;
        }
      }
      drawX = (cw - drawW) / 2;
      drawY = (ch - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    /* ── Preload all frames ── */
    let loadedCount = 0;
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
          resizeCanvas();
          drawFrame(0);
        }
      };
      framesRef.current[i - 1] = img;
    }

    /* ── Annotation card show/hide + snap-stop ── */
    const updateCards = (progress) => {
      annotations.forEach((ann, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        const visible = progress >= ann.show && progress <= ann.hide;
        cardEl.classList.toggle('visible', visible);

        const snapState = snapStateRef.current[i];
        if (visible && !snapState.snapped && !isSnappingRef.current) {
          snapState.snapped = true;
          isSnappingRef.current = true;
          document.body.style.overflow = 'hidden';
          setTimeout(() => {
            document.body.style.overflow = '';
            isSnappingRef.current = false;
          }, HOLD_DURATION);
        }
        if (!visible) snapState.snapped = false;
      });

      // Fade scroll hint
      if (hintRef.current) {
        hintRef.current.style.opacity = progress < 0.04 ? '0.6' : '0';
      }
    };

    /* ── Scroll → frame mapping ── */
    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const section = sectionRef.current;
          if (!section) { tickingRef.current = false; return; }

          const rect = section.getBoundingClientRect();
          const scrollableHeight = section.offsetHeight - window.innerHeight;
          const progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));
          const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

          if (frameIndex !== currentFrameRef.current) {
            currentFrameRef.current = frameIndex;
            drawFrame(frameIndex);
          }

          updateCards(progress);
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
    <section className="scroll-animation" ref={sectionRef}>
      <div className="scroll-sticky">
        <canvas
          ref={canvasRef}
          className="frame-canvas"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        {annotations.map((ann, i) => (
          <div
            key={i}
            className="annotation-card"
            ref={(el) => (cardRefs.current[i] = el)}
          >
            <div className="acard-number">{ann.number}</div>
            <div className="acard-body">
              <h3 className="acard-title">{ann.title}</h3>
              <p className="acard-desc">{ann.desc}</p>
              {ann.stat && (
                <div className="acard-stat">
                  <span className="acard-stat-number">{ann.stat}</span>
                  <span className="acard-stat-label">{ann.statLabel}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="scroll-hint-overlay" ref={hintRef}>
          <span>Scroll to watch it fill</span>
          <div className="scroll-hint-arrow" />
        </div>
      </div>
    </section>
  );
};

export default ScrollAnimation;
