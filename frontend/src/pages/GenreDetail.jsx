import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getAnimeByGenre } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const GenreDetail = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [data, setData] = useState({ anime: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAnimeByGenre(slug, page);
      if (res.status === 'success') {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug, page]);

  const goPage = (p) => {
    setSearchParams({ page: p });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">Genre: {slug}</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <>
          <div className="grid-layout">
            {data.anime?.map((item, idx) => (
              <AnimeCard key={idx} anime={item} />
            ))}
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {data.pagination?.has_previous_page && (
              <button className="glass" onClick={() => goPage(data.pagination.previous_page)}>
                Prev
              </button>
            )}
            <span style={{ padding: '0.4rem 0.8rem', color: 'var(--text-secondary)' }}>
              Page {data.pagination?.current_page} / {data.pagination?.last_visible_page || '?'}
            </span>
            {data.pagination?.has_next_page && (
              <button className="glass" onClick={() => goPage(data.pagination.next_page)}>
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GenreDetail;
