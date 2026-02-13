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

function App() {
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
