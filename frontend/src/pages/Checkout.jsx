import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, ShieldCheck, CreditCard, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookingData, setBookingData] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const saved = sessionStorage.getItem('pending_booking');
    if (!saved) {
      navigate('/movies');
      return;
    }
    const parsed = JSON.parse(saved);
    setBookingData(parsed);

    if (user) {
      setUserName(user.name || 'Demo User');
      setUserEmail(user.email || 'demo@example.com');
    } else {
      setUserName('Demo Guest');
      setUserEmail('guest@example.com');
    }
  }, [user]);

  if (!bookingData) return null;

  const { movie, theatre, show, seats, pricing } = bookingData;
  const seatNames = seats.map(s => s.seat_number).join(', ');

  const handleProceedToPayment = () => {
    if (!userName.trim() || !userEmail.trim()) {
      showToast("Please provide your name and email.", "error");
      return;
    }

    // Update customer info
    const updated = {
      ...bookingData,
      customerName: userName,
      customerEmail: userEmail
    };
    sessionStorage.setItem('pending_booking', JSON.stringify(updated));
    navigate('/payment');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.9rem',
          cursor: 'pointer',
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        Back to Seat Selection
      </button>

      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
        Review Your Booking
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
        Please verify your movie selection and contact details before proceeding to payment.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Booking Details Card */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <img
              src={movie?.poster_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80"}
              alt={movie?.title}
              style={{ width: '80px', height: '110px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>{movie?.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#c084fc', marginBottom: '0.5rem' }}>
                {movie?.language} • {movie?.genre}
              </div>
              <span className="badge badge-rating" style={{ fontSize: '0.75rem' }}>
                ⭐ {movie?.rating ? Number(movie.rating).toFixed(1) : '8.5'} / 10
              </span>
            </div>
          </div>

          {/* Location and Timing */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <MapPin size={16} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', display: 'block' }}>{theatre?.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{theatre?.location}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Calendar size={15} color="#f59e0b" />
                <span style={{ color: '#cbd5e1' }}>{show?.show_date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Clock size={15} color="#f59e0b" />
                <span style={{ fontWeight: 700, color: '#f8fafc' }}>{show?.show_time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={16} color="#f59e0b" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Selected Seats ({seats.length})</span>
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f59e0b' }}>{seatNames}</span>
            </div>
          </div>

          {/* Contact Details Form */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={15} color="#c084fc" />
              Ticket Recipient Details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Email for E-Ticket</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right: Payment Breakdown & Proceed */}
        <div className="glass-panel" style={{ padding: '1.75rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Payment Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Tickets ({seats.length})</span>
              <span>₹{pricing.basePrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Convenience Fee</span>
              <span>₹{pricing.convenienceFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Integrated GST (18%)</span>
              <span>₹{pricing.gst.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b' }}>
                ₹{pricing.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            id="proceed-to-payment-gateway-btn"
            onClick={handleProceedToPayment}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}
          >
            <span>Proceed to Mock Payment</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem', color: '#64748b', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Encrypted Demo Payment Gateway</span>
          </div>
        </div>

      </div>

    </div>
  );
}
