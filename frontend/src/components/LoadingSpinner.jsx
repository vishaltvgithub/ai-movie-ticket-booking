import React from 'react';
import { Film } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading cinema experience..." }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      gap: '1rem',
      color: '#94a3b8'
    }}>
      <div style={{
        position: 'relative',
        width: '54px',
        height: '54px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          border: '3px solid rgba(245, 158, 11, 0.15)',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite'
        }} />
        <Film size={22} color="#f59e0b" />
      </div>
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}>{message}</span>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
