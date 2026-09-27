import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiGuideModal from './components/AiGuideModal';
import LandingPage from './pages/LandingPage';
import AuthChoicePage from './pages/AuthChoicePage';
import StartupOnboardingPage from './pages/StartupOnboardingPage';
import InvestorOnboardingPage from './pages/InvestorOnboardingPage';
import ExplorePage from './pages/ExplorePage';
import StartupDetailsPage from './pages/StartupDetailsPage';
import StartupDashboardPage from './pages/StartupDashboardPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import OfficialResourcesPage from './pages/OfficialResourcesPage';

// Helper to scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalRole, setAiModalRole] = useState('startup');

  const handleOpenAiGuide = (role = 'startup') => {
    setAiModalRole(role);
    setAiModalOpen(true);
  };

  const handleCloseAiGuide = () => {
    setAiModalOpen(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0A0F1D] text-slate-100 selection:bg-blue-600 selection:text-white">
        
        {/* Navigation */}
        <Navbar onOpenAiGuide={handleOpenAiGuide} />

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/auth" element={<AuthChoicePage />} />
            <Route path="/onboarding/startup" element={<StartupOnboardingPage />} />
            <Route path="/onboarding/investor" element={<InvestorOnboardingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/resources" element={<OfficialResourcesPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/startup/:id" element={<StartupDetailsPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/dashboard/startup" element={<StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/startup-dashboard" element={<StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/dashboard/investor" element={<InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />} />
            <Route path="/investor-dashboard" element={<InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />} />
            {/* Fallback */}
            <Route path="*" element={<LandingPage onOpenAiGuide={handleOpenAiGuide} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer onOpenAiGuide={handleOpenAiGuide} />

        {/* AI Guide Modal (Startup Tunisia Guide / Investor Tunisia Guide) */}
        <AiGuideModal
          isOpen={aiModalOpen}
          onClose={handleCloseAiGuide}
          initialRole={aiModalRole}
        />

      </div>
    </BrowserRouter>
  );
}
