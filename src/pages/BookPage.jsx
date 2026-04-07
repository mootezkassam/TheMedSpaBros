import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import Contact from '../components/Contact'
import FunnelAnimation from '../components/FunnelAnimation'
import LocationAutocomplete from '../components/LocationAutocomplete'
import './BookPage.css'

/* ── DATA ── */

const ownershipOptions = [
  { label: 'Yes — I own a MedSpa', value: 'owner' },
  { label: 'I work in one', value: 'worker' },
  { label: 'No (This Is Not For Me)', value: 'no' },
]

const revenueOptions = [
  'Under $10k/mo',
  '$10k - $25k/mo',
  '$25k - $50k/mo',
  '$50k - $100k/mo',
  '$100,000+/mo',
]

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

const dashClients = [
  { id: 'W1', name: 'Miami Aesthetics', spend: '$4,200/mo', revenue: '$31,400/mo', roas: '7.4x', patients: '52', status: 'SCALING' },
  { id: 'W2', name: 'Glow Medspa ATL', spend: '$2,800/mo', revenue: '$18,900/mo', roas: '6.7x', patients: '38', status: 'SCALING' },
  { id: 'W3', name: 'Elite Body Contour', spend: '$6,500/mo', revenue: '$41,200/mo', roas: '6.3x', patients: '71', status: 'SCALING' },
  { id: 'W4', name: 'Radiance Clinic NYC', spend: '$3,100/mo', revenue: '$22,700/mo', roas: '7.3x', patients: '44', status: 'OPTIMIZING' },
]

/* ── ANIMATION VARIANTS ── */

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }),
}

/* ── COMPONENT ── */

export default function BookPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('form') // 'form' | 'calendar'
  const [[step, direction], setStepState] = useState([1, 0])
  const [disqualified, setDisqualified] = useState(false)

  // Form data
  const [ownership, setOwnership] = useState('')
  const [location, setLocation] = useState('')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [revenue, setRevenue] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [medspaName, setMedspaName] = useState('')

  useEffect(() => {
    if (stage === 'calendar') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [stage])

  const setStep = (newStep) => {
    const dir = newStep > step ? 1 : -1
    setStepState([newStep, dir])
  }

  const canGoNext = () => {
    if (step === 1) return ownership !== ''
    if (step === 2) return location.trim() !== ''
    if (step === 3) return revenue !== ''
    if (step === 4) {
      return firstName.trim() && lastName.trim() && phone.trim() && email.trim() && medspaName.trim()
    }
    return false
  }

  const handleNext = () => {
    if (!canGoNext()) return
    if (step === 1 && ownership === 'no') {
      setDisqualified(true)
      return
    }
    if (step < 4) {
      setStep(step + 1)
    } else {
      setStage('calendar')
    }
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  /* ── STEP RENDERERS ── */

  const renderStep1 = () => (
    <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
      <h3 className="book-step-title">Do You Own a MedSpa or Provide Aesthetic Treatments?</h3>
      <p className="book-step-subtitle">(Botox, Fillers, Lasers, Body Contouring, RF Microneedling or other high-end treatments)</p>
      <div className="book-radio-group">
        {ownershipOptions.map((opt) => (
          <label key={opt.value} className={`book-radio-row ${ownership === opt.value ? 'selected' : ''}`}>
            <input type="radio" name="ownership" value={opt.value} checked={ownership === opt.value} onChange={() => setOwnership(opt.value)} />
            <span className="book-radio-dot" />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
      <h3 className="book-step-title">Where Is Your MedSpa Located?</h3>
      <p className="book-step-subtitle">We build market-specific campaigns — your city matters.</p>
      <LocationAutocomplete
        value={location}
        onChange={setLocation}
        selectedPlace={selectedPlace}
        onPlaceSelect={(place) => {
          setSelectedPlace(place)
          setLocation(place.address)
        }}
        onKeyDown={(e) => e.key === 'Enter' && canGoNext() && handleNext()}
      />
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
      <h3 className="book-step-title">What Is Your Current Average Monthly Revenue?</h3>
      <p className="book-step-subtitle">Be honest — this helps us show you what is actually possible at your stage.</p>
      <div className="book-radio-group">
        {revenueOptions.map((opt) => (
          <label key={opt} className={`book-radio-row ${revenue === opt ? 'selected' : ''}`}>
            <input type="radio" name="revenue" value={opt} checked={revenue === opt} onChange={() => setRevenue(opt)} />
            <span className="book-radio-dot" />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </motion.div>
  )

  const renderStep4 = () => (
    <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
      <h3 className="book-step-title">Almost There — Where Do We Send Your Audit?</h3>
      <p className="book-step-subtitle">We review your market before the call so we come fully prepared.</p>
      <div className="book-fields-grid">
        <div className="book-field">
          <label>First Name *</label>
          <input type="text" className="book-input" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="book-field">
          <label>Last Name *</label>
          <input type="text" className="book-input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="book-field">
          <label>Phone Number *</label>
          <input type="tel" className="book-input" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="book-field">
          <label>Email *</label>
          <input type="email" className="book-input" placeholder="you@medspa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="book-field book-field-full">
          <label>MedSpa / Clinic Name *</label>
          <input type="text" className="book-input" placeholder="Your MedSpa Name" value={medspaName} onChange={(e) => setMedspaName(e.target.value)} />
        </div>
      </div>
    </motion.div>
  )

  const renderDisqualified = () => (
    <motion.div key="disqualified" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" style={{ textAlign: 'center', padding: '24px 0' }}>
      <h3 className="book-step-title">This program is built exclusively for MedSpa owners ready to scale.</h3>
      <p className="book-step-subtitle" style={{ marginBottom: 28 }}>If that changes, we'd love to help.</p>
      <Link to="/" className="book-btn-blue">Back to Home</Link>
    </motion.div>
  )

  /* ── MAIN RENDER ── */

  return (
    <div className="book-page">
      {/* Animated gradient mesh */}
      <div className="book-mesh-bg">
        <div className="book-mesh-blob book-mesh-blob-1" />
        <div className="book-mesh-blob book-mesh-blob-2" />
        <div className="book-mesh-blob book-mesh-blob-3" />
      </div>

      {/* Top wave blobs */}
      <div className="book-wave-top">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C240,180 480,0 720,100 C960,200 1200,40 1440,120 L1440,0 L0,0 Z" fill="#2563EB" opacity="0.15" />
          <path d="M0,50 C360,150 720,10 1080,90 C1260,130 1380,70 1440,100 L1440,0 L0,0 Z" fill="#2563EB" opacity="0.08" />
        </svg>
      </div>

      <div className="book-content">
        {/* ── HERO ── */}
        <motion.section
          className="book-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="book-pill">FREE 30-MIN AD AUDIT</span>
          <h1 className="book-hero-headline">
            Get More MedSpa Patients.<br />Without Chasing Leads.
          </h1>
          <p className="book-hero-sub">
            We'll show you exactly what your competitors are doing and build you a
            custom paid ads plan — free, no pitch, no pressure.
          </p>
          <div className="book-hero-trust">
            {['Results in 48-72 hours after launch', 'Only 5 spots available per month', 'Month-to-month, cancel anytime'].map((text, i) => (
              <span key={i} className="book-hero-trust-item">
                <span className="book-hero-check">✓</span> {text}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ── FORM STAGE ── */}
        <AnimatePresence mode="wait">
          {stage === 'form' && (
            <motion.section
              key="form-stage"
              className="book-form-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="book-form-card" data-glow="light">
                {/* Progress bar */}
                {!disqualified && (
                  <div className="book-progress">
                    <div className="book-progress-track">
                      <motion.div
                        className="book-progress-fill"
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <span className="book-progress-label">Step {step} of 4</span>
                  </div>
                )}

                {/* Animated step content */}
                <div className="book-step-content">
                  <AnimatePresence mode="wait" custom={direction}>
                    {disqualified
                      ? renderDisqualified()
                      : step === 1 ? renderStep1()
                      : step === 2 ? renderStep2()
                      : step === 3 ? renderStep3()
                      : renderStep4()}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                {!disqualified && (
                  <>
                    <div className={`book-form-actions ${step === 4 ? 'book-form-actions--stacked' : ''}`}>
                      {step === 4 ? (
                        <>
                          <button className="book-btn-blue book-btn-full" disabled={!canGoNext()} onClick={handleNext} type="button">
                            Claim My Free Audit Spot →
                          </button>
                          <button className="book-btn-outline book-btn-full" onClick={handlePrev} type="button">
                            ← Prev
                          </button>
                        </>
                      ) : (
                        <>
                          {step > 1 && (
                            <button className="book-btn-outline" onClick={handlePrev} type="button">← Prev</button>
                          )}
                          <button className="book-btn-blue" disabled={!canGoNext()} onClick={handleNext} type="button">
                            Next →
                          </button>
                        </>
                      )}
                    </div>
                    {step === 4 && (
                      <p className="book-privacy">We respect your privacy. No spam, ever.</p>
                    )}
                  </>
                )}
              </div>
            </motion.section>
          )}

          {/* ── CALENDAR STAGE ── */}
          {stage === 'calendar' && (
            <motion.div
              key="calendar-stage"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Calendar intro */}
              <div className="book-calendar-intro">
                <h2>Pick Your Audit Time</h2>
                <p>Spots fill fast — we only take 5 new medspas per month.</p>
              </div>

              {/* Existing Contact component from homepage */}
              <Contact onBookingComplete={() => navigate('/thank-you')} />

              {/* Trust pills below calendar */}
              <div className="book-below-calendar">
                <div className="book-trust-pills">
                  <span className="book-pill-item">✓ 30 Minutes</span>
                  <span className="book-pill-item">✓ No Pitch</span>
                  <span className="book-pill-item">✓ Real Strategies You Can Use Immediately</span>
                </div>
              </div>

              {/* Social Proof */}
              <section className="book-social-proof">
                <h2 className="book-social-headline">What MedSpa Owners Are Saying...</h2>
                <div className="book-testimonial-grid">
                  {testimonials.map((t, i) => (
                    <motion.div
                      key={i}
                      className="book-testimonial-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                    >
                      <p className="book-testimonial-quote">"{t.quote}"</p>
                      <p className="book-testimonial-author">— {t.name}, <span>{t.title}</span></p>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── DIVIDER ── */}
        <div className="book-divider" />

        {/* ── THE SYSTEM SECTION ── */}
        <motion.section
          className="book-system"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="book-system-inner">
          <div className="book-system-grid">
            {/* Left: Copy */}
            <div className="book-system-left">
              <span className="book-system-label">THE SYSTEM</span>
              <h2 className="book-system-headline">Every Lead. One Chair.</h2>
              <p className="book-system-body">
                Most medspas are bleeding money on ads that bring in the wrong people — price shoppers,
                tire kickers, people who ghost after the consultation.
              </p>
              <p className="book-system-body">
                We built a paid ads system specifically for medspas that filters out the noise and funnels
                only qualified, ready-to-book patients straight into your schedule.
              </p>
              <p className="book-system-body">
                No generalist agency. No junior media buyers. Just two brothers who eat, sleep and breathe
                medspa patient acquisition.
              </p>
              <ul className="book-system-bullets">
                <li>Meta + Google campaigns built for medspa patient behavior</li>
                <li>Treatment-specific funnels — Botox buyers vs body contouring vs lasers</li>
                <li>Automated follow-up that converts leads who don't book immediately</li>
                <li>Real-time dashboard — you see every dollar and every booking</li>
              </ul>
            </div>

            {/* Right: Animation */}
            <div className="book-system-right">
              <FunnelAnimation />
              <p className="book-system-caption">Cold traffic → Qualified patients → Booked appointments</p>
            </div>
          </div>
          </div>
        </motion.section>

        {/* ── DIVIDER ── */}
        <div className="book-divider" />

        {/* ── CLIENT RESULTS DASHBOARD ── */}
        <motion.section
          className="book-dashboard"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="book-dashboard-inner">
          <div className="dash-section-header">
            <div className="dash-label">
              <span className="dash-dot-green" />
              LIVE CLIENT RESULTS
            </div>
            <h2 className="dash-headline">What's Happening Inside Our Clients' Medspas</h2>
          </div>

          <div className="dash-panel">
            <div className="dash-scanlines" />

            {/* Total revenue header */}
            <div className="dash-total">
              <span className="dash-total-label">TOTAL REVENUE MANAGED</span>
              <div className="dash-total-row">
                <span className="dash-total-value">$114,200/mo</span>
                <span className="dash-live"><span className="dash-live-dot" /> LIVE</span>
              </div>
            </div>

            {/* Table */}
            <div className="dash-table-wrap">
              <div className="dash-row dash-row-header">
                <span>CLIENT</span>
                <span>MEDSPA</span>
                <span>SPEND</span>
                <span>REVENUE</span>
                <span>ROAS</span>
                <span>NEW PATIENTS</span>
                <span>STATUS</span>
              </div>
              {dashClients.map((c, i) => (
                <div key={i} className="dash-row">
                  <span className="dash-cell-id">{c.id}</span>
                  <span className="dash-cell-name">{c.name}</span>
                  <span className="dash-cell-spend" data-label="SPEND">{c.spend}</span>
                  <span className="dash-cell-revenue" data-label="REVENUE">{c.revenue}</span>
                  <span className="dash-cell-roas" data-label="ROAS">{c.roas}</span>
                  <span className="dash-cell-patients" data-label="NEW PATIENTS">{c.patients}</span>
                  <span className={`dash-cell-status ${c.status === 'SCALING' ? 'dash-status-green' : 'dash-status-blue'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="dash-disclaimer">
            Results shown are from active client campaigns. Individual results vary based on market, budget and offer.
          </p>
          </div>
        </motion.section>
      </div>

      {/* Bottom wave blobs */}
      <div className="book-wave-bottom">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C240,0 480,200 720,80 C960,-20 1200,160 1440,60 L1440,200 L0,200 Z" fill="#2563EB" opacity="0.15" />
          <path d="M0,120 C360,30 720,180 1080,70 C1260,20 1380,120 1440,80 L1440,200 L0,200 Z" fill="#2563EB" opacity="0.08" />
        </svg>
      </div>
    </div>
  )
}
