import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiGuideModal from './components/AiGuideModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import AuthChoicePage from './pages/AuthChoicePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChooseRolePage from './pages/ChooseRolePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StartupOnboardingPage from './pages/StartupOnboardingPage';
import InvestorOnboardingPage from './pages/InvestorOnboardingPage';
import ExplorePage from './pages/ExplorePage';
import StartupDetailsPage from './pages/StartupDetailsPage';
import StartupDashboardPage from './pages/StartupDashboardPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OfficialResourcesPage from './pages/OfficialResourcesPage';
import MeetingRoomPage from './pages/MeetingRoomPage';

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

  const handleOpenAiGuide = (role = 'startup', defaultPrompt = '') => {
    setAiModalRole(role);
    setAiModalOpen(true);
  };

  const handleCloseAiGuide = () => {
    setAiModalOpen(false);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#0A0F1D] text-slate-100 selection:bg-blue-600 selection:text-white">
          
          {/* Navigation */}
          <Navbar onOpenAiGuide={handleOpenAiGuide} />

          {/* Page Content */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes Only */}
              <Route path="/" element={<LandingPage onOpenAiGuide={handleOpenAiGuide} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Authentication & Role Assignment */}
              <Route 
                path="/choose-role" 
                element={
                  <ProtectedRoute>
                    <ChooseRolePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <ProtectedRoute>
                    <ChooseRolePage />
                  </ProtectedRoute>
                } 
              />

              {/* Startup-Only Experience */}
              <Route 
                path="/dashboard/startup" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/roadmap" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup-profile" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <StartupOnboardingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup-documents" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup-meetings" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />

              {/* Investor-Only Experience */}
              <Route 
                path="/dashboard/investor" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/investor-verification" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/deal-flow" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <ExplorePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explore" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <ExplorePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup/:id" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <StartupDetailsPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/investor-meetings" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />

              {/* Admin-Only Experience */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* General Protected Features */}
              <Route 
                path="/resources" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'investor', 'admin']}>
                    <OfficialResourcesPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/meeting/:meetingId" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'investor', 'admin']}>
                    <MeetingRoomPage />
                  </ProtectedRoute>
                } 
              />

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
    </AuthProvider>
  );
}
