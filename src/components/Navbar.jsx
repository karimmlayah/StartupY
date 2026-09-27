import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  LayoutDashboard, 
  Menu, 
  X, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  BookOpen,
  Globe,
  LogOut,
  ShieldCheck,
  User,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAiGuide }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut, isDemoMode, switchDemoRole } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Explore Startups', path: '/explore', icon: Compass },
    { name: 'Official Resources', path: '/resources', icon: BookOpen },
    { name: 'Startup Dashboard', path: '/dashboard/startup', icon: LayoutDashboard },
    { name: 'Investor Dashboard', path: '/dashboard/investor', icon: TrendingUp },
  ];

  // If user is admin or in demo mode, add Admin link
  if (role === 'admin' || isDemoMode) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: ShieldCheck });
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0A0F1D]/85 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[11px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 font-extrabold text-xl tracking-tight">
                  BT
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0A0F1D]" title="Tunisia Hub"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
                  Bidaya Tunisia
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-400 border border-blue-500/30">
                  AI & Capital
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                Connecting Tunisian Startups with Smart Capital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'text-white bg-slate-800/80 shadow-sm border border-slate-700/60'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* AI Guide Trigger */}
            <button
              onClick={() => onOpenAiGuide('startup')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-violet-300 bg-violet-950/40 border border-violet-700/40 hover:bg-violet-900/50 shadow-sm transition-all cursor-pointer"
              title="Open Startup Tunisia AI Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Tunisia AI Guide</span>
            </button>

            {/* Authenticated User / Role Badge / Logout */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    role === 'admin' ? 'bg-amber-400' : role === 'investor' ? 'bg-violet-400' : 'bg-blue-400'
                  }`}></span>
                  <span className="font-bold text-slate-200 capitalize">{role || 'User'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-md shadow-blue-600/20 transition-all"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenAiGuide('startup')}
              className="p-2 rounded-lg text-violet-400 bg-violet-950/40 border border-violet-800/50"
              aria-label="AI Guide"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0A0F1D]/95 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-400" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-white">{user.full_name || user.email}</div>
                  <div className="text-slate-400 text-[11px] capitalize">Role: {role || 'Unassigned'}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:bg-slate-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
