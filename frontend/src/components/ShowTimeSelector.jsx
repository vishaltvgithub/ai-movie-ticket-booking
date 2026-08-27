import React from 'react';
import { Calendar } from 'lucide-react';

export default function ShowTimeSelector({ selectedDate, onSelectDate }) {
  // Generate next 4 days starting from today
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();

    dates.push({
      dateStr,
      dayName,
      monthName,
      dayNum,
    });
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, paddingRight: '0.5rem' }}>
        <Calendar size={16} color="#f59e0b" />
        <span>Date:</span>
      </div>

      {dates.map((item) => {
        const isSelected = selectedDate === item.dateStr || (!selectedDate && item.dayName === 'Today');
        return (
          <button
            key={item.dateStr}
            onClick={() => onSelectDate(item.dateStr)}
            style={{
              background: isSelected ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.05)',
              color: isSelected ? '#000' : '#f8fafc',
              border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              minWidth: '70px',
              transition: 'all 0.2s',
              boxShadow: isSelected ? '0 4px 15px rgba(245, 158, 11, 0.35)' : 'none'
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6, textTransform: 'uppercase' }}>
              {item.dayName}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>
              {item.dayNum}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, opacity: isSelected ? 0.9 : 0.6 }}>
              {item.monthName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
