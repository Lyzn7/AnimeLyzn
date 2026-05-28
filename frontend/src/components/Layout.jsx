import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PullToRefresh from './PullToRefresh';
import Ads from './Ads';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <PullToRefresh>
                    <Ads placement="top" />
                    <Outlet />
                    <Ads placement="bottom" />
                </PullToRefresh>
            </main>
        </div>
    );
};

export default Layout;
