import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Globe, Calendar, User, Film, Sparkles, ArrowLeft, Ticket } from 'lucide-react';
import TheatreCard from '../components/TheatreCard';
import ShowTimeSelector from '../components/ShowTimeSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";

export default function MovieDetails({ onOpenAIChat }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const showtimesRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieData, theatresData, showsData] = await Promise.all([
          api.getMovieById(id),
          api.getTheatresByMovie(id),
          api.getShowsForMovie(id)
        ]);

        setMovie(movieData);
        // Fallback to all theatres if movie has no direct theatres linked yet
        if (!theatresData || theatresData.length === 0) {
          const allTheatres = await api.getTheatres();
          setTheatres(allTheatres);
        } else {
          setTheatres(theatresData);
        }
        setShows(showsData || []);
      } catch (err) {
        console.error("Error loading movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const scrollToBooking = () => {
    showtimesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner message="Loading movie details & theatre showtimes..." />;
  }

  if (!movie) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2>Movie Not Found</h2>
        <p style={{ color: '#94a3b8', margin: '1rem 0' }}>The requested movie could not be found.</p>
        <button onClick={() => navigate('/movies')} className="btn-primary">
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>
      
      {/* Back Link */}
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
        onMouseEnter={(e) => e.currentTarget.style.color = '#f59e0b'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero Backdrop & Details Header */}
      <div className="glass-panel" style={{
        padding: '2rem',
        marginBottom: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(19, 26, 42, 0.9), rgba(13, 18, 29, 0.95))',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        
        {/* Poster */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px', margin: '0 auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.6)' }}>
          <img
            src={movie.poster_url || FALLBACK_POSTER}
            alt={movie.title}
            onError={(e) => e.target.src = FALLBACK_POSTER}
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Badges Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-rating">
              <Star size={14} fill="#fbbf24" strokeWidth={0} />
              {Number(movie.rating).toFixed(1)} / 10
            </span>
            <span className="badge badge-lang">{movie.language}</span>
            <span className="badge badge-genre">{movie.genre}</span>
            <span className="badge badge-status" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={12} />
              {movie.duration} Minutes
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, lineHeight: 1.2 }}>
            {movie.title}
          </h1>

          {/* Description */}
          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
            {movie.description}
          </p>

          {/* Cast & Director Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                Director
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                {movie.director}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                Starring Cast
              </span>
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                {movie.cast}
              </span>
            </div>
          </div>

          {/* Book Tickets CTA & Ask AI */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button
              id="book-tickets-btn"
              onClick={scrollToBooking}
              className="btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              <Ticket size={18} />
              Book Tickets Now
            </button>
            <button
              onClick={onOpenAIChat}
              className="btn-ai"
              style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              Ask CineAI About This Movie
            </button>
          </div>

        </div>

      </div>

      {/* Showtimes & Theatres Section */}
      <div ref={showtimesRef} style={{ scrollMarginTop: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Select Theatre & Showtime</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Choose your preferred multiplex and show timing</p>
          </div>
        </div>

        {/* Date Selector */}
        <ShowTimeSelector
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Theatres List */}
        <div>
          {theatres.map((theatre) => {
            // Find shows for this theatre on this date (or all shows for this theatre)
            let theatreShows = shows.filter(s => s.theatre_id === theatre.id);
            if (theatreShows.length === 0) {
              // Create dynamic fallback showtimes if not explicitly mapped
              theatreShows = [
                { id: theatre.id * 10 + 1, movie_id: movie.id, theatre_id: theatre.id, show_time: '10:30 AM', show_date: selectedDate, screen_name: 'Screen 1' },
                { id: theatre.id * 10 + 2, movie_id: movie.id, theatre_id: theatre.id, show_time: '01:45 PM', show_date: selectedDate, screen_name: 'Screen 1' },
                { id: theatre.id * 10 + 3, movie_id: movie.id, theatre_id: theatre.id, show_time: '04:30 PM', show_date: selectedDate, screen_name: 'Screen 2' },
                { id: theatre.id * 10 + 4, movie_id: movie.id, theatre_id: theatre.id, show_time: '07:15 PM', show_date: selectedDate, screen_name: 'Screen 1' },
                { id: theatre.id * 10 + 5, movie_id: movie.id, theatre_id: theatre.id, show_time: '10:30 PM', show_date: selectedDate, screen_name: 'Screen 2' },
              ];
            }

            return (
              <TheatreCard
                key={theatre.id}
                theatre={theatre}
                shows={theatreShows}
                selectedDate={selectedDate}
                onSelectShow={(selectedShow) => {
                  navigate(`/seat-selection/${selectedShow.id}`);
                }}
              />
            );
          })}
        </div>

      </div>

    </div>
  );
}
