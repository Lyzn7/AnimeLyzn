import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../services/api';
import AnimeCard from '../components/AnimeCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const result = await searchAnime(query);
                if (result.status === 'success') {
                    setResults(result.data);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h2 className="section-title">Search Results for "{query}"</h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Searching...</div>
            ) : results.length > 0 ? (
                <div className="grid-layout">
                    {results.map((anime, index) => (
                        <AnimeCard key={index} anime={anime} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No results found.
                </div>
            )}
        </div>
    );
};

export default Search;
