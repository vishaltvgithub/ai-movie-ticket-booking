import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, Ticket, ExternalLink, RefreshCw, Film } from 'lucide-react';
import api from '../services/api';

const DEFAULT_SUGGESTIONS = [
  "Recommend a Tamil action movie",
  "Funny family movie tonight",
  "Top movies rated above 8",
  "Suggest best seats for cinema",
  "Show evening shows"
];

export default function AIChatbot({ isOpen, onClose, currentMovieId = null }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hi! 👋 I'm CineAI. Tell me what kind of movie experience you're looking for.",
      recommendations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.askAIChat(query, currentMovieId);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply || "Here are some recommendations based on your preferences!",
        recommendations: response.recommendations || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (response.quick_suggestions && response.quick_suggestions.length > 0) {
        setSuggestions(response.quick_suggestions);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      // Fallback local response
      let fallbackText = "I'm looking for the perfect movie for you! Here are some of our top blockbusters:";
      let fallbackRecs = [];
      try {
        const topMovies = await api.getRecommendedMovies(3);
        fallbackRecs = topMovies;
      } catch (e) {
        fallbackText = "Here are our top trending movies playing today!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackText,
          recommendations: fallbackRecs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="cineai-chat-window"
      style={{
        position: 'fixed',
        bottom: '85px',
        right: '25px',
        width: 'min(420px, calc(100vw - 30px))',
        height: 'min(620px, calc(100vh - 120px))',
        background: '#1A0E0A',
        borderRadius: '20px',
        border: '2px solid rgba(255, 181, 0, 0.45)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 181, 0, 0.25)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #351C15, #1F100B)',
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid rgba(255, 181, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 0 8px rgba(255, 181, 0, 0.4))'
          }}>
            <img src="/ups-logo.webp" alt="UPS Shield" style={{ height: '30px', width: 'auto' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFDF9', margin: 0 }}>
                UPS <span style={{ color: '#FFB500' }}>CineAI</span>
              </h3>
              <span style={{ background: '#FFB500', color: '#160B08', fontSize: '0.6rem', fontWeight: 900, padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                GROQ
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
              Live Express Cinema Concierge
            </span>
          </div>
        </div>

        <button
          id="close-chat-btn"
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 181, 0, 0.2)',
            borderRadius: '8px',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#D1C5BD',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#120906'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '100%'
            }}
          >
            {/* Bubble */}
            <div
              style={{
                maxWidth: '85%',
                padding: '0.85rem 1rem',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #FFB500, #E69D00)'
                  : 'rgba(53, 28, 21, 0.95)',
                color: msg.sender === 'user' ? '#160B08' : '#FFFDF9',
                fontWeight: msg.sender === 'user' ? 700 : 400,
                fontSize: '0.875rem',
                lineHeight: 1.45,
                border: msg.sender === 'ai' ? '1px solid rgba(255, 181, 0, 0.25)' : 'none',
                boxShadow: msg.sender === 'user' ? '0 4px 14px rgba(255, 181, 0, 0.35)' : '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              {msg.text}
            </div>

            {/* Movie Recommendation Cards inside Chat */}
            {msg.recommendations && msg.recommendations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem', width: '100%' }}>
                {msg.recommendations.map((movie) => (
                  <div
                    key={movie.id}
                    style={{
                      background: 'rgba(19, 26, 42, 0.95)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      style={{ width: '50px', height: '70px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {movie.title}
                      </h5>
                      <div style={{ fontSize: '0.75rem', color: '#c084fc', marginBottom: '0.4rem' }}>
                        {movie.language} • {movie.genre} • ⭐{movie.rating}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/movie/${movie.id}`);
                          }}
                          style={{
                            background: '#f59e0b',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <Ticket size={12} />
                          Book Now
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/movie/${movie.id}`);
                          }}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: '#cbd5e1',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '3px', padding: '0 4px' }}>
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', animation: 'pulseGlow 1s infinite alternate' }} />
            <span>CineAI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div style={{
        padding: '0.55rem 0.75rem',
        background: '#160C08',
        borderTop: '1px solid rgba(255, 181, 0, 0.15)',
        display: 'flex',
        gap: '0.45rem',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s)}
            style={{
              background: 'rgba(53, 28, 21, 0.9)',
              border: '1px solid rgba(255, 181, 0, 0.35)',
              color: '#FFB500',
              borderRadius: '16px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        style={{
          padding: '0.85rem',
          background: '#23120E',
          borderTop: '1px solid rgba(255, 181, 0, 0.2)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}
      >
        <input
          id="cineai-input"
          type="text"
          placeholder="Ask UPS CineAI for movies, showtimes, seats..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(38, 20, 15, 0.9)',
            border: '1px solid rgba(255, 181, 0, 0.3)',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem',
            color: '#FFFDF9',
            fontSize: '0.875rem',
            outline: 'none'
          }}
        />
        <button
          id="cineai-send-btn"
          type="submit"
          disabled={loading || !inputMessage.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #FFB500, #E69D00)',
            border: 'none',
            color: '#160B08',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: loading || !inputMessage.trim() ? 0.5 : 1,
            boxShadow: '0 2px 10px rgba(255, 181, 0, 0.3)'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
