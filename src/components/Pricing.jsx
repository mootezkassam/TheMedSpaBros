import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './Pricing.css';

const tiers = [
  {
    id: 'launch',
    name: 'Launch',
    tagline: 'Light the fuse.',
    price: '$2,000',
    period: '/mo',
    popular: false,
    adSpend: '$1,500–$3,000/mo',
    cta: 'Start with Launch →',
    features: [
      '1 advertising platform (Meta OR Google)',
      'Up to 3 treatment campaigns',
      'Custom conversion-optimized landing pages',
      'Automated lead follow-up (SMS + email)',
      'Weekly campaign optimization & A/B testing',
      'Real-time results dashboard',
      'Bi-weekly strategy calls',
      'Creative ad design (static + video)',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'Pour fuel on the fire.',
    price: '$4,000',
    period: '/mo',
    popular: true,
    adSpend: '$3,000–$8,000/mo',
    cta: 'Scale your medspa →',
    features: [
      'Both Meta AND Google Ads',
      'Up to 8 treatment campaigns',
      'Everything in Launch, plus:',
      'Advanced retargeting campaigns',
      'Treatment-specific funnel architecture',
      'Competitor conquest campaigns',
      'Monthly creative refresh',
      'Weekly strategy calls',
      'Quarterly offer strategy session',
      'Priority response < 4 hours',
    ],
  },
  {
    id: 'dominate',
    name: 'Dominate',
    tagline: 'Own your market.',
    price: '$8,000',
    period: '/mo',
    popular: false,
    adSpend: '$8,000–$20,000+/mo',
    cta: 'Dominate your market →',
    features: [
      'Full omni-channel — Meta, Google, YouTube, TikTok',
      'Unlimited treatment campaigns',
      'Everything in Scale, plus:',
      'Direct Slack/text access to your dedicated Bro',
      'Multi-location & geo-targeting',
      'Custom patient acquisition cost modeling',
      'Monthly video ad production consultation',
      'Landing page A/B testing program',
      'Patient reactivation campaigns',
      'Quarterly competitive market analysis',
    ],
  },
];

const Pricing = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="pricing section-padding" id="pricing" ref={ref}>
      <div className="container">
        <motion.div
          className="pricing__label"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Transparent Pricing
        </motion.div>
        <motion.h2
          className="pricing__headline"
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          Pick your speed.
          <br />
          Scale when you're ready.
        </motion.h2>
        <motion.p
          className="pricing__sub"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Transparent pricing because we're not afraid of it. No setup fees. No long-term contracts. Month-to-month, cancel anytime. If we're not printing you money, you should leave.
        </motion.p>

        <div className="pricing__grid">
          {tiers.map((t, i) => (
            <motion.div
              key={t.id}
              className={`pricing__card ${t.popular ? 'pricing__card--popular' : ''}`}
              data-glow={t.popular ? 'dark' : 'light'}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.3 + i * 0.12 }}
            >
              {t.popular && (
                <div className="pricing__card-badge">⭐ Most Popular</div>
              )}
              <div className="pricing__card-top">
                <div>
                  <div className="pricing__card-name">{t.name}</div>
                  <div className="pricing__card-tagline">{t.tagline}</div>
                </div>
                <div className="pricing__card-price">
                  <span className="pricing__card-amount">{t.price}</span>
                  <span className="pricing__card-period">{t.period}</span>
                </div>
              </div>

              <div className="pricing__card-adspend">
                Recommended ad spend: <strong>{t.adSpend}</strong>
              </div>

              <ul className="pricing__card-features">
                {t.features.map((f, j) => (
                  <li key={j} className={`pricing__card-feature ${f.endsWith(':') ? 'pricing__card-feature--divider' : ''}`}>
                    {!f.endsWith(':') && <span className="pricing__check">✓</span>}
                    {f}
                  </li>
                ))}
              </ul>

              <a href="#contact" className={`pricing__card-cta ${t.popular ? 'pricing__card-cta--primary' : ''}`} id={`pricing-cta-${t.id}`}>
                {t.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="pricing__guarantee"
          data-glow="light"
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span className="pricing__guarantee-icon">🤝</span>
          <div>
            <strong>No contracts. No setup fees. No BS.</strong>
            <p>We operate month-to-month because we believe you should stay because we're making you money, not because a contract says you have to. If we're not delivering, fire us. We'll even help you transition. That's how confident we are.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
