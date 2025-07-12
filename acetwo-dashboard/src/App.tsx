import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';

import DashboardLayout from './layouts/dashboardLayout';

import InventoryHome from './features/inventory/screens/inventoryHome';
import ItemDetails from './features/inventory/screens/itemDetails';

import ExpensesHome from './features/expenses/screens/ExpensesHome';

function App() {
  return (
    <Routes>
      {/* Public route, no sidebar */}
      <Route path="/" element={<Home />} />

      {/* Admin layout with sidebar */}
      <Route element={<DashboardLayout />}>
        {/* INVENTORY ROUTES */}
        <Route path="/inventory" element={<InventoryHome />} />
        <Route path="/inventory/new" element={<ItemDetails />} />         {/* Create */}
        <Route path="/inventory/:itemId" element={<ItemDetails />} />     {/* Edit */}

        {/* EXPENSES ROUTES */}
        <Route path="/expenses" element={<ExpensesHome />} />

        {/* Add more here as needed */}
      </Route>
    </Routes>

  );
}

export default App;