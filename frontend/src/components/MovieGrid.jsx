import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

export default function MovieGrid({ title, subtitle, movies = [], icon: Icon = Film, badgeText = null }) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '8px', 
              background: 'rgba(245, 158, 11, 0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#f59e0b' 
            }}>
              <Icon size={16} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>{title}</h2>
            {badgeText && (
              <span className="badge badge-rating" style={{ fontSize: '0.7rem' }}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: '2.3rem' }}>{subtitle}</p>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
