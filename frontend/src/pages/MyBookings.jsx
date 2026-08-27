import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, CheckCircle2, XCircle, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function MyBookings({ onOpenAIChat }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'confirmed', 'cancelled'

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = user ? user.id : 1;
      const data = await api.getUserBookings(userId);
      setBookings(data || []);
    } catch (err) {
      console.warn("Error fetching user bookings:", err);
      // Check session or fallback
      const saved = sessionStorage.getItem('confirmed_booking');
      if (saved) {
        setBookings([JSON.parse(saved)]);
      } else {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.cancelBooking(bookingId);
      showToast("Booking cancelled successfully.", "info");
      fetchBookings();
    } catch (err) {
      showToast("Could not cancel booking.", "error");
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'confirmed') return b.booking_status === 'CONFIRMED';
    if (activeTab === 'cancelled') return b.booking_status === 'CANCELLED';
    return true;
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <Ticket size={20} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>My Cinema Bookings</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Manage your active movie tickets and booking history.
          </p>
        </div>

        <button
          onClick={onOpenAIChat}
          className="btn-ai"
          style={{ padding: '0.6rem 1.2rem', borderRadius: '12px' }}
        >
          <Sparkles size={16} />
          <span>Ask CineAI</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'all', label: `All Bookings (${bookings.length})` },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'cancelled', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              color: activeTab === tab.id ? '#f59e0b' : '#94a3b8',
              border: activeTab === tab.id ? '1px solid #f59e0b' : 'none',
              borderRadius: '20px',
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <LoadingSpinner message="Fetching your cinema passes..." />
      ) : filteredBookings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map((b) => {
            const isConfirmed = b.booking_status === 'CONFIRMED';
            return (
              <div
                key={b.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.5rem',
                  alignItems: 'center',
                  borderLeft: isConfirmed ? '4px solid #10b981' : '4px solid #f43f5e'
                }}
              >
                {/* Movie Title & ID */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={isConfirmed ? "badge badge-status" : "badge"} style={{ background: isConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: isConfirmed ? '#34d399' : '#fb7185' }}>
                      {isConfirmed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {b.booking_status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
                      {b.booking_code}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                    {b.movie_title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="#f59e0b" />
                    <span>{b.theatre_name}</span>
                  </div>
                </div>

                {/* Date, Time, Seats */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                    <Calendar size={14} color="#f59e0b" />
                    <span>{b.show_date}</span>
                    <span style={{ color: '#64748b' }}>•</span>
                    <Clock size={14} color="#f59e0b" />
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{b.show_time}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                    <span style={{ color: '#94a3b8' }}>Seats:</span>
                    <span style={{ fontWeight: 800, color: '#f59e0b' }}>
                      {Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Paid Amount:</span>
                    <span style={{ fontWeight: 700, color: '#10b981' }}>₹{Number(b.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                  <Link
                    to={`/booking-confirmation/${b.booking_code || b.id}`}
                    className="btn-primary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}
                  >
                    <ExternalLink size={14} />
                    View Ticket Pass
                  </Link>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        color: '#fb7185',
                        borderRadius: '8px',
                        padding: '0.45rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Ticket size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Bookings Yet</h3>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            You haven't booked any movie tickets yet. Explore movies and let CineAI find the best shows for you!
          </p>
          <Link to="/movies" className="btn-primary">
            Explore Movies Now
          </Link>
        </div>
      )}

    </div>
  );
}
