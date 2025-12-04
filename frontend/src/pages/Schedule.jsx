import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSchedule } from '../services/api';

const Schedule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getSchedule();
      if (res.status === 'success') {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">Jadwal Rilis</h2>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.map((dayItem) => (
            <div key={dayItem.day} className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0 }}>{dayItem.day}</h3>
              <div className="grid-layout" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {dayItem.anime_list?.map((anime) => (
                  <Link to={`/anime/${anime.slug}`} key={anime.slug} className="anime-card" style={{ display: 'block' }}>
                    <div className="card-image-wrapper">
                      <img src={anime.poster} alt={anime.anime_name} className="card-image" loading="lazy" />
                    </div>
                    <div className="card-content">
                      <h4 className="card-title" title={anime.anime_name}>{anime.anime_name}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
