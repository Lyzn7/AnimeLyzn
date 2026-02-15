import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../services/history';
import { Clock, Trash2 } from 'lucide-react';
import '../components/AnimeCard.css';

const History = () => {
  const [items, setItems] = useState(() => getHistory());

  const formatted = useMemo(() =>
    items.map((item) => ({
      ...item,
      dateLabel: item.lastViewed ? new Date(item.lastViewed).toLocaleString() : '',
    })),
  [items]);

  const handleClear = () => {
    clearHistory();
    setItems([]);
  };

  if (!items.length) {
    return (
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h2 className="section-title">History</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Belum ada riwayat tontonan. Buka detail anime untuk menambahkannya.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>History</h2>
        <button className="btn" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }} onClick={handleClear}>
          <Trash2 size={16} style={{ marginRight: 6 }} /> Bersihkan
        </button>
      </div>

      <div className="grid-layout">
        {formatted.map((item, idx) => (
          <Link to={`/anime/${item.slug}`} key={idx} className="anime-card">
            <div className="card-image-wrapper">
              <img src={item.poster} alt={item.title} className="card-image" loading="lazy" />
              <span className="episode-badge" style={{ background: 'rgba(59,130,246,0.8)' }}>
                <Clock size={14} style={{ marginRight: 4 }} />
              </span>
            </div>
            <div className="card-content">
              <h3 className="card-title" title={item.title}>{item.title}</h3>
              <div className="card-meta" style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Terakhir dibuka: {item.dateLabel}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
