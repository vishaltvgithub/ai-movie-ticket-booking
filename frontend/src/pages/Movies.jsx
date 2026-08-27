import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Film, Sparkles, Frown } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function Movies({ onOpenAIChat }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL search param changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchFilteredMovies = async () => {
      try {
        setLoading(true);
        const params = {};
        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (selectedGenre) params.genre = selectedGenre;
        if (selectedLanguage) params.language = selectedLanguage;
        if (selectedRating) params.min_rating = parseFloat(selectedRating);

        const data = await api.searchMovies(params);
        setMovies(data);
      } catch (err) {
        console.error("Error searching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredMovies();
  }, [searchQuery, selectedGenre, selectedLanguage, selectedRating]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedLanguage('');
    setSelectedRating('');
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Explore All Movies
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Discover and book tickets for Tamil, Hindi, and English cinema blockbusters.
          </p>
        </div>

        {/* Ask AI CTA */}
        <button
          onClick={onOpenAIChat}
          className="btn-ai"
          style={{ padding: '0.65rem 1.25rem', borderRadius: '12px' }}
        >
          <Sparkles size={16} />
          <span>Ask CineAI for Recommendations</span>
        </button>
      </div>

      {/* Search Bar Input */}
      <div style={{
        background: 'rgba(19, 26, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <Search size={20} color="#64748b" />
        <input
          type="text"
          placeholder="Search by title, genre, language (e.g. Tamil, English), or actor..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) {
              setSearchParams({ q: e.target.value });
            } else {
              setSearchParams({});
            }
          }}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#f8fafc',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
        selectedRating={selectedRating}
        onSelectRating={setSelectedRating}
        onReset={handleResetFilters}
      />

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.95rem', color: '#cbd5e1', fontWeight: 600 }}>
          Showing <span style={{ color: '#f59e0b', fontWeight: 800 }}>{movies.length}</span> movies
        </div>
      </div>

      {/* Movies Grid / Empty State */}
      {loading ? (
        <LoadingSpinner message="Searching movie catalog..." />
      ) : movies.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Frown size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Movies Found</h3>
          <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            We couldn't find any movie matching your search criteria. Try adjusting your filters or ask CineAI for personalized assistance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={handleResetFilters} className="btn-secondary">
              Reset Filters
            </button>
            <button onClick={onOpenAIChat} className="btn-ai">
              <Sparkles size={16} />
              Ask CineAI
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
