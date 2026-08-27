import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const toggleAIChat = () => {
    setIsAIChatOpen(prev => !prev);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top Navigation */}
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />

      {/* Main Routing Views */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home onOpenAIChat={() => setIsAIChatOpen(true)} />} />
          <Route path="/movies" element={<Movies onOpenAIChat={() => setIsAIChatOpen(true)} />} />
          <Route path="/movie/:id" element={<MovieDetails onOpenAIChat={() => setIsAIChatOpen(true)} />} />
          <Route path="/seat-selection/:showId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings onOpenAIChat={() => setIsAIChatOpen(true)} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      {/* Floating UPS CineAI Chatbot Trigger Button (Bottom Right) */}
      <button
        id="floating-ai-btn"
        onClick={toggleAIChat}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          zIndex: 9998,
          background: 'linear-gradient(135deg, #FFB500, #E69D00)',
          color: '#160B08',
          border: '2px solid #351C15',
          borderRadius: '50px',
          padding: '0.75rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(255, 181, 0, 0.45)',
          transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 181, 0, 0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 181, 0, 0.45)';
        }}
      >
        <img src="/ups-logo.webp" alt="UPS" style={{ height: '22px', width: 'auto' }} />
        <span>UPS CineAI</span>
      </button>

      {/* CineAI Chatbot Drawer/Modal */}
      <AIChatbot
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
