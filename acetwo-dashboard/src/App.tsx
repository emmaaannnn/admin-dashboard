import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import InventoryHome from './features/inventory/screens/InventoryHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inventory" element={<InventoryHome />} />
    </Routes>
  );
}

export default App;