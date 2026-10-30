import React, { useState } from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import PracticeExamModule from './components/PracticeExamModule';
import ResumeBuilder from './components/ResumeBuilder';
import PortfolioGenerator from './components/PortfolioGenerator';
import JobSearch from './components/JobSearch';
import LiveJobs from './components/LiveJobs';
import SkillGapAnalyzer from './components/SkillGapAnalyzer';
import Dashboard from './components/Dashboard';
import AICareerChatbot from './components/AICareerChatbot';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import UserProfile from './components/UserProfile';
import { AuthProvider } from './context/AuthContext';
import { Bot } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTargetJob, setSelectedTargetJob] = useState(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenSkillGapForJob = (job) => {
    setSelectedTargetJob(job);
    setActiveTab('gap');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative flex overflow-x-hidden">
      {/* Ambient Radial Futuristic Light Rays & Glow Blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Left Collapsible Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Workspace Area with Dynamic Left Padding */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Header Bar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          setIsMobileOpen={setIsMobileSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Router Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <Hero setActiveTab={setActiveTab} />}
          {activeTab === 'analyzer' && <ResumeAnalyzer setActiveTab={setActiveTab} />}
          {activeTab === 'exam' && <PracticeExamModule />}
          {activeTab === 'builder' && <ResumeBuilder />}
          {activeTab === 'portfolio' && <PortfolioGenerator />}
          {(activeTab === 'jobs' || activeTab === 'jobs_db') && (
            <JobSearch onOpenSkillGap={handleOpenSkillGapForJob} />
          )}
          {activeTab === 'jobs_live' && (
            <LiveJobs onOpenSkillGap={handleOpenSkillGapForJob} />
          )}
          {activeTab === 'gap' && <SkillGapAnalyzer selectedTargetJob={selectedTargetJob} />}
          {activeTab === 'chat' && <AICareerChatbot />}
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'profile' && <UserProfile />}
        </main>

        {/* Global Floating AI Coach Widget Button */}
        {activeTab !== 'chat' && (
          <>
            <button
              onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
              className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white font-bold text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-all group"
              title="Ask AI Career Coach"
            >
              <div className="w-6 h-6 rounded-full bg-slate-950/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
              </div>
              <span>Ask AI Coach</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Floating Chat Modal */}
            {isFloatingChatOpen && (
              <div className="fixed bottom-20 right-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                <AICareerChatbot isFloating={true} onCloseFloating={() => setIsFloatingChatOpen(false)} />
              </div>
            )}
          </>
        )}

        {/* Auth Modal */}
        <AuthModal />

        {/* Footer */}
        <Footer setActiveTab={setActiveTab} />
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SignedIn>
        <AppContent />
      </SignedIn>
      <SignedOut>
        <LandingPage />
        <AuthModal />
      </SignedOut>
    </AuthProvider>
  );
}
