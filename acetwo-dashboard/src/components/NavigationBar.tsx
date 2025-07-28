import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/inventory', label: '📦 Inventory' },
  { to: '/expenses', label: '💰 Expenses' },
  { to: '/orders', label: '🛒 Orders' },
  { to: '/invoices', label: '🧾 Invoices' },
  { to: '/customers', label: '🧍 Customers' },
  { to: '/settings', label: '⚙️ Settings' },
];

const NavigationBar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[180px] bg-[#2d2f3a] text-white flex flex-col p-4 shadow-[2px_0_5px_rgba(0,0,0,0.15)]">
      <h2 className="mb-8 text-xl font-semibold text-center">ACETWO Admin</h2>
      <img src="/logo2.gif" alt="ACETWO Logo" className="ml-2 mb-6 w-8 h-auto rounded-md" />
      <nav className="flex flex-col gap-4">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? "bg-[#50526a] text-white text-[1.1rem] px-4 py-2 rounded-md"
                : "text-[#ccc] text-[1.1rem] px-4 py-2 rounded-md hover:bg-[#3d3f4d] hover:text-white transition-colors duration-200"
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default NavigationBar;