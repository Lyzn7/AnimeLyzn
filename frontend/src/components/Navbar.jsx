import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logoapp.ico';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <nav className="navbar glass">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <img src={logo} alt="Anime Lyzn" className="logo-img" />
                    <span className="logo-text">Anime</span>
                    <span className="logo-accent"> Lyzn</span>
                </Link>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search anime..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </form>

                <div className="nav-actions">
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/ongoing" className="nav-link">Ongoing</Link>
                        <Link to="/completed" className="nav-link">Completed</Link>
                        <Link to="/schedule" className="nav-link">Schedule</Link>
                        <Link to="/genres" className="nav-link">Genres</Link>
                        {/* <Link to="/all" className="nav-link">All</Link> */}
                        <Link to="/history" className="nav-link">History</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
