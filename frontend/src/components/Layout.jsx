import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PullToRefresh from './PullToRefresh';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <PullToRefresh>
                    <Outlet />
                </PullToRefresh>
            </main>
            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                <p>&copy; 2025 Anime Lyzn. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
