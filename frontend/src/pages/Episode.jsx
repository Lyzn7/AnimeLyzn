import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getEpisodeDetail, getServerUrl } from '../services/api';
import { PlayCircle, ArrowLeft, Link as LinkIcon, Download } from 'lucide-react';

const Episode = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState('');
  const [loadingServer, setLoadingServer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getEpisodeDetail(slug);
        if (result.status === 'success') {
          setEpisode(result.data);
          setActiveUrl(result.data.stream_url || '');
        }
      } catch (err) {
        console.error('Failed to fetch episode detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const flattenedServers = useMemo(() => {
    if (!episode?.stream_servers) return [];
    return episode.stream_servers.flatMap((group) =>
      group.servers.map((srv) => ({
        quality: group.quality || '',
        ...srv,
      }))
    );
  }, [episode]);

  const handleServerClick = async (serverId) => {
    setLoadingServer(true);
    const res = await getServerUrl(serverId);
    if (res.status === 'success' && res.url) {
      setActiveUrl(res.url);
    }
    setLoadingServer(false);
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!episode) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Episode not found.</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem', color: 'var(--text-primary)' }}>
      <button onClick={() => navigate(-1)} className="glass" style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
        <ArrowLeft size={16} style={{ marginRight: 6 }} />
        Back
      </button>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <PlayCircle />
            <div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 12 }}>{episode.anime?.slug}</p>
              <h2 style={{ margin: 0 }}>{episode.episode}</h2>
            </div>
          </div>
          {activeUrl ? (
            <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                src={activeUrl}
                title={episode.episode}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>No stream URL available.</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: 14 }}>
            <span>
              Prev:{' '}
              {episode.previous_episode ? (
                <Link to={`/episode/${episode.previous_episode.slug}`}>{episode.previous_episode.slug}</Link>
              ) : (
                '-'
              )}
            </span>
            <span>
              Next:{' '}
              {episode.next_episode ? (
                <Link to={`/episode/${episode.next_episode.slug}`}>{episode.next_episode.slug}</Link>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>

        <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Streaming Servers</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {flattenedServers.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No server list.</p>
            ) : (
              flattenedServers.map((srv, idx) => (
                <button
                  key={`${srv.id}-${idx}`}
                  className="glass"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                  onClick={() => handleServerClick(srv.id)}
                  disabled={loadingServer}
                >
                  <LinkIcon size={14} style={{ marginRight: 6 }} />
                  {srv.name} {srv.quality}
                </button>
              ))
            )}
          </div>
          {loadingServer && <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Switching server...</p>}
        </div>

        <div className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
          <h3 style={{ marginTop: 0 }}>Download</h3>
          {episode.download_urls ? (
            Object.entries(episode.download_urls).map(([format, items]) => (
              <div key={format} style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem' }}>{format.toUpperCase()}</h4>
                {items.map((resItem, idx) => (
                  <div key={idx} style={{ marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{resItem.resolution}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {resItem.urls.map((u, idy) => (
                        <a
                          key={idy}
                          href={u.url}
                          target="_blank"
                          rel="noreferrer"
                          className="glass"
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Download size={14} />
                          {u.provider}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No download links.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Episode;
