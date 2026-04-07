import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './ThankYouPage.css'

/* ── DATA ── */

const testimonials = [
  {
    quote: "We were spending $3K/month with our last agency and couldn't tell where a single patient came from. The Medspa Bros took over and within 6 weeks we were booked out 2 weeks in advance.",
    name: 'Dr. Sarah M.',
    title: 'Medical Director',
  },
  {
    quote: "$4,100 in ad spend. $28K in booked revenue. I've worked with three agencies. All of them gave me vanity metrics. The Bros gave me a dashboard that shows exactly what every dollar generates.",
    name: 'Jessica T.',
    title: 'Owner',
  },
  {
    quote: "They told me I'd see leads in 48 hours. I got 11 leads on day one. Seven booked. One did a $3,200 CoolSculpting package. I was a believer by day three.",
    name: 'Michael R.',
    title: 'Owner & NP',
  },
]

const results = [
  { stat: '$127K/Month', desc: 'Single-location medspa, 90 days after launch' },
  { stat: '13x ROAS', desc: 'Arden Laser & Aesthetics, Meta campaign' },
  { stat: '26x ROAS', desc: 'Dr. Shane, return on ad spend' },
  { stat: '$23 Cost Per Lead', desc: 'Botox + filler campaigns, competitive metro' },
  { stat: '68 New Patients/Month', desc: 'Body contouring + injectables, $4,200 ad spend' },
  { stat: '4.2x ROAS Month One', desc: 'New medspa launch, $5K budget' },
]

const faqs = [
  {
    q: 'What makes The Medspa Bros different?',
    a: "We only do paid ads for medspas. Not SEO, not social media, not websites. One thing, done exceptionally well. You work directly with us — not an account manager who Googled Botox last Tuesday.",
  },
  {
    q: 'How much do you charge?',
    a: 'Our plans start at $2,000/month. See full pricing on our website. No setup fees, no long-term contracts, month-to-month always.',
  },
  {
    q: 'I have tried marketing before and it never worked.',
    a: "We hear this from almost every medspa owner we talk to. The difference is we only run paid ads, only for medspas, with real-time reporting so you see exactly where every dollar goes. If we are not delivering, fire us. We operate month-to-month for exactly that reason.",
  },
]

/* ── COMPONENT ── */

export default function ThankYouPage() {
  const [openFaq, setOpenFaq] = useState(null)

  // Land at the top of the page on navigation (default browser behavior keeps
  // the previous scroll offset on SPA route changes)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const confettiPieces = useMemo(() => {
    const colors = ['#2563EB', '#1B2A4A', '#60a5fa', '#93c5fd', '#dbeafe']
    return Array.from({ length: 50 }, (_, i) => ({
      left: `${((i * 7.3 + 2) % 98) + 1}%`,
      animationDelay: `${i * 0.06}s`,
      animationDuration: `${2.2 + (i % 5) * 0.5}s`,
      width: `${6 + (i % 4) * 3}px`,
      height: `${6 + (i % 3) * 3}px`,
      backgroundColor: colors[i % colors.length],
      borderRadius: i % 3 === 0 ? '50%' : '2px',
    }))
  }, [])

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  return (
    <div className="ty-page">
      {/* Animated gradient mesh */}
      <div className="ty-mesh-bg">
        <div className="ty-mesh-blob ty-mesh-blob-1" />
        <div className="ty-mesh-blob ty-mesh-blob-2" />
        <div className="ty-mesh-blob ty-mesh-blob-3" />
      </div>

      {/* Top wave */}
      <div className="ty-wave-top">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C240,180 480,0 720,100 C960,200 1200,40 1440,120 L1440,0 L0,0 Z" fill="#2563EB" opacity="0.15" />
          <path d="M0,50 C360,150 720,10 1080,90 C1260,130 1380,70 1440,100 L1440,0 L0,0 Z" fill="#2563EB" opacity="0.08" />
        </svg>
      </div>

      {/* Confetti */}
      <div className="ty-confetti" aria-hidden="true">
        {confettiPieces.map((style, i) => (
          <div key={i} className="ty-confetti-piece" style={style} />
        ))}
      </div>

      <div className="ty-content">

        {/* ═══════ HERO ═══════ */}
        <section className="ty-hero">
          {/* Animated checkmark */}
          <div className="ty-checkmark">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="38" stroke="#2563EB" strokeWidth="2.5" opacity="0.25" />
              <motion.circle
                cx="40" cy="40" r="38"
                stroke="#2563EB"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              <motion.path
                d="M24 42 L34 52 L56 28"
                stroke="#2563EB"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              />
            </svg>
          </div>

          <motion.h1
            className="ty-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Your Call Has Been Scheduled! 🎉
          </motion.h1>

          <motion.p
            className="ty-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <strong>LAST STEP:</strong> Reply <strong>YES</strong> to the text we just sent you to confirm your spot.
          </motion.p>
        </section>

        {/* ═══════ RESULTS ═══════ */}
        <section className="ty-results">
          <h2 className="ty-section-title">Some Of Our Partners Results...</h2>
          <div className="ty-results-grid">
            {results.map((r, i) => (
              <motion.div
                key={i}
                className="ty-result-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <h3>{r.stat}</h3>
                <p>{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════ TESTIMONIALS ═══════ */}
        <section className="ty-testimonials">
          <div className="ty-testimonial-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="ty-testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <p className="ty-tq">&ldquo;{t.quote}&rdquo;</p>
                <p className="ty-ta">— {t.name}, <span>{t.title}</span></p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════ FAQ ═══════ */}
        <section className="ty-faq">
          <h2 className="ty-section-title">Common Questions...</h2>
          <div className="ty-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`ty-faq-item ${openFaq === i ? 'open' : ''}`}>
                <button className="ty-faq-q" onClick={() => toggleFaq(i)} type="button">
                  <span>{faq.q}</span>
                  <span className="ty-faq-icon">{openFaq === i ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      className="ty-faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ BOTTOM CTA ═══════ */}
        <section className="ty-cta">
          <h2 className="ty-cta-headline">We Will See You On The Call.</h2>
          <p className="ty-cta-sub">
            Come ready to talk about your medspa revenue goals. We will come prepared with your market research already done.
          </p>
          <div className="ty-warning">
            ⚠️ We do not offer same-day reschedules. If you cannot make it please reschedule at least 24 hours in advance.
          </div>
          <div className="ty-cta-buttons">
            <Link to="/" className="ty-btn-blue">Back to Home</Link>
            <a
              href="https://instagram.com/themedspabros"
              target="_blank"
              rel="noopener noreferrer"
              className="ty-btn-ghost"
            >
              Follow Us @themedspabros
            </a>
          </div>
        </section>
      </div>

      {/* Bottom wave */}
      <div className="ty-wave-bottom">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C240,0 480,200 720,80 C960,-20 1200,160 1440,60 L1440,200 L0,200 Z" fill="#2563EB" opacity="0.15" />
          <path d="M0,120 C360,30 720,180 1080,70 C1260,20 1380,120 1440,80 L1440,200 L0,200 Z" fill="#2563EB" opacity="0.08" />
        </svg>
      </div>
    </div>
  )
}
