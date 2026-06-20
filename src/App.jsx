import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import InputTransaction from './pages/InputTransaction';
import Report from './pages/Report';
import Wallet from './pages/Wallet';
import Register from './pages/Register';
import { FinanceProvider } from './context/FinanceContext';

function App() {
  return (
    <FinanceProvider>
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes (Dummy structure, no actual auth guard yet) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/input" element={<InputTransaction />} />
          <Route path="/report" element={<Report />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>
      </Routes>
    </Router>
    </FinanceProvider>
  );
}

export default App;
