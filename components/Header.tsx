
import React from 'react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('portal')}
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-2">E</div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">EduElevate</span>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center text-sm font-medium">
            {isLoggedIn && (
              <>
                <button onClick={() => onNavigate('dashboard')} className={`${currentPage === 'dashboard' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Dashboard</button>
                <button onClick={() => onNavigate('courses')} className={`${currentPage === 'courses' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Courses</button>
                <button onClick={() => onNavigate('community')} className={`${currentPage === 'community' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Community</button>
                <button onClick={() => onNavigate('profile')} className={`${currentPage === 'profile' ? 'text-emerald-600' : 'text-slate-600'} hover:text-emerald-500 transition`}>Profile</button>
                <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition text-xs ml-4">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
