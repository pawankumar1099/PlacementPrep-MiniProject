import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
        active ? 'text-white bg-brand-600/20 border border-brand-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-dark-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center shadow-brand">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight text-lg hidden sm:block">
              Placement <span className="glow-text">Prep AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/resume">Resume</NavLink>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white leading-none">{user?.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{user?.college || 'Student'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-cyan flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button onClick={handleLogout} className="btn-ghost text-slate-400 hover:text-rose-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/8 py-3 space-y-1 animate-slide-up">
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">Dashboard</Link>
            <Link to="/resume" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">Resume Analyzer</Link>
            <div className="pt-2 border-t border-white/8 flex items-center justify-between px-3">
              <span className="text-sm text-slate-400">{user?.name}</span>
              <button onClick={handleLogout} className="text-sm text-rose-400 hover:text-rose-300">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
