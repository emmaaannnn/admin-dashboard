import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import DashboardLayout from './layouts/DashboardLayout';
import InventoryHome from './features/inventory/screens/InventoryHome';
import ExpensesHome from './features/expenses/screens/ExpensesHome';

function App() {
  return (
    <Routes>
      {/* Public route, no sidebar */}
      <Route path="/" element={<Home />} />

      {/* Admin layout with sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/inventory" element={<InventoryHome />} />
        <Route path="/expenses" element={<ExpensesHome />} />
        {/* Add more here as needed */}
      </Route>
    </Routes>

  );
}

export default App;