import React from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function JobCard({ job, onSelectJob, onOpenSkillGap }) {
  const { savedJobIds, toggleSaveJob, applications, addApplication, user } = useAuth();

  const isSaved = savedJobIds.includes(job.id);
  const hasApplied = applications.some(a => a.job_id === job.id);

  const matchScore = job.match_score || 75;
  const matchedSkills = job.matched_skills || [];
  const missingSkills = job.missing_required_skills || [];

  return (
    <div className="glass-panel glass-panel-hover p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 relative group bg-slate-900/80">
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Company Logo & Details */}
        <div className="flex items-start space-x-3.5">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${job.logo_bg || 'from-blue-600 to-cyan-600'} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
            {job.company ? job.company.charAt(0) : 'C'}
          </div>
          <div>
            <h3 
              onClick={() => onSelectJob(job)}
              className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer font-['Plus_Jakarta_Sans'] line-clamp-1"
            >
              {job.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
              <span className="font-semibold text-slate-300">{job.company}</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-0.5 text-slate-500" />
                {job.location}
              </span>
            </div>
          </div>
        </div>

        {/* Save Bookmark & Match Score Badge */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isSaved ? "Saved in bookmarks" : "Save job"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>

          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border font-bold text-xs shadow-sm ${
            matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
            matchScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
            'bg-slate-950 text-slate-300 border-slate-800'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

      </div>

      {/* Badges Row (Type, Experience, Salary & Live/DB Source Tag) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {job.is_live_api || job.is_live || job.source === 'SerpApi' ? (
          <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center space-x-1">
            <span>🌐 LIVE</span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center space-x-1">
            <span>💾 DATABASE</span>
          </span>
        )}
        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
          {job.job_type}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
          {job.experience_level}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
          {job.salary_range}
        </span>
      </div>

      {/* Matched vs Missing Skill Breakdown */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        
        {/* Matched Skills */}
        {matchedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Matched:</span>
            {matchedSkills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                ✓ {skill}
              </span>
            ))}
            {matchedSkills.length > 4 && (
              <span className="text-slate-500 text-[10px]">+{matchedSkills.length - 4} more</span>
            )}
          </div>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium mr-1">Missing:</span>
            {missingSkills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                ! {skill}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => onOpenSkillGap(job)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Skill-Gap</span>
        </button>

        <div className="flex items-center space-x-2">
          {job.redirect_url && job.redirect_url !== '#' && (
            <a
              href={job.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white shadow-md transition-colors flex items-center space-x-1 border border-cyan-400/30"
            >
              <span>Apply</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </a>
          )}
          <button
            onClick={() => onSelectJob(job)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 shadow-sm transition-colors"
          >
            Details
          </button>
        </div>
      </div>

    </div>
  );
}
