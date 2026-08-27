import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Sparkles, Ticket, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAIChat }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', borderBottom: '2px solid rgba(255, 181, 0, 0.3)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* UPS Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
          <div style={{ 
            height: '42px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 10px rgba(255, 181, 0, 0.45))'
          }}>
            <img 
              src="/ups-logo.webp" 
              alt="UPS Shield Logo" 
              style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>
                UPS <span style={{ color: '#FFB500' }}>Cinema</span>
              </span>
              <span style={{
                background: '#FFB500',
                color: '#160B08',
                fontSize: '0.65rem',
                fontWeight: 900,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>
                EXPRESS
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', display: 'block', color: '#D1C5BD', marginTop: '-2px', fontWeight: 700, letterSpacing: '0.08em' }}>
              POWERED BY GROQ CINEAI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-links">
          <Link to="/" style={{ color: isActive('/') ? '#FFB500' : '#D1C5BD', fontWeight: 700, fontSize: '0.95rem', transition: 'color 0.2s', borderBottom: isActive('/') ? '2px solid #FFB500' : 'none', paddingBottom: '4px' }}>
            Home
          </Link>
          <Link to="/movies" style={{ color: isActive('/movies') ? '#FFB500' : '#D1C5BD', fontWeight: 700, fontSize: '0.95rem', transition: 'color 0.2s', borderBottom: isActive('/movies') ? '2px solid #FFB500' : 'none', paddingBottom: '4px' }}>
            Movies
          </Link>
          <Link to="/my-bookings" style={{ color: isActive('/my-bookings') ? '#FFB500' : '#D1C5BD', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s', borderBottom: isActive('/my-bookings') ? '2px solid #FFB500' : 'none', paddingBottom: '4px' }}>
            <Ticket size={17} color="#FFB500" />
            My Bookings
          </Link>

          {/* AI Assistant Nav Button */}
          <button 
            id="nav-ai-btn"
            onClick={onOpenAIChat} 
            className="btn-ai"
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', borderRadius: '20px' }}
          >
            <Sparkles size={16} />
            UPS CineAI
          </button>
        </div>

        {/* Auth / Profile Area */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.07)', 
                border: '1px solid var(--border-glass)', 
                padding: '0.4rem 0.85rem', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem' 
              }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f59e0b', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </div>
              <button 
                onClick={logout} 
                title="Sign Out"
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div style={{ background: '#0d121d', borderBottom: '1px solid var(--border-glass)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f8fafc', fontWeight: 600 }}>Home</Link>
          <Link to="/movies" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f8fafc', fontWeight: 600 }}>Movies</Link>
          <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f8fafc', fontWeight: 600 }}>My Bookings</Link>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenAIChat(); }}
            className="btn-ai"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={16} /> Open CineAI
          </button>
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-links { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
