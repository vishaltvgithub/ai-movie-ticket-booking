import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Globe, Ticket, Play } from 'lucide-react';

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";

export default function MovieCard({ movie }) {
  const [imgSrc, setImgSrc] = useState(movie.poster_url || FALLBACK_POSTER);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImgSrc(FALLBACK_POSTER);
  };

  return (
    <div 
      className="movie-card"
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        height: '100%',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(245, 158, 11, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
      }}
    >
      {/* Poster Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '135%', overflow: 'hidden', background: '#0b0f19' }}>
        <img
          src={imgSrc}
          alt={movie.title}
          onError={handleImageError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="poster-img"
        />

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0) 100%)'
        }} />

        {/* Rating Badge Top Right */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '8px',
          padding: '0.25rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          color: '#fbbf24',
          fontWeight: 700,
          fontSize: '0.8rem'
        }}>
          <Star size={13} fill="#fbbf24" strokeWidth={0} />
          <span>{movie.rating ? Number(movie.rating).toFixed(1) : '8.0'}</span>
        </div>

        {/* Language Badge Top Left */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(6, 182, 212, 0.25)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '6px',
          padding: '0.2rem 0.5rem',
          color: '#67e8f9',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase'
        }}>
          {movie.language}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Genre & Duration Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {movie.genre}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} />
            {movie.duration}m
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          lineHeight: 1.3,
          color: '#f8fafc',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {movie.title}
        </h3>

        {/* Description snippet */}
        <p style={{
          fontSize: '0.8rem',
          color: '#94a3b8',
          lineHeight: 1.4,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {movie.description}
        </p>

        {/* Action Button */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link
            to={`/movie/${movie.id}`}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '0.65rem 0.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease',
              textDecoration: 'none'
            }}
          >
            <Ticket size={16} />
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
