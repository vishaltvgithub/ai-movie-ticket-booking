import React, { useState, useEffect } from 'react';
import { Film, Flame, Sparkles, Calendar, Tv, Ticket, Award } from 'lucide-react';
import Hero from '../components/Hero';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

export default function Home({ onOpenAIChat }) {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState({
    movies_count: 12,
    theatres_count: 5,
    shows_today_count: 45,
    bookings_count: 24
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, statsData] = await Promise.allSettled([
          api.getMovies(),
          api.getStats()
        ]);

        if (moviesData.status === 'fulfilled') {
          setMovies(moviesData.value);
        }
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter into categories
  const nowShowing = movies.filter(m => m.status === 'now_showing');
  const trending = movies.filter(m => m.status === 'trending' || m.rating >= 8.5);
  const recommended = movies.filter(m => m.rating >= 8.3);
  const upcoming = movies.filter(m => m.status === 'upcoming');

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <Hero onOpenAIChat={onOpenAIChat} />

      {/* Statistics Metric Bar */}
      <div style={{ maxWidth: '1280px', margin: '-1.5rem auto 3rem', padding: '0 1.5rem', position: 'relative', zIndex: 20 }}>
        <div className="glass-panel" style={{
          padding: '1.25rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5rem',
          background: 'rgba(38, 20, 15, 0.88)',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 181, 0, 0.35)',
          borderRadius: '16px'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255, 181, 0, 0.18)', border: '1px solid rgba(255, 181, 0, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB500' }}>
              <Film size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFDF9', display: 'block', lineHeight: 1 }}>
                {stats.movies_count}+
              </span>
              <span style={{ fontSize: '0.75rem', color: '#D1C5BD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Movies Available
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(255, 181, 0, 0.18)', border: '1px solid rgba(255, 181, 0, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB500' }}>
              <Tv size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFDF9', display: 'block', lineHeight: 1 }}>
                {stats.theatres_count}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#D1C5BD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Express Theatres
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.18)', border: '1px solid rgba(56, 189, 248, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
              <Calendar size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFDF9', display: 'block', lineHeight: 1 }}>
                {stats.shows_today_count}+
              </span>
              <span style={{ fontSize: '0.75rem', color: '#D1C5BD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Shows Today
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.18)', border: '1px solid rgba(52, 211, 153, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
              <Ticket size={22} />
            </div>
            <div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFDF9', display: 'block', lineHeight: 1 }}>
                {stats.bookings_count}+
              </span>
              <span style={{ fontSize: '0.75rem', color: '#D1C5BD', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                UPS Cinema Passes
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem 4rem' }}>
        {loading ? (
          <LoadingSpinner message="Fetching today's cinematic lineup..." />
        ) : (
          <>
            {/* Now Showing */}
            <MovieGrid
              title="Now Showing"
              subtitle="Catch the biggest cinematic blockbusters playing in theatres today"
              movies={nowShowing}
              icon={Film}
              badgeText="Live in Theatres"
            />

            {/* Trending Movies */}
            <MovieGrid
              title="Trending Movies"
              subtitle="Top audience favorites with packed shows and rave reviews"
              movies={trending}
              icon={Flame}
              badgeText="Popular"
            />

            {/* AI Recommended */}
            <MovieGrid
              title="Recommended For You"
              subtitle="Curated by CineAI intelligence matching top critical ratings"
              movies={recommended}
              icon={Sparkles}
              badgeText="AI Curated"
            />

            {/* Upcoming Movies */}
            {upcoming.length > 0 && (
              <MovieGrid
                title="Upcoming Releases"
                subtitle="Exclusive advance glimpses into the biggest movies releasing soon"
                movies={upcoming}
                icon={Calendar}
                badgeText="Coming Soon"
              />
            )}
          </>
        )}
      </main>

    </div>
  );
}
