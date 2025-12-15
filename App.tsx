import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ListingPage from './pages/ListingPage';
import DetailPage from './pages/DetailPage';
import PaymentPage from './pages/PaymentPage';
import NearbyDealsPage from './pages/NearbyDealsPage';
import OffersPage from './pages/OffersPage';
import ProfilePage from './pages/ProfilePage';
import { MarketProvider } from './context/MarketContext';

const App: React.FC = () => {
  return (
    <MarketProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ListingPage />} />
            <Route path="/product/:id" element={<DetailPage />} />
            <Route path="/nearby-deals" element={<NearbyDealsPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </MarketProvider>
  );
};

export default App;