import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', medspaName: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Payload shape per Data Schema in gemini.md
    const payload = {
      name: form.name,
      medspaName: form.medspaName,
      email: form.email,
      phone: form.phone,
    };

    try {
      // GoHighLevel webhook URL — to be replaced via .env when available
      const webhookUrl = import.meta.env.VITE_GHL_WEBHOOK_URL;

      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      // Success regardless (local form works even without webhook in dev)
      setStatus('success');
      setForm({ name: '', medspaName: '', email: '', phone: '' });
    } catch (err) {
      console.error('Webhook error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="contact section-padding" id="contact" ref={ref}>
      <div className="container">
        <div className="contact__grid">
          {/* Left */}
          <motion.div
            className="contact__left"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="contact__label">Book Free Audit</div>
            <h2 className="contact__headline">
              Your competitors are
              <br />
              running ads right now.
              <br />
              <span className="contact__headline--accent">Are yours better?</span>
            </h2>
            <p className="contact__sub">
              Book a free 30-minute ad audit. We'll show you exactly what's leaving money on the table — and what a Medspa Bros campaign would look like for your practice. No pitch. No pressure. Just a brutally honest look at your ads.
            </p>
            <div className="contact__scarcity">
              <span className="contact__scarcity-dot" />
              Limited availability — we take on <strong>5 new medspas per month</strong> to maintain quality.
            </div>

            <div className="contact__trust-items">
              {['Month-to-month. Cancel anytime.', 'Real-time dashboard from day 1.', 'Direct access to your dedicated Bro.', 'Leads in 48-72 hours after launch.'].map((t, i) => (
                <div key={i} className="contact__trust-item">
                  <span className="contact__trust-check">✓</span>
                  {t}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="contact__form-wrapper"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {status === 'success' ? (
              <div className="contact__success">
                <div className="contact__success-icon">🎉</div>
                <h3>You're in!</h3>
                <p>We'll reach out within 24 hours to schedule your free ad audit. Talk soon.</p>
              </div>
            ) : (
              <form className="contact__form" onSubmit={handleSubmit} id="contact-form">
                <h3 className="contact__form-title">Book Your Free Ad Audit</h3>

                <div className="contact__field">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="First Last"
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="medspaName">Medspa Name</label>
                  <input
                    type="text"
                    id="medspaName"
                    name="medspaName"
                    value={form.medspaName}
                    onChange={handleChange}
                    placeholder="Your Medspa LLC"
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@yourmedspa.com"
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    required
                  />
                </div>

                {status === 'error' && (
                  <p className="contact__error">Something went wrong. Please try again or email us directly.</p>
                )}

                <button
                  type="submit"
                  className="btn-primary contact__submit"
                  disabled={status === 'sending'}
                  id="contact-submit-btn"
                >
                  {status === 'sending' ? 'Sending...' : 'Book Your Free Ad Audit →'}
                </button>

                <p className="contact__disclaimer">No pitch. No pressure. Just an honest look at your ads.</p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
