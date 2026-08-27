import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const GENRES = ['All', 'Action', 'Comedy', 'Romance', 'Thriller', 'Sci-Fi', 'Horror'];
const LANGUAGES = ['All', 'Tamil', 'Hindi', 'English'];
const RATINGS = [
  { label: 'All Ratings', value: '' },
  { label: '8.0+ ⭐', value: '8.0' },
  { label: '8.5+ ⭐', value: '8.5' },
];

export default function FilterBar({
  selectedGenre,
  onSelectGenre,
  selectedLanguage,
  onSelectLanguage,
  selectedRating,
  onSelectRating,
  onReset
}) {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>
          <Filter size={16} color="#f59e0b" />
          <span>Filter Movies</span>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <RotateCcw size={13} />
          Reset Filters
        </button>
      </div>

      {/* Genre Pills */}
      <div>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
          Genre
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {GENRES.map((g) => {
            const active = (selectedGenre === g) || (g === 'All' && !selectedGenre);
            return (
              <button
                key={g}
                onClick={() => onSelectGenre(g === 'All' ? '' : g)}
                style={{
                  background: active ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)',
                  color: active ? '#000' : '#cbd5e1',
                  border: active ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '0.35rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s'
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Rating Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {/* Language */}
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Language
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {LANGUAGES.map((l) => {
              const active = (selectedLanguage === l) || (l === 'All' && !selectedLanguage);
              return (
                <button
                  key={l}
                  onClick={() => onSelectLanguage(l === 'All' ? '' : l)}
                  style={{
                    background: active ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#67e8f9' : '#cbd5e1',
                    border: active ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating */}
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
            Minimum Rating
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {RATINGS.map((r) => {
              const active = selectedRating === r.value;
              return (
                <button
                  key={r.label}
                  onClick={() => onSelectRating(r.value)}
                  style={{
                    background: active ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: active ? '#fbbf24' : '#cbd5e1',
                    border: active ? '1px solid rgba(245, 158, 11, 0.6)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
