import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  LogOut, 
  Menu, 
  Search, 
  Bell, 
  ChevronDown,
  LayoutDashboard,
  Bot,
  Zap
} from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  setIsMobileOpen,
  isSidebarCollapsed 
}) {
  const { user, logout, setIsAuthModalOpen } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('jobs');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-xl shadow-lg transition-all duration-300">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Context Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Context Breadcrumb / Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block max-w-xs md:max-w-md w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search jobs, skills, roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </form>
        </div>

        {/* Right Side: Pro Tag, Notifications, User Dropdown */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Ask AI Coach Pill */}
          <button
            onClick={() => setActiveTab('chat')}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-colors"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>Ask AI Coach</span>
          </button>

          {/* Clerk User Button & Signed Out Controls */}
          <SignedIn>
            <UserButton showName={true} afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </div>
          </SignedOut>

        </div>

      </div>
    </header>
  );
}
