import React, { useMemo, useState } from 'react';
import { searchNeko, getNekoDetail } from '../services/api';

const PIN = '1234';

const Secret = () => {
  const [pinInput, setPinInput] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [query, setQuery] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [rawResponse, setRawResponse] = useState(null);
  const [detailRaw, setDetailRaw] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [error, setError] = useState(null);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === PIN) {
      setAuthorized(true);
      setError(null);
    } else {
      setError('PIN salah. Coba lagi.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchNeko(query.trim());
      setRawResponse(res);
      const data = res?.data || res?.result || res?.results || [];
      setResults(Array.isArray(data) ? data : []);
      if (res?.status !== 'success') {
        setError(res?.message || 'Pencarian mungkin gagal, cek respons mentah di bawah.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mencari.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (url) => {
    if (!url) {
      setError('URL tidak ditemukan pada item ini.');
      return;
    }
    setDetailLoading(true);
    setError(null);
    try {
      const res = await getNekoDetail(url);
      setDetailRaw(res);
      if (res?.status === 'success' && res?.data) {
        setDetailData(res.data);
      } else {
        setDetailData(null);
        setError(res?.message || 'Gagal mengambil detail.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengambil detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleManualDetail = (e) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    fetchDetail(manualUrl.trim());
  };

  const prettified = useMemo(() => {
    if (!rawResponse) return '';
    try {
      return JSON.stringify(rawResponse, null, 2);
    } catch {
      return String(rawResponse);
    }
  }, [rawResponse]);

  const prettifiedDetail = useMemo(() => {
    if (!detailRaw) return '';
    try {
      return JSON.stringify(detailRaw, null, 2);
    } catch {
      return String(detailRaw);
    }
  }, [detailRaw]);

  if (!authorized) {
    return (
      <div className="container" style={{ padding: '3rem 1rem', maxWidth: 480 }}>
        <h2 className="section-title">Secret Access</h2>
        <form onSubmit={handleUnlock} style={{ display: 'grid', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Masukkan PIN untuk akses</span>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 10,
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </label>
          {error && <div style={{ color: '#f87171' }}>{error}</div>}
          <button className="btn btn-primary" type="submit">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 className="section-title">Secret Search</h2>

      <form onSubmit={handleSearch} style={{ display: 'grid', gap: '0.75rem', maxWidth: 520 }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Cari dengan API /anime/neko/search/:query</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="contoh: bocchi"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 10,
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Mencari...' : 'Cari'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setResults([]);
              setRawResponse(null);
              setQuery('');
              setError(null);
            }}
            style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', color: '#f87171' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
        {results.length > 0 ? (
          results.map((item, idx) => {
            const cover = item.img || item.image || item.poster;
            const title = item.title || item.name || item.anime || 'Tanpa judul';
            const url = item.url || item.link || item.href;
            return (
              <div
                key={idx}
                className="glass"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 12,
                  border: '1px solid var(--glass-border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ width: 120, height: 70, overflow: 'hidden', borderRadius: 10, background: 'var(--bg-secondary)' }}>
                  {cover ? (
                    <img src={cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  ) : (
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, padding: 8 }}>No image</div>
                  )}
                </div>
                <div style={{ display: 'grid', gap: '0.35rem' }}>
                  <div style={{ fontWeight: 700 }}>{title}</div>
                  {url && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                      {url}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary"
                      type="button"
                      disabled={detailLoading}
                      onClick={() => fetchDetail(url)}
                    >
                      {detailLoading ? 'Memuat...' : 'Detail'}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
                      onClick={() => navigator.clipboard?.writeText(url || '')}
                      disabled={!url}
                    >
                      Salin URL
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !loading && (
            <div style={{ color: 'var(--text-secondary)' }}>
              Belum ada hasil. Coba cari judul.
            </div>
          )
        )}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gap: '0.75rem', maxWidth: 640 }}>
        <h3 style={{ marginBottom: '0.25rem' }}>Ambil detail langsung dengan URL</h3>
        <form onSubmit={handleManualDetail} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Tempel URL Nekopoi lalu klik Detail"
            style={{
              flex: 1,
              minWidth: 260,
              padding: '0.75rem 1rem',
              borderRadius: 10,
              border: '1px solid var(--glass-border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
          <button className="btn btn-primary" type="submit" disabled={detailLoading}>
            {detailLoading ? 'Memuat...' : 'Detail'}
          </button>
        </form>
      </div>

      {detailData && (
        <div style={{ marginTop: '2rem', display: 'grid', gap: '0.5rem' }}>
          <h3 style={{ marginBottom: '0.25rem' }}>Detail Video</h3>
          <div className="glass" style={{ padding: '1rem', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', alignItems: 'start' }}>
              <div>
                {detailData.img && (
                  <img src={detailData.img} alt={detailData.title} style={{ width: '100%', borderRadius: 10 }} loading="lazy" />
                )}
              </div>
              <div style={{ display: 'grid', gap: '0.35rem' }}>
                <h4 style={{ fontSize: '1.1rem' }}>{detailData.title}</h4>
                {detailData.info && <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{detailData.info}</div>}
                {detailData.genre && <div><strong>Genre:</strong> {detailData.genre}</div>}
                {detailData.anime && <div><strong>Anime:</strong> {detailData.anime}</div>}
                {detailData.producers && <div><strong>Producers:</strong> {detailData.producers}</div>}
                {detailData.duration && <div><strong>Duration:</strong> {detailData.duration}</div>}
                {detailData.size && <div><strong>Size:</strong> {detailData.size}</div>}
                {detailData.sinopsis && <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{detailData.sinopsis}</p>}
              </div>
            </div>

            {detailData.streams?.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h4>Streams</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {detailData.streams.map((s, i) => (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={{ border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}
                    >
                      {s.name || `Stream ${i + 1}`}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {detailData.download?.length > 0 && (
              <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
                <h4>Download</h4>
                {detailData.download.map((d, i) => (
                  <div key={i} className="glass" style={{ padding: '0.75rem', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                    <strong>{d.title || d.type || `Pack ${i + 1}`}</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {(d.links || []).map((l, j) => (
                        <a
                          key={j}
                          href={l.link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn"
                          style={{ border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}
                        >
                          {l.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {rawResponse && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Respons Mentah</h3>
          <pre
            style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: 10,
              border: '1px solid var(--glass-border)',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {prettified}
          </pre>
        </div>
      )}

      {detailRaw && (
        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Respons Detail</h3>
          <pre
            style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: 10,
              border: '1px solid var(--glass-border)',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {prettifiedDetail}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Secret;
