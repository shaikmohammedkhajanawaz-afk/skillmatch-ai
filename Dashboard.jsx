import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bookmark, 
  Send, 
  Sparkles, 
  Trash2, 
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ setActiveTab }) {
  const { user, userSkills, updateUserSkills, savedJobIds, toggleSaveJob, applications } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    fetchSavedJobsList();
  }, [savedJobIds]);

  const fetchSavedJobsList = async () => {
    setLoading(true);
    try {
      const res = await api.getSavedJobs(user?.id || 'demo_user');
      setSavedJobs(res.saved_jobs || []);
    } catch (err) {
      console.error('Failed to fetch saved jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    if (!userSkills.includes(skill)) {
      updateUserSkills([...userSkills, skill]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateUserSkills(userSkills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 shadow-sm">
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Personal Candidate Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Welcome Back, {user?.name || 'Candidate'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your saved jobs, manage your extracted skill inventory, and view active job applications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            View & Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('analyzer')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-all"
          >
            Re-Analyze Resume
          </button>
        </div>
      </div>

      {/* Top Profile Summary Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* User Details */}
        <div className="md:col-span-8 flex items-center space-x-4">
          <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30 shadow-md flex-shrink-0">
            {user?.avatar || user?.photo_url ? (
              <img
                src={user?.avatar || user?.photo_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold text-lg bg-slate-900">
                {user?.name?.charAt(0) || 'C'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">{user?.name}</h2>
            <p className="text-xs font-semibold text-cyan-400">{user?.role}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Profile Metrics */}
        <div className="md:col-span-4 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Total Skills</span>
            <p className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">{userSkills.length}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Applications</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-['Plus_Jakarta_Sans']">{applications.length}</p>
          </div>
        </div>

      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Skills Inventory & Application Tracker) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Skill Inventory Manager */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Extracted Skill Inventory ({userSkills.length})</span>
              </h3>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add skill..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {userSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300"
                >
                  <span>{skill}</span>
                  <X
                    className="w-3 h-3 text-cyan-400 hover:text-rose-400 cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Application Tracker */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Job Application Tracker ({applications.length})</span>
            </h3>

            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.job_title}</h4>
                      <p className="text-[11px] text-slate-400">{app.company}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {app.status || 'Applied'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
                You haven't submitted any job applications yet. Use the Job Search tab to apply!
              </div>
            )}
          </div>

        </div>

        {/* Right Column (Saved Jobs Bookmarks) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved Job Bookmarks ({savedJobs.length})</span>
            </h3>
          </div>

          {savedJobs.length > 0 ? (
            <div className="space-y-3">
              {savedJobs.map((job) => (
                <div key={job.id} className="glass-panel p-4 rounded-xl border border-slate-800 shadow-xl space-y-2 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{job.title}</h4>
                      <p className="text-[11px] text-slate-400">{job.company} • {job.location}</p>
                    </div>
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px]">
                    <span className="text-emerald-400 font-semibold">{job.salary_range}</span>
                    <button
                      onClick={() => setActiveTab('jobs')}
                      className="text-cyan-400 hover:underline font-semibold"
                    >
                      View Match →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800 shadow-xl text-xs text-slate-400 space-y-2">
              <Bookmark className="w-6 h-6 text-slate-500 mx-auto" />
              <p>No saved jobs yet. Click the bookmark icon on any job card to save it here.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
