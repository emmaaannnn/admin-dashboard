import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navigationBar.css';

const NavigationBar: React.FC = () => {
  return (
    <aside className="navigation-bar">
      <h2 className="nav-title">ACETWO Admin</h2>
      <img src="/logo2.gif" alt="ACETWO Logo" className="nav-logo" />
      <nav className="nav-links">
        <NavLink to="/inventory" className="nav-link">📦 Inventory</NavLink>
        <NavLink to="/expenses" className="nav-link">💰 Expenses</NavLink>
        <NavLink to="/orders" className="nav-link">🛒 Orders</NavLink>
        <NavLink to="/invoices" className="nav-link">🧾 Invoices</NavLink>
        <NavLink to="/customers" className="nav-link">👥 Customers</NavLink>
        <NavLink to="/settings" className="nav-link">⚙️ Settings</NavLink>
      </nav>
    </aside>
  );
};

export default NavigationBar;