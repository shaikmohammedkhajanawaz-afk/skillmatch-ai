import React from 'react';
import { 
  Sparkles, 
  FileSearch, 
  FileText, 
  Briefcase, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Target,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Hero({ setActiveTab }) {
  const { user, userSkills } = useAuth();

  const sampleSkillTags = [
    "React", "Python", "TypeScript", "Node.js", "Machine Learning", 
    "SQL", "Docker", "AWS", "PyTorch", "Figma", "Tailwind CSS", "DevOps"
  ];

  return (
    <div className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-20">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">

          {/* Top Pill Tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="font-mono text-[11px] tracking-wider uppercase">AI CAREER RADAR & MATCHING PLATFORM</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-['Plus_Jakarta_Sans']">
            Match Your Skills to <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400">
              Dream Tech Jobs with AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Upload your resume or build one with our interactive builder. Our neural matching engine calculates 0-100 ATS scores, ranks 50+ live opportunities by match percentage, and isolates your missing skills.
          </p>

          {/* CTA Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:-translate-y-0.5 border border-cyan-400/30"
            >
              <FileSearch className="w-4 h-4 text-cyan-300" />
              <span>Analyze Resume (Free ATS Score)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 shadow-md transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Build Custom Resume</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 shadow-md transition-all duration-200"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Explore 50+ Live Jobs</span>
            </button>
          </div>

          {/* Quick Skill Tags Preview */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center">
              <Zap className="w-3.5 h-3.5 text-amber-400 mr-1" /> Recognized Skills:
            </span>
            {sampleSkillTags.map((tag) => (
              <span 
                key={tag}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:text-indigo-300 transition-colors cursor-pointer"
                onClick={() => setActiveTab('jobs')}
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer border border-slate-800/80 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <FileSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">AI Resume Analyzer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload PDF or text to compute 0-100 ATS scores, detect formatting, action verbs, and extracted skills.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Try Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('builder')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer border border-slate-800/80 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">Custom Resume Builder</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build clean resumes using 4 customizable templates (Modern Tech, Executive, Creative, Classic) with instant PDF export.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Build Resume</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('jobs')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer border border-slate-800/80 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">Smart Job Matcher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ranks jobs by TF-IDF & Jaccard skill similarity score, highlighting your matched vs missing skills per position.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>View Job Matches</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('gap')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer border border-slate-800/80 relative overflow-hidden group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 font-['Plus_Jakarta_Sans']">Skill-Gap & Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify key missing competencies for your dream role with curated course recommendations and estimated learning hours.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
              <span>Explore Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
