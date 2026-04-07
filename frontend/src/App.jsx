import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SucursalesPage from './pages/sucursales/SucursalesPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sucursales" element={<SucursalesPage />} />
        <Route path="*" element={<Navigate to="/sucursales" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;