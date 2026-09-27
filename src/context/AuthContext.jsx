import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getAccessToken, getRefreshToken, setTokens, clearTokens } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [investorProfile, setInvestorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const getCurrentUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setInvestorProfile(null);
      setLoading(false);
      return null;
    }

    try {
      setProfileLoading(true);
      const userData = await api.auth.getMe();
      setUser(userData);

      // If user is investor, fetch investor profile for verification status
      if (userData.role === 'investor') {
        try {
          const invData = await api.investors.getProfile();
          setInvestorProfile(invData);
        } catch (invErr) {
          console.warn('Could not load investor profile:', invErr);
        }
      } else {
        setInvestorProfile(null);
      }

      return userData;
    } catch (err) {
      console.warn('Failed to retrieve current user with token:', err.message);
      // If unauthorized, clear tokens
      if (err.status === 401 || !getRefreshToken()) {
        clearTokens();
        setUser(null);
        setInvestorProfile(null);
      }
      return null;
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  }, []);

  // Initialize auth on load
  useEffect(() => {
    getCurrentUser();

    const handleExpired = () => {
      clearTokens();
      setUser(null);
      setInvestorProfile(null);
    };

    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [getCurrentUser]);

  /**
   * Register a new user in Django
   */
  const register = async ({ email, password, fullName, role, firstName, lastName }) => {
    setLoading(true);
    try {
      let fName = firstName || '';
      let lName = lastName || '';
      if (fullName && !fName) {
        const parts = fullName.trim().split(/\s+/);
        fName = parts[0] || '';
        lName = parts.slice(1).join(' ') || '';
      }

      const res = await api.auth.register({
        email: email.trim().lower ? email.trim().toLowerCase() : email.trim(),
        password,
        first_name: fName,
        last_name: lName,
        role: role || 'startup',
      });

      if (res.access && res.refresh) {
        setTokens({ access: res.access, refresh: res.refresh });
      }

      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log in user with Django SimpleJWT
   */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.auth.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setTokens({ access: res.access, refresh: res.refresh });
      setUser(res.user);

      if (res.user?.role === 'investor') {
        try {
          const inv = await api.investors.getProfile();
          setInvestorProfile(inv);
        } catch {
          // ignore
        }
      }

      return { user: res.user, profile: res.user, access: res.access, refresh: res.refresh };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh JWT token
   */
  const refreshToken = async () => {
    const rf = getRefreshToken();
    if (!rf) throw new Error('No refresh token available');
    const res = await api.auth.refresh(rf);
    setTokens({ access: res.access, refresh: res.refresh });
    return res;
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    } finally {
      clearTokens();
      setUser(null);
      setInvestorProfile(null);
    }
  };

  /**
   * One-time role assignment
   */
  const chooseRole = async (selectedRole) => {
    const res = await api.auth.chooseRole(selectedRole);
    setUser(res.user);
    return res.user;
  };

  const role = user?.role || null;
  const isAuthenticated = Boolean(user && getAccessToken());
  const isInvestorApproved = role === 'admin' || investorProfile?.verification_status === 'approved';

  const value = {
    user,
    profile: user,
    role,
    investorProfile,
    isAuthenticated,
    isInvestorApproved,
    loading,
    profileLoading,
    register,
    signUp: register,
    login,
    signIn: login,
    logout,
    signOut: logout,
    refreshToken,
    getCurrentUser,
    chooseRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
