import React from 'react';
import { Sparkles, Heart, Github, Code2, ShieldCheck, Zap } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight font-['Plus_Jakarta_Sans']">
                SkillMatch <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-powered job finder, automated resume ATS parser, skill extractor, and career roadmap builder designed for students & job seekers.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clerk Auth Protected & Private</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Platform Features</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('analyzer')} className="hover:text-indigo-400 transition-colors">
                  AI Resume Analyzer & ATS Score
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('builder')} className="hover:text-indigo-400 transition-colors">
                  Interactive Resume Builder
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('jobs')} className="hover:text-indigo-400 transition-colors">
                  Smart Job Matcher Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gap')} className="hover:text-indigo-400 transition-colors">
                  Skill-Gap & Course Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Tech Architecture</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-indigo-300">React 18</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-cyan-300">Python 3.14</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-emerald-300">Flask REST API</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-violet-300">NLP Skill Matcher</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-amber-300">TF-IDF & Jaccard</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-rose-300">Clerk Auth</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-sky-300">Tailwind CSS</span>
              <span className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-md text-purple-300">SQLite3</span>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Target Roles</h4>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p>• Software Engineers & Developers</p>
              <p>• AI / Data Science Professionals</p>
              <p>• Product Managers & Designers</p>
              <p>• Recent Graduates & Students</p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Skill Match AI. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <span className="flex items-center space-x-1">
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for career growth</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
