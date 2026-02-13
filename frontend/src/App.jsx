import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Ongoing from './pages/Ongoing';
import Completed from './pages/Completed';
import Schedule from './pages/Schedule';
import Genres from './pages/Genres';
import GenreDetail from './pages/GenreDetail';
import Episode from './pages/Episode';
import Batch from './pages/Batch';
import AllAnime from './pages/AllAnime';
import About from './pages/About';
import Secret from './pages/Secret';
import useControlGate from './hooks/useControlGate';

const GateScreen = ({ title, description, actionLabel, onAction }) => (
  <div className="container" style={{ padding: '3rem 1rem', maxWidth: 640 }}>
    <div className="glass" style={{ padding: '2rem', borderRadius: 16, border: '1px solid var(--glass-border)', textAlign: 'center' }}>
      <h2 className="section-title" style={{ marginBottom: '1rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{description}</p>
      {onAction && (
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={onAction}>
          {actionLabel || 'Coba lagi'}
        </button>
      )}
    </div>
  </div>
);

function App() {
  const { status, message, reload } = useControlGate();

  if (status === 'checking') {
    return (
      <GateScreen
        title="Memeriksa Status"
        description="Menghubungkan ke control.json di GitHub untuk memastikan aplikasi masih diizinkan."
      />
    );
  }

  if (status === 'error') {
    return (
      <GateScreen
        title="Tidak bisa memverifikasi"
        description={message || 'Gagal memeriksa status aplikasi. Pastikan koneksi internet aktif atau URL control.json benar.'}
        actionLabel="Muat ulang"
        onAction={reload}
      />
    );
  }

  if (status === 'inactive') {
    return (
      <GateScreen
        title="Aplikasi Dinonaktifkan"
        description={message || 'Aplikasi telah dinonaktifkan oleh developer. Semua fungsi dihentikan.'}
        actionLabel="Cek ulang"
        onAction={reload}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="anime/:slug" element={<Detail />} />
        <Route path="search" element={<Search />} />
        <Route path="ongoing" element={<Ongoing />} />
        <Route path="completed" element={<Completed />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="genres" element={<Genres />} />
        <Route path="genre/:slug" element={<GenreDetail />} />
        <Route path="episode/:slug" element={<Episode />} />
        <Route path="batch/:slug" element={<Batch />} />
        <Route path="all" element={<AllAnime />} />
        <Route path="about" element={<About />} />
        <Route path="secret" element={<Secret />} />
      </Route>
    </Routes>
  );
}

export default App;
