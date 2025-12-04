import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBatchDownload } from '../services/api';
import { Download } from 'lucide-react';

const Batch = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getBatchDownload(slug);
      if (res.status === 'success') {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!data) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Batch not found.</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <img src={data.poster} alt={data.title} style={{ width: 160, borderRadius: '12px' }} />
        <div>
          <h2 style={{ margin: 0 }}>{data.title}</h2>
          <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{data.japanese}</p>
          <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>
            {data.type} • {data.episodes} eps • {data.duration}
          </p>
          <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{data.studios}</p>
        </div>
      </div>

      <div className="glass" style={{ padding: '1rem', borderRadius: '12px' }}>
        <h3 style={{ marginTop: 0 }}>Download Batch</h3>
        {data.downloadUrl?.formats?.map((format, idx) => (
          <div key={idx} style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem' }}>{format.title}</h4>
            {format.qualities?.map((quality, qidx) => (
              <div key={qidx} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>{quality.title} ({quality.size})</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {quality.urls?.map((u, uid) => (
                    <a
                      key={uid}
                      href={u.url}
                      target="_blank"
                      rel="noreferrer"
                      className="glass"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.65rem', borderRadius: '10px' }}
                    >
                      <Download size={14} />
                      {u.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Batch;
