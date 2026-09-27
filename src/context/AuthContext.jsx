import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: {
    id: 'usr_admin_demo',
    email: 'admin@bidaya.tn',
    full_name: 'Bidaya Platform Administrator',
    role: 'admin',
    avatar_url: ''
  },
  startup: {
    id: 'usr_founder_demo',
    email: 'founder@agrismart.tn',
    full_name: 'Yassine Karray (Founder)',
    role: 'startup',
    avatar_url: ''
  },
  investor: {
    id: 'usr_investor_demo',
    email: 'investor@carthageangels.tn',
    full_name: 'Sami Ben Amor (Carthage Angels)',
    role: 'investor',
    avatar_url: ''
  },
  new_unassigned: {
    id: 'usr_unassigned_demo',
    email: 'newuser@bidaya.tn',
    full_name: 'Nouveau Membre Tunisie',
    role: null, // Requires /choose-role
    avatar_url: ''
  }
};

const STORAGE_KEYS = {
  DEMO_AUTH_USER: 'bidaya_demo_auth_user',
  DEMO_ROLE: 'bidaya_demo_user_role'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  // Initialize Auth state
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (mounted && currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
            await fetchProfile(currentSession.user.id);
          } else if (mounted) {
            // Check if demo user saved in storage
            loadDemoSession();
          }
        } catch (err) {
          console.warn('Error fetching Supabase session, using fallback demo mode:', err);
          if (mounted) loadDemoSession();
        }
      } else {
        // Fallback demo mode
        loadDemoSession();
      }

      if (mounted) setLoading(false);
    }

    initializeAuth();

    // Listen to Supabase auth events if configured
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
          await fetchProfile(newSession.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });
      subscription = authListener?.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const loadDemoSession = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setProfile(parsed);
        setIsDemoMode(true);
        return;
      }
    } catch (e) {
      // ignore
    }
    // Default to startup demo user
    const defaultUser = DEMO_USERS.startup;
    setUser(defaultUser);
    setProfile(defaultUser);
    setIsDemoMode(true);
  };

  const fetchProfile = async (userId) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Could not fetch profile from Supabase:', error.message);
      } else if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err);
    }
  };

  /**
   * Register new user
   */
  const signUp = async ({ fullName, email, password }) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      setLoading(false);
      if (error) throw error;
      // Newly created user has role: null, redirect to /choose-role
      return data;
    } else {
      // Demo Mode Registration
      const newDemoUser = {
        id: `demo_${Date.now()}`,
        email,
        full_name: fullName,
        role: null, // must go through /choose-role
        avatar_url: ''
      };
      localStorage.setItem(STORAGE_KEYS.DEMO_AUTH_USER, JSON.stringify(newDemoUser));
      setUser(newDemoUser);
      setProfile(newDemoUser);
      setLoading(false);
      return { user: newDemoUser };
    }
  };

  /**
   * Log in user
   */
  const signIn = async ({ email, password }) => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      setLoading(false);
      if (error) throw error;
      return data;
    } else {
      // Demo Mode login check
      let matchingUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!matchingUser) {
        // Fallback for newly registered demo user
        try {
          const stored = localStorage.getItem(STORAGE_KEYS.DEMO_AUTH_USER);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.email.toLowerCase() === email.toLowerCase()) {
              matchingUser = parsed;
            }
          }
        } catch (e) {}
      }

      if (!matchingUser) {
        // Default to a startup user with this email
        matchingUser = {
          id: `demo_${Date.now()}`,
          email,
          full_name: email.split('@')[0],
          role: 'startup',
          avatar_url: ''
        };
      }

      localStorage.setItem(STORAGE_KEYS.DEMO_AUTH_USER, JSON.stringify(matchingUser));
      setUser(matchingUser);
      setProfile(matchingUser);
      setLoading(false);
      return { user: matchingUser };
    }
  };

  /**
   * One-time role selection (startup | investor).
   * User cannot select 'admin' here and cannot change role once selected.
   */
  const chooseRole = async (selectedRole) => {
    if (!['startup', 'investor'].includes(selectedRole)) {
      throw new Error('Invalid role selected. Allowed roles are: startup, investor.');
    }

    // Role cannot be changed once assigned
    if (profile?.role) {
      throw new Error('Your account role has already been assigned and cannot be changed.');
    }

    setLoading(true);

    if (isSupabaseConfigured && supabase && user?.id) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      setLoading(false);
      if (error) throw error;
      setProfile(data);
      return data;
    } else {
      // Demo mode role save
      const updatedUser = {
        ...(user || DEMO_USERS.new_unassigned),
        role: selectedRole
      };
      localStorage.setItem(STORAGE_KEYS.DEMO_AUTH_USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfile(updatedUser);
      setLoading(false);
      return updatedUser;
    }
  };

  /**
   * Reset Password
   */
  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      return true;
    } else {
      // Demo feedback
      return true;
    }
  };

  /**
   * Sign out
   */
  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.DEMO_AUTH_USER);
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  /**
   * Development demo role switcher for quick evaluator testing
   */
  const switchDemoRole = (targetRole) => {
    const demoUser = DEMO_USERS[targetRole] || DEMO_USERS.startup;
    localStorage.setItem(STORAGE_KEYS.DEMO_AUTH_USER, JSON.stringify(demoUser));
    setUser(demoUser);
    setProfile(demoUser);
    setIsDemoMode(true);
  };

  const value = {
    user,
    session,
    profile,
    role: profile?.role || user?.role || null,
    loading,
    isDemoMode,
    isSupabaseConfigured,
    signUp,
    signIn,
    signOut,
    chooseRole,
    resetPassword,
    switchDemoRole
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
