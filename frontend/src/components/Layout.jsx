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
        </div>
    );
};

export default Layout;
