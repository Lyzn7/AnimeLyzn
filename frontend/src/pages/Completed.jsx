import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getCompletedAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const Completed = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = Number(searchParams.get('page') || params.page || 1);
  const [data, setData] = useState({ anime: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getCompletedAnime(pageFromQuery);
      if (res.status === 'success') {
        const animeList = res.data?.completeAnimeData || res.data?.anime || [];
        const pagination = res.data?.paginationData || res.data?.pagination || {};
        setData({ anime: animeList, pagination });
      }
      setLoading(false);
    };
    fetchData();
  }, [pageFromQuery]);

  const goPage = (p) => {
    setSearchParams({ page: p });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">Completed Anime</h2>
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

export default Completed;
