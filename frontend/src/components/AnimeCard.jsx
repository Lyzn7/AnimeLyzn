import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
    const displayDay = anime.release_day || anime.last_release_date || anime.season;
    const displayDate = anime.newest_release_date || anime.aired;
    const displayRating = anime.rating || anime.score;

    return (
        <Link to={`/anime/${anime.slug}`} className="anime-card">
            <div className="card-image-wrapper">
                <img src={anime.poster} alt={anime.title} className="card-image" loading="lazy" />
                <div className="card-overlay">
                    <div className="play-button">
                        <Play fill="white" size={24} />
                    </div>
                </div>
                {anime.current_episode && (
                    <span className="episode-badge">{anime.current_episode}</span>
                )}
                {anime.episode_count && (
                    <span className="episode-badge">{anime.episode_count} Eps</span>
                )}
            </div>
            <div className="card-content">
                <h3 className="card-title" title={anime.title}>{anime.title}</h3>
                <div className="card-meta">
                    {displayDay && <span className="card-day">{displayDay}</span>}
                    {displayDate && <span className="card-date">{displayDate}</span>}
                    {displayRating && <span className="card-rating">ミ. {displayRating}</span>}
                </div>
            </div>
        </Link>
    );
};

export default AnimeCard;
