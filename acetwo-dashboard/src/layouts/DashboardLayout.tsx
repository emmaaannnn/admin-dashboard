// DashboardLayout.tsx
import React from 'react';
import NavigationBar from '../components/NavigationBar';
import { Outlet } from 'react-router-dom';


const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <NavigationBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;