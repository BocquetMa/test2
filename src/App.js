import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import WardrobePage from './pages/WardrobePage';
import OutfitsPage from './pages/OutfitsPage';
import CreateOutfitPage from './pages/CreateOutfitPage';
import OutfitDetailPage from './pages/OutfitDetailPage';
import BodyAnalysisPage from './pages/BodyAnalysisPage';
import VirtualTryOnPage from './pages/VirtualTryOnPage';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <ToastContainer position="top-right" autoClose={3000} />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/wardrobe" element={<WardrobePage />} />
              <Route path="/outfits" element={<OutfitsPage />} />
              <Route path="/outfits/create" element={<CreateOutfitPage />} />
              <Route path="/outfits/:id" element={<OutfitDetailPage />} />
              <Route path="/body-analysis" element={<BodyAnalysisPage />} />
              <Route path="/virtual-try-on/:type/:id" element={<VirtualTryOnPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;