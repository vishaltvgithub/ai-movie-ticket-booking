import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, CreditCard, Landmark, Wallet, ShieldCheck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('user@upi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('pending_booking');
    if (!saved) {
      navigate('/movies');
      return;
    }
    setBookingData(JSON.parse(saved));
  }, []);

  if (!bookingData) return null;

  const { showId, seatIds, seats, movie, theatre, show, pricing, customerName, customerEmail } = bookingData;
  const grandTotal = pricing?.totalAmount || 0;

  const handlePay = async () => {
    setProcessing(true);
    showToast("Processing payment via secure sandbox...", "info");

    try {
      // 1. Simulate network payment authorization delay
      await new Promise(r => setTimeout(r, 1200));

      // 2. Call backend to store booking in MySQL
      const payload = {
        show_id: showId,
        seat_ids: seatIds,
        user_id: user ? user.id : 1,
        guest_name: customerName,
        guest_email: customerEmail,
        payment_method: paymentMethod
      };

      const response = await api.createBooking(payload);
      
      // Store confirmed booking in session and localStorage for instant access
      sessionStorage.setItem('confirmed_booking', JSON.stringify(response));
      showToast("🎉 Payment successful! Ticket confirmed.", "success");
      
      // Navigate to BookingConfirmation
      navigate(`/booking-confirmation/${response.booking_code || response.id}`);
    } catch (err) {
      console.error("Booking error:", err);
      const errorMsg = err.response?.data?.detail || "Booking failed or seat unavailable.";
      showToast(errorMsg, "error");
      
      // If error is double-booking conflict, offer fallback recovery
      if (err.response?.status === 409) {
        setTimeout(() => navigate(`/seat-selection/${showId}`), 2000);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      
      {/* Header */}
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
        Back to Checkout
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            Choose Payment Method
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Mock payment sandbox for UPS Hackathon demonstration
          </p>
        </div>
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Amount</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Payment Methods Tabs */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'UPI', label: 'UPI / QR Code', icon: QrCode, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
            { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay' },
            { id: 'NETBANKING', label: 'Net Banking', icon: Landmark, desc: 'All Major Indian Banks' },
            { id: 'WALLET', label: 'Wallets', icon: Wallet, desc: 'Amazon Pay, Paytm Wallet' },
          ].map((m) => {
            const active = paymentMethod === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                id={`pay-method-${m.id.toLowerCase()}`}
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  background: active ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: active ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: active ? '#f59e0b' : 'rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: active ? '#000' : '#cbd5e1'
                }}>
                  <Icon size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: active ? '#f59e0b' : '#f8fafc', display: 'block' }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {m.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Detail Section */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {paymentMethod === 'UPI' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '150px',
                height: '150px',
                background: '#fff',
                borderRadius: '16px',
                margin: '0 auto 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
              }}>
                <QrCode size={110} color="#000" />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.75rem' }}>
                Scan with any UPI App or enter VPA
              </span>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.6rem 0.75rem',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}
              />
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.55rem', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Expiry (MM/YY)</label>
                  <input type="text" defaultValue="12/28" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.55rem', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>CVV</label>
                  <input type="password" defaultValue="•••" style={{ width: '100%', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '0.55rem', color: '#fff' }} />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'NETBANKING' && (
            <div style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '1rem' }}>Select Bank for Demo Checkout:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map(b => (
                  <button key={b} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === 'WALLET' && (
            <div style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '1rem' }}>Link & Pay with Wallet:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {['Paytm Wallet', 'Amazon Pay', 'PhonePe', 'Mobikwik'].map(w => (
                  <button key={w} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#f8fafc', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem' }}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            id="pay-button"
            disabled={processing}
            onClick={handlePay}
            className="btn-primary"
            style={{
              marginTop: '1.5rem',
              width: '100%',
              justifyContent: 'center',
              padding: '0.85rem',
              fontSize: '1.05rem',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)'
            }}
          >
            <Lock size={16} />
            <span>{processing ? 'Confirming with Cinema Gateway...' : `Pay ₹${grandTotal.toFixed(2)}`}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1rem', color: '#64748b', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Simulated instant checkout for UPS Hackathon</span>
          </div>

        </div>

      </div>

    </div>
  );
}
