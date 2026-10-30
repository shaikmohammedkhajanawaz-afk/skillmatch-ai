import React from 'react';
import { X, Sparkles, UserCheck, ShieldCheck, KeyRound } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-indigo-500/30 shadow-2xl p-6 sm:p-8 space-y-6 bg-slate-950">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <Logo size="md" className="justify-center" />
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans'] pt-2">
            Authentication Required
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Please sign in or create an account with Clerk Authentication to access candidate dashboard features.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <SignInButton mode="modal">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In with Clerk</span>
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-colors"
            >
              Create New Account (Sign Up)
            </button>
          </SignUpButton>
        </div>

        {/* Security Footer */}
        <div className="pt-3 border-t border-slate-800/80 text-center">
          <div className="inline-flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Secured by Clerk Production Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
}
