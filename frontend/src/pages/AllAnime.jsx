import React, { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard';
import { getAllAnime } from '../services/api';

const AllAnime = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAllAnime();
      if (res.status === 'success') {
        setList(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">All Anime</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div className="grid-layout">
          {list.map((anime, idx) => (
            <AnimeCard key={idx} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAnime;
