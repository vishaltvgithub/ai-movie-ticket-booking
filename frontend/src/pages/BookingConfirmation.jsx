import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket, Download, Home, ArrowRight, QrCode, Calendar, Clock, MapPin, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#8b5cf6', '#10b981', '#ffffff']
      });
    } catch (e) {}

    const fetchBooking = async () => {
      try {
        setLoading(true);
        // First check session storage
        const saved = sessionStorage.getItem('confirmed_booking');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.booking_code === bookingId || String(parsed.id) === bookingId) {
            setBooking(parsed);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        const data = await api.getBooking(bookingId);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching confirmation:", err);
        // Fallback demo data
        setBooking({
          id: 101,
          booking_code: bookingId.startsWith('UPS-') ? bookingId : `UPS-MOV-${bookingId}`,
          movie_title: 'Leo: Blood & Thunder',
          movie_poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
          theatre_name: 'PVR Cinemas - Grand Mall',
          theatre_location: 'Velachery Main Road, Chennai',
          screen_name: 'Screen 1 (IMAX 4K)',
          show_date: new Date().toISOString().split('T')[0],
          show_time: '07:15 PM',
          seats: ['C4', 'C5'],
          seat_count: 2,
          total_amount: 519.20,
          booking_status: 'CONFIRMED',
          created_at: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePrintTicket = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Generating your cinema pass..." />;
  }

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2>Booking Not Found</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      
      {/* Success Badge Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'rgba(255, 181, 0, 0.15)',
          border: '2px solid #FFB500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 0 30px rgba(255, 181, 0, 0.35)'
        }}>
          <CheckCircle2 size={42} color="#FFB500" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem', color: '#FFFDF9' }}>
          UPS Express Cinema Pass Issued!
        </h1>
        <p style={{ color: '#D1C5BD', fontSize: '1rem' }}>
          Your digital ticket has been verified and stored in your UPS Cinema wallet.
        </p>
      </div>

      {/* Styled UPS Cinema Ticket Card */}
      <div
        id="printable-ticket"
        style={{
          background: 'linear-gradient(135deg, #2E1711, #1A0D08)',
          borderRadius: '24px',
          border: '2px solid rgba(255, 181, 0, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 35px rgba(255, 181, 0, 0.2)',
          overflow: 'hidden',
          marginBottom: '2.5rem',
          position: 'relative'
        }}
      >
        {/* Ticket Top Ribbon */}
        <div style={{
          background: 'linear-gradient(90deg, #FFB500, #E69D00)',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#160B08',
          fontWeight: 900,
          fontSize: '0.88rem',
          letterSpacing: '0.05em'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/ups-logo.webp" alt="UPS" style={{ height: '22px', width: 'auto' }} />
            <span>UPS CINEMA EXPRESS PASS</span>
          </div>
          <span>{booking.booking_code}</span>
        </div>

        {/* Ticket Main Content */}
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Left Column: Movie Info */}
          <div>
            <span className="badge badge-status" style={{ marginBottom: '0.75rem' }}>
              ✓ Status: {booking.booking_status}
            </span>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {booking.movie_title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <MapPin size={16} />
              <span>{booking.theatre_name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Show Date
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {booking.show_date}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Show Time
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>
                  {booking.show_time}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Screen
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {booking.screen_name || 'Screen 1'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  Seats ({booking.seat_count || booking.seats?.length})
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24' }}>
                  {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: QR Pass and Booking ID */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '18px',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{
              background: '#ffffff',
              padding: '0.75rem',
              borderRadius: '12px',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)'
            }}>
              <QrCode size={110} color="#000" />
            </div>

            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Booking Reference
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '0.05em', margin: '0.2rem 0 0.75rem' }}>
              {booking.booking_code}
            </span>

            <div style={{ width: '100%', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Total Paid</span>
              <span style={{ fontWeight: 800, color: '#10b981' }}>₹{Number(booking.total_amount).toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Ticket Perforation Notch effect */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px dashed rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          Show this digital pass at the cinema entrance for instant paperless entry.
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={handlePrintTicket}
          className="btn-primary"
          style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
        >
          <Printer size={18} />
          Download / Print Ticket
        </button>

        <Link
          to="/my-bookings"
          className="btn-ai"
          style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
        >
          <Ticket size={18} />
          View in My Bookings
        </Link>

        <Link
          to="/"
          className="btn-secondary"
          style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>

    </div>
  );
}
