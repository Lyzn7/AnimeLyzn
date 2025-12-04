import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGenres } from '../services/api';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getGenres();
      if (res.status === 'success') {
        setGenres(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">Genres</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {genres.map((g) => (
            <Link
              to={`/genre/${g.slug}`}
              key={g.slug}
              className="glass"
              style={{
                padding: '0.6rem 0.9rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {g.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;
