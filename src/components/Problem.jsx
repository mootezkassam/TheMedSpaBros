import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Problem.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const Problem = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const painPoints = [
    { icon: '🕳️', text: '"Throwing money into a black hole" — agencies that can\'t connect a single dollar to a booked chair.' },
    { icon: '👻', text: 'Leads that ghost — Facebook form fills from price-shoppers who never answer their phone.' },
    { icon: '🤷', text: 'Generalist agencies that don\'t know the difference between Botox and fillers, let alone HIPAA compliance.' },
    { icon: '📊', text: 'Vanity metrics — traffic graphs and impression counts instead of actual revenue attribution.' },
    { icon: '😩', text: 'Provider burnout — you became an injector, not a marketer, and you resent spending nights managing ads.' },
  ];

  return (
    <section className="problem section-padding" id="problem" ref={ref}>
      <div className="container">
        <motion.div
          className="problem__label"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          Sound Familiar?
        </motion.div>

        <motion.h2
          className="problem__headline"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          You've probably been
          <br />
          burned before.
        </motion.h2>

        <div className="problem__grid">
          <motion.div
            className="problem__copy"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p>
              You hired a "digital marketing agency." They promised the world.
              Six months later, you had a nice logo, some Instagram posts nobody
              saw, and a monthly report full of impressions, clicks, and other
              numbers that don't pay your rent.
            </p>
            <p>
              Here's the thing most agencies won't tell you:{' '}
              <strong>
                they spread themselves across 47 different services because they
                can't do any single one well enough to stake their reputation on
                it.
              </strong>{' '}
              They'll sell you SEO, social media, email marketing, website
              design, reputation management, and paid ads — all at once, none of
              them great.
            </p>
            <p>
              We don't do any of that. We do one thing.{' '}
              <strong>Paid ads for medspas.</strong> Meta, Google, and whatever
              platform is printing money this quarter. That's it. Every dollar of
              your ad spend is managed by one of two people — not a junior media
              buyer who Googled "what is Botox" last Tuesday.
            </p>
          </motion.div>

          <motion.div
            className="problem__pain-list"
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p className="problem__pain-label">What you're actually dealing with:</p>
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                className="problem__pain-item"
                variants={fadeUp}
                custom={3 + i * 0.5}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
              >
                <span className="problem__pain-icon">{p.icon}</span>
                <span>{p.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
