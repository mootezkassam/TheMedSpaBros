import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import './FAQ.css';

const faqs = [
  {
    q: 'How is this different from every other medspa marketing agency?',
    a: 'Most "medspa marketing agencies" are generalist agencies wearing a medspa costume. They\'ll sell you SEO, social media management, email marketing, website design, and paid ads — because they need to bundle services to justify their retainer. We only do paid ads. That\'s our entire business. When you\'re the best at one thing, you don\'t need to sell twelve. Also — you work directly with us. Not an account manager. Not a junior media buyer. Two brothers who have spent thousands of hours inside medspa ad accounts.',
  },
  {
    q: 'What kind of results can I expect, and how fast?',
    a: 'Most of our clients see their first leads within 48-72 hours of campaign launch. Meaningful, consistent appointment flow typically kicks in within 30-60 days as we optimize targeting, creative, and your offer strategy. By month 3, you should have a clear, scalable ad machine generating predictable new patient volume. We won\'t promise you\'ll 10x overnight — but we will promise total transparency on what\'s working and what we\'re doing about what isn\'t.',
  },
  {
    q: 'What\'s the minimum ad spend you recommend?',
    a: 'For our Launch tier, we recommend a minimum of $1,500/month in ad spend (separate from our management fee). This gives us enough budget to test, learn, and optimize effectively. That said, more budget = faster data = faster optimization. The sweet spot for most single-location medspas is $3,000-$5,000/mo in ad spend.',
  },
  {
    q: 'Do you guarantee results?',
    a: 'We guarantee our work ethic, our expertise, and our radical transparency. You\'ll always know exactly what your ads are generating. We don\'t lock you into contracts — if we\'re not delivering ROI, you can leave anytime. That\'s our guarantee: we have to earn your business every single month. The agencies that "guarantee 50 leads a month" are usually counting junk form fills from people who will never answer their phone. We\'d rather give you 20 leads that book than 50 that ghost.',
  },
  {
    q: 'What platforms do you run ads on?',
    a: 'Primarily Meta (Facebook + Instagram) and Google (Search + YouTube). These two platforms cover the vast majority of where medspa patients discover and research treatments. For Dominate clients, we also run TikTok and YouTube campaigns. We\'ll always recommend the platform mix that makes the most sense for your specific treatments, market, and budget.',
  },
  {
    q: "I've been burned by agencies before. Why should I trust you?",
    a: "Because we've heard this from almost every medspa owner we talk to. It's actually why we exist. Month-to-month (leave anytime). Real-time dashboard (see everything we see). Direct access to us (no account manager buffer). And a singular focus on the one thing that actually moves the needle — paid ads that generate booked appointments.",
  },
  {
    q: 'Do you help with our offers and promotions?',
    a: "Absolutely. Your offer strategy is half the battle. We'll help you build treatment-specific offers that attract high-quality patients — not Groupon-style discounts that train people to never pay full price. Think: strategic intro offers that lead to high-LTV treatment plans, seasonal promotions that fill slow periods, and new treatment launch campaigns that create immediate demand.",
  },
  {
    q: "What if we're a brand new medspa with no patient base?",
    a: "That's one of our favorite situations. New medspas have a clean slate — no bad agency habits to undo, no stale audiences, no wasted budget to account for. We'll build your acquisition engine from day one with aggressive launch campaigns designed to fill your schedule fast and build momentum.",
  },
];

const FAQ = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="faq section-padding" id="faq" ref={ref}>
      <div className="container">
        <motion.div className="faq__label" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          FAQ
        </motion.div>
        <motion.h2 className="faq__headline" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: 0.1 }}>
          Questions we get from
          <br />
          every medspa owner.
        </motion.h2>

        <div className="faq__list">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              className={`faq__item ${openIdx === i ? 'faq__item--open' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
            >
              <button
                className="faq__question"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                id={`faq-q-${i}`}
              >
                <span>{f.q}</span>
                <span className="faq__icon">{openIdx === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    className="faq__answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
