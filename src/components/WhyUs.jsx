import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './WhyUs.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' },
  }),
};

const pillars = [
  {
    num: '01',
    title: 'Appointments, not "leads."',
    body: 'We don\'t hand you a spreadsheet of form fills and call it a day. We build campaigns designed to get qualified patients booked on your calendar — people who actually show up and spend money.',
  },
  {
    num: '02',
    title: 'We know your world.',
    body: 'We know a Botox patient searches for "forehead wrinkles," not "botulinum toxin." We know CoolSculpting buyers need 2-3 touchpoints before they book. We know your $79 HydraFacial offer is a gateway to a $2,400 treatment plan.',
  },
  {
    num: '03',
    title: 'Radical transparency.',
    body: 'You\'ll see exactly what we\'re spending, what it\'s generating, and what your cost per booked appointment is — in real-time. No vanity metrics. No smoke and mirrors. If it\'s not working, we\'ll tell you before you have to ask.',
  },
];

const WhyUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="why-us section-padding" id="why-us" ref={ref}>
      <div className="container">
        <motion.div className="why-us__label" variants={fadeUp} custom={0} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          Why The Medspa Bros
        </motion.div>
        <motion.h2 className="why-us__headline" variants={fadeUp} custom={1} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          Two brothers who eat, sleep,
          <br />
          and breathe medspa ads.
        </motion.h2>
        <motion.p className="why-us__intro" variants={fadeUp} custom={2} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          We're not an agency. We're two brothers who got obsessed with paid advertising for medspas and decided to go all-in. No account managers. No layers of bureaucracy. No offshore teams. When you hire The Medspa Bros, you get <strong>us</strong> — directly in your corner.
        </motion.p>

        <div className="why-us__pillars">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              className="why-us__pillar"
              variants={fadeUp}
              custom={3 + i}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <span className="why-us__pillar-num">{p.num}</span>
              <div>
                <h3 className="why-us__pillar-title">{p.title}</h3>
                <p className="why-us__pillar-body">{p.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Economics callout */}
        <motion.div
          className="why-us__economics"
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <p className="why-us__econ-label">The math that actually matters</p>
          <div className="why-us__econ-grid">
            {[
              { val: '$504–$536', label: 'Avg. first-visit spend' },
              { val: '$6,000+', label: 'Patient lifetime value' },
              { val: '$23', label: 'Cost per lead (Meta)' },
              { val: '3–5×', label: 'Average ROAS in 90 days' },
            ].map((e, i) => (
              <div key={i} className="why-us__econ-item">
                <span className="why-us__econ-val">{e.val}</span>
                <span className="why-us__econ-desc">{e.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
