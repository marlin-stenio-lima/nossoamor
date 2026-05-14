import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import LandingPage from './pages/landing';
import Checkout from './pages/checkout';
import ThankYou from './pages/checkout/thank-you';
import RenewPage from './pages/renew';
import { AccessGuard } from './components/AccessGuard';

// New Pages for Dia dos Namorados
import PresenteView from './pages/presente/view';
import EbooksPage from './pages/EbooksPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/renew" element={<RenewPage />} />

        {/* The actual present URL for the couple */}
        <Route path="/p/:id" element={<PresenteView />} />

        {/* Protected Dashboard for the Buyer */}
        <Route element={<AccessGuard />}>
          <Route path="/app" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="configurar" element={<DashboardHome />} />
            <Route path="exportar" element={<DashboardHome />} />
            <Route path="ebooks" element={<EbooksPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
