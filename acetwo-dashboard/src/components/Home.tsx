import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/inventory', label: '📦 Inventory' },
  { to: '/expenses', label: '💰 Expenses' },
  { to: '/orders', label: '🛒 Orders' },
  { to: '/invoices', label: '🧾 Invoices' },
  { to: '/customers', label: '🧍 Customers' },
  { to: '/settings', label: '⚙️ Settings' },
];


const Home: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-8 py-16">
      <h1 className="flex justify-center text-4xl font-extrabold tracking-wide mb-12 uppercase text-teal-400 drop-shadow">
        Acetwo Admin Dashboard
      </h1>
      <nav className="flex justify-center gap-6 flex-wrap">
        {navItems.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="home-button no-underline bg-teal-600 px-6 py-3 rounded-xl font-semibold transition transform hover:scale-105 hover:bg-teal-500 shadow-md hover:shadow-lg"
          >
            {label}
          </Link>
        ))}
      </nav>
    </main>
  );
};


export default Home;