import React from 'react';
import { MapPin, Sparkles, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TheatreCard({ theatre, shows = [], selectedDate, onSelectShow }) {
  const navigate = useNavigate();

  // Group shows by screen or list them chronologically
  const sortedShows = [...shows].sort((a, b) => a.show_time.localeCompare(b.show_time));

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      
      {/* Theatre Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: 'rgba(245, 158, 11, 0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f59e0b' 
            }}>
              <Tv size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{theatre.name}</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem', marginLeft: '2.6rem' }}>
            <MapPin size={14} color="#f59e0b" />
            <span>{theatre.location}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-status" style={{ fontSize: '0.75rem' }}>
            Dolby Atmos & 4K Laser
          </span>
        </div>
      </div>

      {/* Showtimes Pill Strip */}
      <div>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
          Available Showtimes ({selectedDate || 'Today'})
        </span>
        
        {sortedShows.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
            No shows scheduled for the selected date.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {sortedShows.map((show) => (
              <button
                key={show.id}
                onClick={() => {
                  if (onSelectShow) {
                    onSelectShow(show);
                  } else {
                    navigate(`/seat-selection/${show.id}`);
                  }
                }}
                className="showtime-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '95px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {show.show_time}
                </span>
                <span style={{ fontSize: '0.65rem', color: '#fbbf24', marginTop: '2px' }}>
                  {show.screen_name ? show.screen_name.split(' ')[0] + ' ' + (show.screen_name.split(' ')[1] || '') : 'Screen 1'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
