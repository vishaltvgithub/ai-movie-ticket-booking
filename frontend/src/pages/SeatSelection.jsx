import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Info, Check, ShieldCheck, Ticket } from 'lucide-react';
import SeatMap from '../components/SeatMap';
import BookingSummary from '../components/BookingSummary';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [seats, setSeats] = useState([]);
  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [recommendedSeatIds, setRecommendedSeatIds] = useState([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [seatCountToRecommend, setSeatCountToRecommend] = useState(2);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setLoading(true);
        // Fetch seats for this show
        const seatData = await api.getSeatsForShow(showId);
        setSeats(seatData);

        // Fetch show details (or find from movie shows)
        try {
          // If we have direct show lookup or get all shows
          const allTheatres = await api.getTheatres();
          const pvr = allTheatres.find(t => t.id === 1) || allTheatres[0] || { name: 'PVR Cinemas - Grand Mall', location: 'Velachery Main Road, Chennai' };
          setTheatre(pvr);
          
          // Fetch movie (default to Leo or show's movie)
          const movieData = await api.getMovieById(1);
          setMovie(movieData);

          setShow({
            id: parseInt(showId),
            show_date: new Date().toISOString().split('T')[0],
            show_time: '07:15 PM',
            screen_name: 'Screen 1 (IMAX 4K)'
          });
        } catch (e) {
          console.warn("Details fallback loaded:", e);
        }
      } catch (err) {
        console.error("Error loading seats:", err);
        // Fallback seat generation for standalone demo if showId not in DB
        const generated = [];
        const types = { 'A': 'Regular', 'B': 'Regular', 'C': 'Premium', 'D': 'Premium', 'E': 'VIP' };
        const prices = { 'A': 150, 'B': 150, 'C': 220, 'D': 220, 'E': 300 };
        let idCounter = 1;
        ['A', 'B', 'C', 'D', 'E'].forEach(r => {
          for (let col = 1; col <= 8; col++) {
            generated.push({
              id: idCounter++,
              screen_id: 1,
              seat_number: `${r}${col}`,
              seat_type: types[r],
              price: prices[r],
              is_booked: (r === 'A' && col <= 2) || (r === 'D' && (col === 4 || col === 5))
            });
          }
        });
        setSeats(generated);
        setMovie({ id: 1, title: 'Leo: Blood & Thunder', language: 'Tamil', genre: 'Action' });
        setTheatre({ name: 'PVR Cinemas - Grand Mall', location: 'Velachery Main Road, Chennai' });
        setShow({ id: parseInt(showId), show_date: 'Today', show_time: '07:15 PM', screen_name: 'Screen 1' });
      } finally {
        setLoading(false);
      }
    };

    fetchSeatData();
  }, [showId]);

  // Toggle seat selection
  const handleToggleSeat = (seat) => {
    if (seat.is_booked) {
      showToast(`Seat ${seat.seat_number} is already booked.`, 'error');
      return;
    }

    setSelectedSeatIds((prev) => {
      const isSelected = prev.includes(seat.id);
      if (isSelected) {
        return prev.filter(id => id !== seat.id);
      } else {
        return [...prev, seat.id];
      }
    });
  };

  // AI Seat Suggestion
  const handleSuggestSeats = async () => {
    try {
      setAiLoading(true);
      const res = await api.getRecommendedSeats(showId, seatCountToRecommend);
      const recIds = res.recommended_seats.map(s => s.id);
      setRecommendedSeatIds(recIds);
      setSelectedSeatIds(recIds); // Auto-select recommended seats
      setAiExplanation(res.explanation || "Seats C4 and C5 provide a balanced center view and are available together.");
      showToast("✨ CineAI suggested and selected the best center seats!", "success");
    } catch (err) {
      console.warn("AI seat recommendation fallback:", err);
      // Heuristic fallback for C4, C5 (Row C middle)
      const c4 = seats.find(s => s.seat_number === 'C4' && !s.is_booked);
      const c5 = seats.find(s => s.seat_number === 'C5' && !s.is_booked);
      const fallbackPicks = [c4, c5].filter(Boolean);
      
      const ids = fallbackPicks.map(s => s.id);
      setRecommendedSeatIds(ids);
      setSelectedSeatIds(ids);
      setAiExplanation("Seats C4 and C5 provide a balanced center view and are available together.");
      showToast("✨ CineAI suggested center seats C4 & C5!", "success");
    } finally {
      setAiLoading(false);
    }
  };

  const selectedSeatObjects = seats.filter(s => selectedSeatIds.includes(s.id));

  const handleProceedToCheckout = (pricing) => {
    if (selectedSeatIds.length === 0) {
      showToast("Please select at least one seat to proceed.", "error");
      return;
    }

    // Save booking intent to session/state and navigate to payment/checkout
    const bookingPayload = {
      showId: parseInt(showId),
      seatIds: selectedSeatIds,
      seats: selectedSeatObjects,
      movie,
      theatre,
      show,
      pricing
    };

    sessionStorage.setItem('pending_booking', JSON.stringify(bookingPayload));
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner message="Arranging cinema seating map..." />;
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <ArrowLeft size={16} />
          Back to Shows
        </button>

        {/* AI Best Seats CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: '#94a3b8' }}>Tickets:</span>
            <select
              value={seatCountToRecommend}
              onChange={(e) => setSeatCountToRecommend(parseInt(e.target.value))}
              style={{
                background: '#131a2a',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '0.2rem 0.4rem',
                fontSize: '0.85rem'
              }}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Seat' : 'Seats'}</option>
              ))}
            </select>
          </div>

          <button
            id="suggest-seats-btn"
            onClick={handleSuggestSeats}
            disabled={aiLoading}
            className="btn-ai"
            style={{ padding: '0.65rem 1.25rem', borderRadius: '12px' }}
          >
            <Sparkles size={16} />
            <span>{aiLoading ? 'Analyzing Layout...' : 'Suggest Best Seats'}</span>
          </button>
        </div>
      </div>

      {/* AI Explanation Banner */}
      {aiExplanation && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '12px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'slideInUp 0.3s ease'
        }}>
          <Sparkles size={18} color="#c084fc" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: '#e9d5ff', flex: 1 }}>
            <span style={{ fontWeight: 700, color: '#fff', marginRight: '4px' }}>CineAI Recommendation:</span>
            {aiExplanation}
          </div>
        </div>
      )}

      {/* Main Grid: Seat Map Left + Summary Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Seat Layout Section */}
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', overflowX: 'auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Choose Your Seats</h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Click to select or deselect seats</p>
          </div>

          <SeatMap
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            recommendedSeatIds={recommendedSeatIds}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Booking Summary Column */}
        <div>
          <BookingSummary
            movie={movie}
            theatre={theatre}
            show={show}
            selectedSeats={selectedSeatObjects}
            onProceed={handleProceedToCheckout}
            proceedButtonText="Proceed to Payment"
          />
        </div>

      </div>

    </div>
  );
}
