import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Bookmark, 
  Send,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetailModal({ job, onClose, onOpenSkillGap }) {
  const { user, savedJobIds, toggleSaveJob, applications, addApplication } = useAuth();

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  if (!job) return null;

  const isSaved = savedJobIds.includes(job.id);
  const hasApplied = applications.some(a => a.job_id === job.id) || applySuccess;

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      await api.submitApplication({
        user_id: user?.id || 'demo_user',
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        notes: notes.trim()
      });

      addApplication({
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        status: 'Applied',
        applied_at: new Date().toISOString()
      });

      setApplySuccess(true);
    } catch (err) {
      console.error('Failed to submit application', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto bg-slate-900/95 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Job Header */}
        <div className="flex items-start space-x-4 pr-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${job.logo_bg || 'from-blue-600 to-cyan-600'} flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0`}>
            {job.company ? job.company.charAt(0) : 'C'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
              {job.title}
            </h2>
            <p className="text-sm font-semibold text-cyan-400 mt-0.5">{job.company}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {job.job_type} ({job.experience_level})
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-400">{job.salary_range}</span>
            </div>
          </div>
        </div>

        {/* Compatibility Banner */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {job.match_score || 85}%
            </div>
            <div>
              <p className="text-xs font-bold text-white">Match Compatibility Score</p>
              <p className="text-[11px] text-slate-300">Calculated based on your candidate skill profile.</p>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSkillGap(job);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-md border border-cyan-400/30"
          >
            View Skill Gap & Learning Path
          </button>
        </div>

        {/* Job Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">About the Role</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{job.description}</p>
        </div>

        {/* Key Responsibilities */}
        {job.responsibilities?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Key Responsibilities</h3>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Required Skills */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.required_skills?.map((skill, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Perks & Benefits */}
        {job.perks?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Perks & Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {job.perks.map((perk, idx) => (
                <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  ✨ {perk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Form Section */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Apply for Position</h3>
          
          {hasApplied ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Application Submitted! Status: Applied</span>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional: Add candidate note or cover message for the recruiter..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleSaveJob(job.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                    isSaved ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{isSaved ? "Saved in Bookmarks" : "Save Job"}</span>
                </button>

                <button
                  onClick={handleApply}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting..." : "Submit 1-Click Application"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
