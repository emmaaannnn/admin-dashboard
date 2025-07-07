import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <main className="home-container">
      <h1>Acetwo Admin Dashboard</h1>
      <nav className="home-nav">
        <Link to="/inventory" className="home-button">📦 Inventory</Link>
      </nav>
    </main>
  );
};

export default Home;