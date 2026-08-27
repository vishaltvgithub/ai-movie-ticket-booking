import React from 'react';
import { Film, Sparkles, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(18, 9, 6, 0.98)',
      borderTop: '2px solid rgba(255, 181, 0, 0.25)',
      padding: '3.5rem 1.5rem 2rem',
      marginTop: 'auto',
      color: '#D1C5BD'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <img src="/ups-logo.webp" alt="UPS Shield" style={{ height: '32px', width: 'auto' }} />
              <div>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFDF9', fontFamily: 'var(--font-display)' }}>
                  UPS <span style={{ color: '#FFB500' }}>Cinema</span> Express
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#8E7A71' }}>
              Official UPS Hackathon Submission: Next-generation cinema ticketing with conversational Groq AI, smart seat optimization, and real-time express booking confirmation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
              <Link to="/" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Home</Link>
              <Link to="/movies" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>Explore Movies</Link>
              <Link to="/my-bookings" style={{ color: '#94a3b8', transition: 'color 0.2s' }}>My Bookings</Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Key Features
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#64748b' }}>
              <span>✨ AI Movie Recommendation</span>
              <span>💺 Smart Center Seat Optimizer</span>
              <span>⚡ Zero Double-Booking Guarantee</span>
              <span>📱 Instant Cinema Pass Generation</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['React + Vite', 'FastAPI', 'MySQL', 'SQLAlchemy', 'Pydantic', 'Lucide'].map((tech) => (
                <span key={tech} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid rgba(255, 181, 0, 0.15)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#8E7A71' }}>
          <div>
            © 2024 UPS Cinema Express. Built exclusively for the UPS Hackathon.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#D1C5BD', fontWeight: 600 }}>Accelerated by Groq AI LPU™</span>
            <Sparkles size={14} color="#FFB500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
