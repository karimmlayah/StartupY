import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiGuideModal from './components/AiGuideModal';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
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
import FounderIdeaWorkspacePage from './pages/FounderIdeaWorkspacePage';

// Helper to scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}

function AppContent() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalRole, setAiModalRole] = useState('startup');

  const handleOpenAiGuide = (role = 'startup') => {
    setAiModalRole(role);
    setAiModalOpen(true);
  };

  const handleCloseAiGuide = () => {
    setAiModalOpen(false);
  };

  const handleAssistantToggle = (action) => {
    if (action === 'open') setAiModalOpen(true);
    else handleCloseAiGuide();
  };

  const { user, role } = useAuth();

  return (
      <BrowserRouter>
        <ScrollToTop />
        <div className="bidaya-app min-h-screen flex flex-col atmosphere text-ink selection:bg-coral/20 selection:text-ink">
          
          {/* Navigation */}
          <Navbar />

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
                element={<Navigate to="/choose-role" replace />}
              />

              {/* Startup-Only Experience */}
              <Route 
                path="/founder-workspace" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'admin']}>
                    <FounderIdeaWorkspacePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup" 
                element={
                  <ProtectedRoute allowedRoles={['startup']}>
                    <StartupDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard/startup" element={<Navigate to="/startup" replace />} />
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
                path="/onboarding/startup"
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
                path="/investor" 
                element={
                  <ProtectedRoute allowedRoles={['investor']}>
                    <InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard/investor" element={<Navigate to="/investor" replace />} />
              <Route 
                path="/investor-verification" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <InvestorDashboardPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/onboarding/investor"
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']}>
                    <InvestorOnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/deal-flow" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']} requireInvestorVerified>
                    <ExplorePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/explore" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']} requireInvestorVerified>
                    <ExplorePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/startup/:id" 
                element={
                  <ProtectedRoute allowedRoles={['startup', 'investor', 'admin']} requireInvestorVerified>
                    <StartupDetailsPage onOpenAiGuide={handleOpenAiGuide} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/investor-meetings" 
                element={
                  <ProtectedRoute allowedRoles={['investor', 'admin']} requireInvestorVerified>
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
                  <ProtectedRoute allowedRoles={['startup', 'investor', 'admin']} requireInvestorVerified>
                    <MeetingRoomPage />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback */}
              <Route path="*" element={<LandingPage onOpenAiGuide={handleOpenAiGuide} />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* AI Guide Modal (Startup Tunisia Guide / Investor Tunisia Guide) */}
          {user && (
            <AiGuideModal
              isOpen={aiModalOpen}
              onClose={handleAssistantToggle}
              initialRole={role === 'investor' ? 'investor' : aiModalRole}
            />
          )}

        </div>
      </BrowserRouter>
  );
}
