import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './Contact.css';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TIMES = [
  '10:00am', '10:30am', '11:00am', '11:30am',
  '12:00pm', '12:30pm', '1:00pm',  '1:30pm',
  '2:00pm',  '2:30pm',  '3:00pm',  '3:30pm',
  '4:00pm',  '4:30pm',
];

// Slots that appear "booked" (grey/unavailable) for realism
const BOOKED_INDICES = [1, 4, 7, 10];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// "Available" days — skip some for realism
const AVAILABLE_DAYS = new Set([2,5,6,8,9,12,13,15,16,19,20,22,23,26,27,29,30]);

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState('calendar'); // calendar | form | success

  const [form, setForm] = useState({ name: '', medspaName: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');

  const calDays = getCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null); setSelectedTime(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null); setSelectedTime(null);
  };

  const handleDayClick = (d) => {
    if (!d || !AVAILABLE_DAYS.has(d)) return;
    setSelectedDay(d);
    setSelectedTime(null);
  };

  const handleTimeClick = (t, i) => {
    if (BOOKED_INDICES.includes(i)) return;
    setSelectedTime(t);
  };

  const handleContinue = () => {
    if (selectedDay && selectedTime) setStep('form');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const payload = {
      name: form.name,
      medspaName: form.medspaName,
      email: form.email,
      phone: form.phone,
      bookedDate: `${MONTH_NAMES[viewMonth]} ${selectedDay}, ${viewYear}`,
      bookedTime: selectedTime,
    };

    try {
      const webhookUrl = import.meta.env.VITE_GHL_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setStatus('success');
      setStep('success');
    } catch (err) {
      console.error('Webhook error:', err);
      setStatus('error');
    }
  };

  const selectedDateLabel = selectedDay
    ? `${DAYS[new Date(viewYear, viewMonth, selectedDay).getDay()]} ${selectedDay}`
    : null;

  return (
    <section className="contact section-padding" id="contact" ref={ref}>
      <div className="container">
        <div className="contact__grid">

          {/* ── LEFT COPY ── */}
          <motion.div
            className="contact__left"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="contact__label">Book Free Audit</div>
            <h2 className="contact__headline">
              See if The Medspa Bros<br />
              is the right fit<br />
              <span className="contact__headline--accent">(it totally is)</span>
            </h2>
            <p className="contact__sub">
              Schedule a quick, 30-minute free ad audit. We'll show you exactly what's
              leaving money on the table — no pitch, no pressure.
            </p>

            <div className="contact__scarcity">
              <span className="contact__scarcity-dot" />
              <span>Limited availability — we take on <strong>5 new medspas per month</strong> to maintain quality.</span>
            </div>

            <div className="contact__trust-items">
              {[
                'Month-to-month. Cancel anytime.',
                'Real-time dashboard from day 1.',
                'Direct access to your dedicated Bro.',
                'Leads in 48-72 hours after launch.',
              ].map((t, i) => (
                <div key={i} className="contact__trust-item">
                  <span className="contact__trust-check">✓</span>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT BOOKING CARD ── */}
          <motion.div
            className="contact__booking-card"
            data-glow="dark"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >

            {/* Alert banner */}
            <div className="booking__banner">
              <span className="booking__banner-dot" />
              <span>High demand — spots filling fast. Book now to secure your slot.</span>
            </div>

            {/* ── STEP: CALENDAR ── */}
            {step === 'calendar' && (
              <div className="booking__body">
                {/* Month nav */}
                <div className="booking__month-nav">
                  <span className="booking__month-label">
                    <strong>{MONTH_NAMES[viewMonth]}</strong> {viewYear}
                  </span>
                  <div className="booking__month-arrows">
                    <button className="booking__arrow" onClick={prevMonth} aria-label="Previous month">‹</button>
                    <button className="booking__arrow" onClick={nextMonth} aria-label="Next month">›</button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="booking__cal-header">
                  {DAYS.map(d => <span key={d}>{d}</span>)}
                </div>

                {/* Calendar grid */}
                <div className="booking__cal-grid">
                  {calDays.map((d, i) => {
                    const isAvail = d && AVAILABLE_DAYS.has(d);
                    const isToday = d && d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                    const isSel = d && d === selectedDay;
                    return (
                      <button
                        key={i}
                        className={[
                          'booking__cal-day',
                          !d ? 'booking__cal-day--empty' : '',
                          isAvail ? 'booking__cal-day--avail' : '',
                          isToday ? 'booking__cal-day--today' : '',
                          isSel ? 'booking__cal-day--selected' : '',
                          d && !isAvail ? 'booking__cal-day--unavail' : '',
                        ].join(' ')}
                        onClick={() => handleDayClick(d)}
                        disabled={!isAvail}
                        aria-label={d ? `${MONTH_NAMES[viewMonth]} ${d}` : undefined}
                      >
                        {d || ''}
                        {isToday && !isSel && <span className="booking__today-dot" />}
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                {selectedDay && (
                  <div className="booking__times">
                    <div className="booking__times-header">
                      <span className="booking__times-label">
                        <strong>{selectedDateLabel}</strong>
                      </span>
                      <div className="booking__time-format">
                        <span className="booking__time-fmt-btn booking__time-fmt-btn--active">12h</span>
                        <span className="booking__time-fmt-btn">24h</span>
                      </div>
                    </div>
                    <div className="booking__time-list">
                      {TIMES.map((t, i) => {
                        const isBooked = BOOKED_INDICES.includes(i);
                        const isSel = t === selectedTime;
                        return (
                          <button
                            key={t}
                            className={[
                              'booking__time-slot',
                              isBooked ? 'booking__time-slot--booked' : '',
                              isSel ? 'booking__time-slot--selected' : '',
                            ].join(' ')}
                            onClick={() => handleTimeClick(t, i)}
                            disabled={isBooked}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Continue CTA */}
                {selectedDay && selectedTime && (
                  <motion.button
                    className="booking__continue"
                    onClick={handleContinue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    id="booking-continue-btn"
                  >
                    Continue →
                  </motion.button>
                )}
              </div>
            )}

            {/* ── STEP: FORM ── */}
            {step === 'form' && (
              <div className="booking__body">
                <button className="booking__back" onClick={() => setStep('calendar')}>← Back</button>
                <div className="booking__selected-summary">
                  <span className="booking__summary-icon">📅</span>
                  <span>
                    {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear} &nbsp;·&nbsp; {selectedTime}
                  </span>
                </div>
                <form className="booking__form" onSubmit={handleSubmit} id="contact-form">
                  <div className="booking__form-field">
                    <label htmlFor="name">Your name *</label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleChange} placeholder="First Last" required />
                  </div>
                  <div className="booking__form-field">
                    <label htmlFor="medspaName">Medspa name *</label>
                    <input type="text" id="medspaName" name="medspaName" value={form.medspaName} onChange={handleChange} placeholder="Your Medspa LLC" required />
                  </div>
                  <div className="booking__form-field">
                    <label htmlFor="email">Email address *</label>
                    <input type="email" id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@yourmedspa.com" required />
                  </div>
                  <div className="booking__form-field">
                    <label htmlFor="phone">Phone number *</label>
                    <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="(555) 000-0000" required />
                  </div>

                  {status === 'error' && (
                    <p className="booking__error">Something went wrong. Please try again.</p>
                  )}

                  <button type="submit" className="booking__continue" disabled={status === 'sending'} id="contact-submit-btn">
                    {status === 'sending' ? 'Booking...' : 'Confirm Booking →'}
                  </button>

                  <p className="booking__disclaimer">
                    By proceeding, you agree to a free, no-obligation call with The Medspa Bros.
                  </p>
                </form>
              </div>
            )}

            {/* ── STEP: SUCCESS ── */}
            {step === 'success' && (
              <div className="booking__success">
                <div className="booking__success-icon">🎉</div>
                <h3>You're booked!</h3>
                <p>
                  Your free ad audit is confirmed for<br />
                  <strong>{MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear} at {selectedTime}.</strong>
                </p>
                <p>Check your email for a calendar invite. Talk soon!</p>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
