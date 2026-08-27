import React from 'react';
import { Ticket, MapPin, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BookingSummary({
  movie,
  theatre,
  show,
  selectedSeats = [],
  onProceed,
  proceedButtonText = "Proceed to Payment",
  disabled = false
}) {
  const seatCount = selectedSeats.length;
  const basePrice = selectedSeats.reduce((acc, s) => acc + Number(s.price || 0), 0);
  const convenienceFee = seatCount * 30;
  const gst = Math.round(convenienceFee * 0.18 * 100) / 100;
  const totalAmount = Math.round((basePrice + convenienceFee + gst) * 100) / 100;

  const seatNames = selectedSeats.map(s => s.seat_number).join(', ');

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', height: 'fit-content' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Ticket size={20} color="#f59e0b" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Booking Summary</h3>
      </div>

      {/* Movie Details */}
      {movie && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
            {movie.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>{movie.language}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      )}

      {/* Theatre & Showtime */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
        {theatre && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <MapPin size={14} color="#f59e0b" style={{ marginTop: '3px', flexShrink: 0 }} />
            <div>
              <span style={{ fontWeight: 600, display: 'block' }}>{theatre.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{theatre.location}</span>
            </div>
          </div>
        )}

        {show && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
              <Calendar size={13} color="#f59e0b" />
              <span>{show.show_date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f8fafc', fontWeight: 700 }}>
              <Clock size={13} color="#f59e0b" />
              <span>{show.show_time}</span>
            </div>
          </div>
        )}
      </div>

      {/* Seats Breakdown */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#94a3b8' }}>Selected Seats ({seatCount})</span>
          <span style={{ fontWeight: 700, color: '#f59e0b' }}>{seatNames || 'None'}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          <span style={{ color: '#94a3b8' }}>Ticket Price</span>
          <span style={{ color: '#f8fafc' }}>₹{basePrice.toFixed(2)}</span>
        </div>

        {seatCount > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Convenience Fee (₹30/seat)</span>
              <span style={{ color: '#f8fafc' }}>₹{convenienceFee.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Integrated GST (18%)</span>
              <span style={{ color: '#f8fafc' }}>₹{gst.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      {/* Total Amount */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Amount Payable
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f59e0b' }}>
            ₹{seatCount > 0 ? totalAmount.toFixed(2) : '0.00'}
          </span>
        </div>
        <span className="badge badge-status" style={{ fontSize: '0.7rem' }}>
          Taxes Included
        </span>
      </div>

      {/* Action Button */}
      <button
        id="proceed-payment-btn"
        disabled={disabled || seatCount === 0}
        onClick={() => onProceed({ totalAmount, seatCount, basePrice, convenienceFee, gst })}
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
      >
        <span>{proceedButtonText}</span>
        <ArrowRight size={18} />
      </button>

      {/* Security Note */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', color: '#64748b', fontSize: '0.75rem' }}>
        <ShieldCheck size={14} color="#10b981" />
        <span>Safe & Instant Mock Checkout</span>
      </div>

    </div>
  );
}
