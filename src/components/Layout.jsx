import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  Dumbbell, 
  Utensils, 
  MessageSquare, 
  TrendingUp, 
  Bookmark, 
  User, 
  Menu, 
  X, 
  LogOut,
  Zap,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'BMI Calculator', href: '/bmi', icon: Calculator },
  { name: 'Workout Planner', href: '/workout-planner', icon: Dumbbell },
  { name: 'Meal Planner', href: '/meal-planner', icon: Utensils },
  { name: 'Goal Analysis', href: '/goal-analysis', icon: Zap },
  { name: 'Progress', href: '/progress', icon: Activity },
  { name: 'Saved Plans', href: '/saved-plans', icon: Bookmark },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout, userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans antialiased flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#050505] border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-lg shadow-[0_0_15px_rgba(163,230,53,0.4)]"></div>
              <span className="text-xl font-bold tracking-tight text-white">FitFusion <span className="text-lime-400">AI</span></span>
            </Link>
            <button className="lg:hidden p-2 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/5 text-white border-l-4 border-lime-400' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-lime-400' : ''}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 mb-4 group cursor-pointer hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-lime-400/30 overflow-hidden flex items-center justify-center shrink-0">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white">
                    {userProfile?.displayName ? userProfile.displayName.substring(0, 2).toUpperCase() : 'FT'}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white leading-tight truncate">{userProfile?.displayName || 'Fitness Pro'}</p>
                <p className="text-[10px] text-lime-400 font-bold uppercase tracking-widest">Pro Member</p>
              </div>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#050505]">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 shrink-0 lg:h-20 lg:sticky lg:top-0 lg:z-30 bg-[#050505]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-400">
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-xl font-bold tracking-tight text-white">FitFusion <span className="text-lime-400">AI</span></span>
          </div>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-white">
              {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">Monday, May 11, 2026</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10">
              <button className="px-3 py-1 bg-lime-400 text-black text-[10px] font-bold rounded-md uppercase tracking-wider">Overview</button>
              <button className="px-3 py-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors">Analytics</button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
