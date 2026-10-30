import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Radio, 
  RefreshCw, 
  X, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LiveJobs({ onOpenSkillGap }) {
  const { userSkills } = useAuth();

  const [liveJobs, setLiveJobs] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState('');
  const [liveSourceNotice, setLiveSourceNotice] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('Python Developer');
  const [locationQuery, setLocationQuery] = useState('Bengaluru');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    // Initial fetch of real-time live jobs
    handleFetchLiveApiJobs();
  }, []);

  const handleFetchLiveApiJobs = async (e) => {
    if (e) e.preventDefault();
    if (liveLoading) return;
    setLiveLoading(true);
    setLiveError('');
    setLiveSourceNotice('');
    try {
      const res = await api.searchLiveSerpApiJobs(
        searchQuery || 'Python Developer',
        locationQuery || 'Bengaluru',
        selectedType,
        userSkills
      );

      if (res) {
        const markedLive = (res.jobs || []).map(j => ({ ...j, is_live_api: true, is_live: true }));
        setLiveJobs(markedLive);
        if (res.error) {
          setLiveError(res.error);
        } else {
          setLiveSourceNotice(`Found ${res.total_count || markedLive.length} live position(s) via ${res.source || 'SerpApi Google Jobs'}`);
        }
      }
    } catch (err) {
      console.error('SerpApi search request error:', err);
      setLiveError('Live Search API exception: Check server network or SERPAPI_KEY configuration.');
    } finally {
      setLiveLoading(false);
    }
  };

  const quickSearches = [
    { q: 'Python Developer', l: 'Bengaluru' },
    { q: 'Java Full Stack', l: 'Hyderabad' },
    { q: 'React Developer', l: 'Bengaluru' },
    { q: 'Data Analyst', l: 'India' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>🌐 REAL-TIME GOOGLE JOBS VIA SERPAPI ({liveJobs.length} Positions)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Live Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Search and explore real-time job opportunities fetched directly from Google Jobs via SerpApi engine.
          </p>
        </div>

        {/* Retry Live Search Control */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleFetchLiveApiJobs}
            disabled={liveLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 border border-cyan-400/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${liveLoading ? 'animate-spin' : ''}`} />
            <span>{liveLoading ? 'Fetching Live Jobs...' : 'Retry Live Search'}</span>
          </button>
        </div>
      </div>

      {/* Live Search Controls Form */}
      <form onSubmit={handleFetchLiveApiJobs} className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-slate-900/80 grid grid-cols-1 md:grid-cols-12 gap-3.5 shadow-xl">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
          <input
            type="text"
            placeholder="Search Live Role (e.g. Python Developer, React)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-4 relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
          <input
            type="text"
            placeholder="Location (Bengaluru, Hyderabad, India...)"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3 flex items-center space-x-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <button
            type="submit"
            disabled={liveLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 whitespace-nowrap border border-cyan-400/30"
          >
            <Search className={`w-4 h-4 ${liveLoading ? 'animate-spin' : ''}`} />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Quick Search Shortcut Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Quick Searches:</span>
        {quickSearches.map((shortcut, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSearchQuery(shortcut.q);
              setLocationQuery(shortcut.l);
              api.searchLiveSerpApiJobs(shortcut.q, shortcut.l, selectedType, userSkills).then(res => {
                if (res && res.jobs) {
                  const markedLive = (res.jobs || []).map(j => ({ ...j, is_live_api: true, is_live: true }));
                  setLiveJobs(markedLive);
                }
              });
            }}
            className="px-3 py-1 rounded-xl bg-white border border-slate-200 hover:border-purple-300 text-purple-700 font-semibold text-[11px] shadow-sm transition-all"
          >
            {shortcut.q} in {shortcut.l}
          </button>
        ))}
      </div>

      {/* Source Banner / Notice */}
      {liveSourceNotice && (
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>{liveSourceNotice}</span>
          </div>
          <span className="text-[10px] bg-purple-100 border border-purple-200 text-purple-800 px-2 py-0.5 rounded font-extrabold">
            LIVE SERPAPI DATA
          </span>
        </div>
      )}

      {/* Error Notice */}
      {liveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center space-x-2 font-bold">
            <X className="w-4 h-4 text-rose-600" />
            <span>Live Search Notice: {liveError}</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Live Jobs temporarily unavailable. Please verify network connectivity or try clicking Retry Live Search.
          </p>
          <button
            onClick={handleFetchLiveApiJobs}
            disabled={liveLoading}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all disabled:opacity-50 shadow-sm"
          >
            Retry Live Search
          </button>
        </div>
      )}

      {/* Live Jobs Cards Grid */}
      {liveLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Connecting to SerpApi Google Jobs engine (engine=google_jobs)...</p>
        </div>
      ) : liveJobs.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
              <span>Real-Time Google Jobs ({liveJobs.length})</span>
            </h3>
            <span className="text-[11px] text-purple-700 font-semibold">
              Fetched directly via SerpApi backend service
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelectJob={(j) => setSelectedJob(j)}
                onOpenSkillGap={(j) => onOpenSkillGap(j)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center border border-slate-200/80 space-y-3">
          <Radio className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Live Jobs Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Type a role such as "Python Developer" or "React Developer" and click Search to query live Google Jobs.
          </p>
          <button
            onClick={handleFetchLiveApiJobs}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
          >
            Search Live Google Jobs
          </button>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onOpenSkillGap={(j) => {
            setSelectedJob(null);
            onOpenSkillGap(j);
          }}
        />
      )}

    </div>
  );
}
