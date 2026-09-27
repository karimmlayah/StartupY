import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Verifying Bidaya authentication...</p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but has not chosen role, redirect to /choose-role
  if (!role && location.pathname !== '/choose-role') {
    return <Navigate to="/choose-role" replace />;
  }

  // If role is chosen but user is on /choose-role, redirect to corresponding dashboard
  if (role && location.pathname === '/choose-role') {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'investor') return <Navigate to="/dashboard/investor" replace />;
    return <Navigate to="/dashboard/startup" replace />;
  }

  // Check role restrictions if specified
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'investor') return <Navigate to="/dashboard/investor" replace />;
    return <Navigate to="/dashboard/startup" replace />;
  }

  return children;
}
