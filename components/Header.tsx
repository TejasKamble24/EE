
import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNav('portal')}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">E</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">EduElevate</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
            {isLoggedIn && (
              <>
                <button onClick={() => handleNav('dashboard')} className={`${currentPage === 'dashboard' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Dashboard</button>
                <button onClick={() => handleNav('courses')} className={`${currentPage === 'courses' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Courses</button>
                <button onClick={() => handleNav('community')} className={`${currentPage === 'community' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Community</button>
                <button onClick={() => handleNav('profile')} className={`${currentPage === 'profile' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Profile</button>
                <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition text-xs ml-4">Logout</button>
              </>
            )}
            {!isLoggedIn && (
               <button onClick={() => handleNav('login')} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">Login</button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-emerald-600 p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isLoggedIn ? (
              <>
                <button onClick={() => handleNav('dashboard')} className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentPage === 'dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}>Dashboard</button>
                <button onClick={() => handleNav('courses')} className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentPage === 'courses' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}>Courses</button>
                <button onClick={() => handleNav('community')} className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentPage === 'community' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}>Community</button>
                <button onClick={() => handleNav('profile')} className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${currentPage === 'profile' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}>Profile</button>
                <button onClick={onLogout} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <button onClick={() => handleNav('login')} className="block w-full text-center px-3 py-3 rounded-md text-base font-bold bg-emerald-600 text-white">Login / Start Free</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
