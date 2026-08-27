import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Film, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenAIChat, onSearchSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery);
      } else {
        navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <div style={{
      position: 'relative',
      padding: '4.5rem 1.5rem 3.5rem',
      background: 'radial-gradient(ellipse at center top, rgba(255, 181, 0, 0.16) 0%, rgba(53, 28, 21, 0.4) 45%, rgba(18, 9, 6, 0) 75%)',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        {/* UPS Shield & Hackathon Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.4rem 1.1rem',
          borderRadius: '30px',
          background: 'rgba(53, 28, 21, 0.9)',
          border: '1px solid #FFB500',
          color: '#FFB500',
          fontSize: '0.85rem',
          fontWeight: 800,
          marginBottom: '1.25rem',
          boxShadow: '0 0 20px rgba(255, 181, 0, 0.25)'
        }}>
          <img src="/ups-logo.webp" alt="UPS" style={{ height: '18px', width: 'auto' }} />
          <span>UPS HACKATHON EDITION • EXPRESS CINEMA ASSISTANT</span>
        </div>

        {/* Large Heading */}
        <h1 style={{
          fontSize: 'clamp(2.3rem, 5.5vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.15,
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #FFFFFF, #FFE082, #FFB500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          Delivering Cinematic Experiences at Speed
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: '#D1C5BD',
          maxWidth: '700px',
          margin: '0 auto 2.25rem',
          lineHeight: 1.6
        }}>
          Smart movie discovery, express seat optimization, and instant ticket delivery powered by Groq-accelerated AI.
        </p>

        {/* Search Bar & Ask AI CTA */}
        <div style={{
          background: 'rgba(19, 26, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '0.5rem',
          alignItems: 'center',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)',
          maxWidth: '680px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: '#64748b' }}>
            <Search size={20} />
          </div>
          <input
            id="hero-search-input"
            type="text"
            placeholder="Search movies, languages (e.g. Tamil), genres, or actors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#f8fafc',
              fontSize: '0.95rem',
              outline: 'none',
              padding: '0.6rem 0.25rem'
            }}
          />
          <button 
            id="hero-search-btn"
            onClick={handleSearch}
            className="btn-primary" 
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', borderRadius: '10px' }}
          >
            Search
          </button>
          <button 
            id="hero-ask-ai-btn"
            onClick={onOpenAIChat}
            className="btn-ai" 
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', borderRadius: '10px' }}
          >
            <Sparkles size={16} />
            Ask AI
          </button>
        </div>

        {/* Quick Search Chips */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.25rem'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>Popular Searches:</span>
          {['Tamil Action', 'Comedy Family', 'Oppenheimer', 'Horror Night', 'Rated > 8'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                navigate(`/movies?q=${encodeURIComponent(term)}`);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                borderRadius: '20px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
            >
              {term}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
