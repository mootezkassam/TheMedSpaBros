import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './HowItWorks.css';

const steps = [
  {
    num: '01',
    title: 'We Audit Everything',
    body: 'Book a free 30-minute ad audit. We\'ll review your current campaigns (or lack thereof), your market, your competition, and your offer strategy. You\'ll leave with a clear picture of what\'s working, what\'s bleeding money, and exactly what we\'d do differently — whether you hire us or not.',
    cta: 'Book Your Free Audit →',
    href: '/book',
  },
  {
    num: '02',
    title: 'We Build Your Ad Machine',
    body: 'Within the first 7 days, we build your campaign architecture from scratch: custom audiences, conversion-optimized landing pages, treatment-specific ad creatives, and automated lead follow-up sequences designed for medspa patient behavior. No templates. No cookie-cutter funnels.',
    cta: null,
    href: null,
  },
  {
    num: '03',
    title: 'We Scale What Works',
    body: 'Once we find your winning combinations (usually within 30-60 days), we pour fuel on the fire. We scale your ad spend profitably, add new treatment campaigns, and continuously optimize so your cost per appointment drops while your patient volume climbs.',
    cta: 'See which plan fits →',
    href: '#pricing',
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="how-it-works section-padding" id="how-it-works" ref={ref}>
      <div className="container">
        <motion.div
          className="hiw__label"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          The Process
        </motion.div>
        <motion.h2
          className="hiw__headline"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          From "just browsing" to
          <br />
          booked in 3 steps.
        </motion.h2>

        <div className="hiw__steps">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              className="hiw__step"
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.15 }}
            >
              <div className="hiw__step-left">
                <span className="hiw__step-num">{s.num}</span>
                <div className="hiw__step-line" />
              </div>
              <div className="hiw__step-right">
                <h3 className="hiw__step-title">{s.title}</h3>
                <p className="hiw__step-body">{s.body}</p>
                {s.cta && (
                  <a href={s.href} className="hiw__step-cta">
                    {s.cta}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
