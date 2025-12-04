import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAnimeDetail } from '../services/api';
import { PlayCircle, Star } from 'lucide-react';
import './Detail.css';

const Detail = () => {
    const { slug } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getAnimeDetail(slug);
                if (result.status === 'success') {
                    setAnime(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch detail", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) return <div className="container loading">Loading...</div>;
    if (!anime) return <div className="container error">Anime not found</div>;

    return (
        <div className="detail-page">
            {/* Hero Section with Backdrop */}
            <div className="detail-hero">
                <div className="hero-backdrop" style={{ backgroundImage: `url(${anime.poster})` }}></div>
                <div className="container hero-content">
                    <div className="poster-wrapper">
                        <img src={anime.poster} alt={anime.title} className="detail-poster" />
                    </div>
                    <div className="anime-info">
                        <h1 className="anime-title">{anime.title}</h1>
                        <p className="anime-japanese">{anime.japanese_title}</p>

                        <div className="meta-badges">
                            <span className="badge rating"><Star size={14} fill="currentColor" /> {anime.rating}</span>
                            <span className="badge status">{anime.status}</span>
                            <span className="badge type">{anime.type}</span>
                        </div>

                        <div className="meta-grid">
                            <div className="meta-item">
                                <span className="label">Studio</span>
                                <span className="value">{anime.studio}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Released</span>
                                <span className="value">{anime.release_date}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">Duration</span>
                                <span className="value">{anime.duration}</span>
                            </div>
                        </div>

                        <div className="genres">
                            {anime.genres.map((g, i) => (
                                <Link key={i} to={`/genre/${g.slug}`} className="genre-tag">{g.name}</Link>
                            ))}
                        </div>

                        {anime.batch?.slug && (
                            <Link to={`/batch/${anime.batch.slug}`} className="glass" style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.5rem 0.8rem', borderRadius: '10px' }}>
                                Download Batch
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="container content-section">
                <div className="synopsis-section glass">
                    <h3>Synopsis</h3>
                    <p>{anime.synopsis}</p>
                </div>

                <div className="episodes-section">
                    <h3>Episodes</h3>
                    <div className="episode-list">
                        {anime.episode_lists.map((ep, i) => (
                            <Link key={i} to={`/episode/${ep.slug}`} className="episode-item glass">
                                <PlayCircle size={20} className="play-icon" />
                                <span className="episode-number">Ep {ep.episode_number}</span>
                                <span className="episode-title">{ep.episode.replace(anime.title, '').trim()}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {anime.recommendations?.length > 0 && (
                    <div className="episodes-section">
                        <h3>Recommendations</h3>
                        <div className="grid-layout">
                            {anime.recommendations.map((rec, idx) => (
                                <Link to={`/anime/${rec.slug}`} key={idx} className="anime-card">
                                    <div className="card-image-wrapper">
                                        <img src={rec.poster} alt={rec.title} className="card-image" loading="lazy" />
                                    </div>
                                    <div className="card-content">
                                        <h4 className="card-title" title={rec.title}>{rec.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Detail;
