import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './Results.css';

const stats = [
  { val: '$127K', label: 'Month', detail: 'Single-location medspa went from $54K/mo to $127K/mo in revenue within 90 days of launching Meta + Google campaigns.' },
  { val: '$23', label: 'Cost Per Lead', detail: 'Botox + filler campaigns generating qualified leads in a competitive metro market, converting to booked appointments at 31%.' },
  { val: '4.2×', label: 'ROAS Month One', detail: 'New medspa launched with a $5K ad budget and generated $21K in trackable first-visit revenue within 30 days.' },
  { val: '68', label: 'New Patients/Month', detail: 'Body contouring + injectables campaigns filling a schedule with 68 new patients per month on $4,200/mo ad spend.' },
];

const testimonials = [
  {
    quote: '"We were spending $3K/month with our last agency and couldn\'t tell you where a single patient came from. The Medspa Bros took over our ads, and within 6 weeks we were booked out 2 weeks in advance. These guys are the real deal."',
    name: 'Dr. Sarah M.',
    title: 'Medical Director, MedSpa',
    initials: 'SM',
  },
  {
    quote: '"I\'ve worked with three agencies. All of them gave me vanity metrics and excuses. The Bros gave me a dashboard that shows exactly what every dollar generates. Last month: $4,100 in ad spend, $28K in booked revenue. I\'m done looking."',
    name: 'Jessica T.',
    title: 'Owner, Aesthetics & Wellness',
    initials: 'JT',
  },
  {
    quote: '"They told me I\'d see leads within 48 hours. I thought it was BS. I got 11 leads on day one. Seven of them booked. One did a $3,200 CoolSculpting package. I was a believer by day three."',
    name: 'Michael R.',
    title: 'Owner & NP, Med Spa',
    initials: 'MR',
  },
];

const Results = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="results section-padding" id="results" ref={ref}>
      <div className="container">
        <motion.div
          className="results__label"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Proof
        </motion.div>
        <motion.h2
          className="results__headline"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          The numbers do the talking.
        </motion.h2>

        {/* Stat cards */}
        <div className="results__stats">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="results__stat-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.2 + i * 0.1 }}
            >
              <div className="results__stat-top">
                <span className="results__stat-val">{s.val}</span>
                <span className="results__stat-label">{s.label}</span>
              </div>
              <p className="results__stat-detail">{s.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="results__testimonials">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="results__testimonial"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.5 + i * 0.12 }}
            >
              <div className="results__quote-mark">"</div>
              <p className="results__quote">{t.quote}</p>
              <div className="results__author">
                <div className="results__avatar">{t.initials}</div>
                <div>
                  <div className="results__author-name">{t.name}</div>
                  <div className="results__author-title">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Results;
