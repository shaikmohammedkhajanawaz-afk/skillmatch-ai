import React from 'react';
import { 
  Sparkles, 
  FileSearch, 
  FileText, 
  LayoutDashboard, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Globe, 
  GraduationCap, 
  Settings, 
  X,
  Target,
  Layers,
  Radio
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import Logo from './Logo';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}) {
  const { user: clerkUser } = useUser();

  const navCategories = [
    {
      title: 'Overview',
      items: [
        { id: 'home', label: 'Home Overview', icon: Sparkles },
        { id: 'dashboard', label: 'Candidate Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'AI & Resume Suite',
      items: [
        { id: 'analyzer', label: 'Resume Analyzer', icon: FileSearch },
        { id: 'builder', label: 'Resume Builder', icon: FileText },
        { id: 'portfolio', label: 'AI Portfolio Generator', icon: Globe },
      ]
    },
    {
      title: 'Career & Opportunities',
      items: [
        { id: 'jobs', label: 'Jobs', icon: Layers, badge: 'DB' },
        { id: 'jobs_live', label: 'Live Jobs', icon: Radio, badge: 'LIVE' },
        { id: 'gap', label: 'Skill Gap Analysis', icon: Target },
        { id: 'chat', label: 'AI Career Coach', icon: Bot, badge: 'AI' },
      ]
    },
    {
      title: 'Assessments',
      items: [
        { id: 'exam', label: 'Practice Exam', icon: GraduationCap, badge: 'EXAM' },
      ]
    },
    {
      title: 'Account & Settings',
      items: [
        { id: 'profile', label: 'User Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleNavClick = (id) => {
    if (id === 'settings') {
      setActiveTab('dashboard');
    } else {
      setActiveTab(id);
    }
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-2xl transition-all duration-300 ease-in-out flex flex-col justify-between ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo & Collapse Toggle */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80 h-16 flex-shrink-0 overflow-hidden">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group overflow-hidden"
            onClick={() => handleNavClick('home')}
          >
            {isCollapsed && !isMobileOpen ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
            ) : (
              <Logo size="sm" variant="dark" />
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors flex-shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {navCategories.map((category, idx) => (
            <div key={idx} className="space-y-1">
              
              {/* Category Section Header */}
              {(!isCollapsed || isMobileOpen) && (
                <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {category.title}
                </div>
              )}

              {/* Navigation Items */}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id || (item.id === 'jobs' && activeTab === 'jobs_db');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/25 border border-cyan-400/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/90 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                        }`} />

                        {(!isCollapsed || isMobileOpen) && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {/* Badge Tag */}
                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 ${
                          isActive
                            ? 'bg-white/20 text-white border border-white/30'
                            : item.badge === 'LIVE' 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : item.badge === 'DB'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.badge === 'EXAM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed Indicator dot when active */}
                      {isCollapsed && !isMobileOpen && isActive && (
                        <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer User Profile Widget */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex-shrink-0">
          <SignedIn>
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-3 cursor-pointer overflow-hidden flex-1"
                onClick={() => handleNavClick('dashboard')}
              >
                <UserButton showName={!isCollapsed || isMobileOpen} />
                {(!isCollapsed || isMobileOpen) && clerkUser && (
                  <div className="truncate pl-2">
                    <p className="text-xs font-bold text-white truncate">{clerkUser.fullName || clerkUser.firstName || 'Candidate'}</p>
                    <p className="text-[10px] text-cyan-400 font-semibold truncate">Active Pro User</p>
                  </div>
                )}
              </div>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button
                className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all ${
                  isCollapsed && !isMobileOpen ? 'px-0' : 'px-3'
                }`}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span>Sign In</span>}
              </button>
            </SignInButton>
          </SignedOut>
        </div>

      </aside>
    </>
  );
}
