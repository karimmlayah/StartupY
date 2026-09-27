import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, requireInvestorVerified = false }) {
  const { user, role, loading, profileLoading, isInvestorApproved } = useAuth();
  const location = useLocation();
  const isRoleRoute = location.pathname === '/choose-role';
  const hasApplicationRole = ['startup', 'investor', 'admin'].includes(role);

  if ((loading || profileLoading) && !(user && isRoleRoute)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-coral/40 border-t-coral animate-spin"></div>
        <p className="text-sm text-muted font-medium">Chargement de votre profil…</p>
      </div>
    );
  }

  // 1. If not logged in, redirect to /login with state message and requested path
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          message: "Connectez-vous pour accéder à cet espace Bidaya Tunisia." 
        }} 
        replace 
      />
    );
  }

  // 2. If authenticated but has not chosen role, redirect to /choose-role
  if (!hasApplicationRole && !isRoleRoute) {
    return <Navigate to="/choose-role" replace />;
  }

  // 3. If role is chosen but user is on /choose-role, redirect to corresponding dashboard
  if (hasApplicationRole && isRoleRoute) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'investor') return <Navigate to="/investor" replace />;
    return <Navigate to="/startup" replace />;
  }

  // 4. Check role restrictions if specified
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
    const targetDashboard = role === 'admin' ? '/admin' : role === 'investor' ? '/investor' : '/startup';
    return (
      <Navigate 
        to={targetDashboard} 
        state={{ 
          accessDenied: true, 
          message: "Accès refusé. Votre rôle ne permet pas d’ouvrir cette page." 
        }} 
        replace 
      />
    );
  }

  if (requireInvestorVerified && role === 'investor' && !isInvestorApproved) {
    return <Navigate to="/investor-verification" state={{ message: 'La validation de votre profil investisseur est requise.' }} replace />;
  }

  return children;
}
