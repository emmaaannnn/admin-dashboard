import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <main className="home-container">
      <h1>Acetwo Admin Dashboard</h1>
      <nav className="home-nav">
        <Link to="/inventory" className="home-button">📦 Inventory</Link>
        <Link to="/expenses" className="home-button">💰 Expenses</Link>
        <Link to="/orders" className="home-button"> Orders</Link>
        <Link to="/customers" className="home-button"> Customers</Link>
        <Link to="/settings" className="home-button"> Settings</Link>
      </nav>
    </main>
  );
};

export default Home;