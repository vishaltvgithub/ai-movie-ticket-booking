import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export default function SeatMap({
  seats = [],
  selectedSeatIds = [],
  recommendedSeatIds = [],
  onToggleSeat
}) {
  // Group seats by row letter (A, B, C, D, E)
  const rows = ['E', 'D', 'C', 'B', 'A']; // E at top (VIP) down to A (Regular)
  
  const seatsByRow = {};
  rows.forEach(r => seatsByRow[r] = []);

  seats.forEach(s => {
    const rowChar = s.seat_number.charAt(0).toUpperCase();
    if (seatsByRow[rowChar]) {
      seatsByRow[rowChar].push(s);
    }
  });

  // Sort seats in each row by column number
  rows.forEach(r => {
    seatsByRow[r].sort((a, b) => {
      const colA = parseInt(a.seat_number.substring(1), 10);
      const colB = parseInt(b.seat_number.substring(1), 10);
      return colA - colB;
    });
  });

  const getTierName = (row) => {
    if (row === 'E') return 'VIP (₹300)';
    if (row === 'D' || row === 'C') return 'Premium (₹220)';
    return 'Regular (₹150)';
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Curved Cinema Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen-curve" />
        <div className="cinema-screen-text">
          ALL EYES THIS WAY • CINEMA SCREEN
        </div>
      </div>

      {/* Seat Rows Matrix */}
      <div className="seat-grid" style={{ width: '100%', maxWidth: '580px' }}>
        {rows.map((rowLetter) => {
          const rowSeats = seatsByRow[rowLetter] || [];
          return (
            <div key={rowLetter} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: rowLetter === 'C' ? '0.75rem' : '0.2rem' }}>
              
              {/* Row Tier Header */}
              {(rowLetter === 'E' || rowLetter === 'D' || rowLetter === 'B') && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.4rem 0 0.2rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {getTierName(rowLetter)}
                  </span>
                </div>
              )}

              <div className="seat-row" style={{ justifyContent: 'center' }}>
                <div className="seat-row-label">{rowLetter}</div>

                <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                  {rowSeats.map((seat, index) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isRecommended = recommendedSeatIds.includes(seat.id);
                    const isBooked = seat.is_booked;

                    return (
                      <React.Fragment key={seat.id}>
                        {/* Aisle gap between col 4 and 5 */}
                        {index === 4 && <div style={{ width: '16px' }} />}
                        
                        <button
                          id={`seat-${seat.seat_number}`}
                          disabled={isBooked}
                          onClick={() => onToggleSeat(seat)}
                          className={`seat-btn ${isSelected ? 'seat-selected' : ''} ${isBooked ? 'seat-booked' : ''} ${isRecommended && !isSelected ? 'seat-ai-recommended' : ''}`}
                          title={`${seat.seat_number} - ${seat.seat_type} (₹${seat.price}) ${isBooked ? '[BOOKED]' : isSelected ? '[SELECTED]' : '[AVAILABLE]'}`}
                        >
                          {seat.seat_number.substring(1)}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                <div className="seat-row-label">{rowLetter}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seat Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1.25rem',
        marginTop: '2rem',
        padding: '0.85rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '30px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#1e293b', border: '1px solid #475569' }} />
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#f59e0b', boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)' }} />
          <span>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#19202f', border: '1px solid #26334d' }} />
          <span>Booked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.2)' }} />
          <span>AI Pick</span>
        </div>
      </div>

    </div>
  );
}
