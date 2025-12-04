import React, { useEffect, useState } from 'react';
import { getHomeData } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const Home = () => {
    const [data, setData] = useState({ ongoing_anime: [], complete_anime: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getHomeData();
                if (result.status === 'success') {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <section style={{ marginBottom: '3rem' }}>
                <h2 className="section-title">Ongoing Anime</h2>
                <div className="grid-layout">
                    {data.ongoing_anime.map((anime, index) => (
                        <AnimeCard key={index} anime={anime} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="section-title">Completed Anime</h2>
                <div className="grid-layout">
                    {data.complete_anime.map((anime, index) => (
                        <AnimeCard key={index} anime={anime} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
