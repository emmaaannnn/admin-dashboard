import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import InventoryHome from './features/inventory/screens/InventoryHome';
import ExpensesHome from './features/expenses/screens/ExpensesHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<InventoryHome />} />
      <Route path="/expenses" element={<ExpensesHome />} />
    </Routes>
  );
}

export default App;