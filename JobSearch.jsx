import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Target, 
  ArrowRight,
  Zap
} from 'lucide-react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobSearch({ onOpenSkillGap }) {
  const { userSkills } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncingDaily, setIsSyncingDaily] = useState(false);
  const [lastSyncNotice, setLastSyncNotice] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  // Category Quick Filter Chip
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortBy, setSortBy] = useState('match');

  useEffect(() => {
    fetchMatchedJobs();
  }, [userSkills]);

  const fetchMatchedJobs = async () => {
    setLoading(true);
    try {
      const matchedRes = await api.matchJobs(userSkills);
      setJobs(matchedRes.matched_jobs || []);
    } catch (err) {
      console.error('Failed to fetch matched jobs', err);
      const basicRes = await api.getJobs();
      setJobs(basicRes.jobs || []);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDailyRefresh = async () => {
    setIsSyncingDaily(true);
    setLastSyncNotice('');
    try {
      const res = await api.refreshDailyJobs();
      setLastSyncNotice(`Added live verified job: ${res.new_job_added?.title} @ ${res.new_job_added?.company}`);
      await fetchMatchedJobs();
    } catch (err) {
      console.error('Failed to sync daily jobs', err);
    } finally {
      setIsSyncingDaily(false);
    }
  };

  const categoryChips = [
    "All",
    "Frontend & Mobile",
    "Backend & Fullstack",
    "AI, ML & Data",
    "DevOps & Cloud",
    "Cybersecurity & QA",
    "Product & Risk"
  ];

  // Stage 1: Search Filters (Keyword, Location, Category, Employment Type)
  const stage1Jobs = jobs.filter((job) => {
    const fullBlob = `${job.title} ${job.company} ${job.description} ${job.department} ${(job.required_skills || []).join(' ')}`.toLowerCase();

    // Category Filter
    if (activeCategoryFilter !== 'All') {
      if (activeCategoryFilter === 'Frontend & Mobile' && !fullBlob.includes('react') && !fullBlob.includes('frontend') && !fullBlob.includes('mobile') && !fullBlob.includes('ios') && !fullBlob.includes('android') && !fullBlob.includes('vue') && !fullBlob.includes('angular') && !fullBlob.includes('flutter') && !fullBlob.includes('ui')) return false;
      if (activeCategoryFilter === 'Backend & Fullstack' && !fullBlob.includes('python') && !fullBlob.includes('backend') && !fullBlob.includes('node') && !fullBlob.includes('java') && !fullBlob.includes('golang') && !fullBlob.includes('php') && !fullBlob.includes('express') && !fullBlob.includes('spring')) return false;
      if (activeCategoryFilter === 'AI, ML & Data' && !fullBlob.includes('ai') && !fullBlob.includes('machine learning') && !fullBlob.includes('data') && !fullBlob.includes('llm') && !fullBlob.includes('pytorch') && !fullBlob.includes('tensorflow') && !fullBlob.includes('analytics')) return false;
      if (activeCategoryFilter === 'DevOps & Cloud' && !fullBlob.includes('devops') && !fullBlob.includes('aws') && !fullBlob.includes('cloud') && !fullBlob.includes('kubernetes') && !fullBlob.includes('sre') && !fullBlob.includes('docker') && !fullBlob.includes('terraform') && !fullBlob.includes('linux')) return false;
      if (activeCategoryFilter === 'Cybersecurity & QA' && !fullBlob.includes('security') && !fullBlob.includes('qa') && !fullBlob.includes('testing') && !fullBlob.includes('cypress') && !fullBlob.includes('selenium') && !fullBlob.includes('cybersecurity')) return false;
      if (activeCategoryFilter === 'Product & Risk' && !fullBlob.includes('product') && !fullBlob.includes('fraud') && !fullBlob.includes('risk') && !fullBlob.includes('aml') && !fullBlob.includes('scrum') && !fullBlob.includes('agile')) return false;
    }

    if (searchQuery) {
      const queryWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(w => w.length > 1);
      if (!queryWords.every(w => fullBlob.includes(w))) {
        return false;
      }
    }

    if (selectedType) {
      const selLower = selectedType.toLowerCase();
      const jtypeLower = (job.job_type || '').toLowerCase();
      const jtitleLower = (job.title || '').toLowerCase();
      const jdescLower = (job.description || '').toLowerCase();
      if (selLower === 'internship') {
        if (!jtypeLower.includes('intern') && !jtitleLower.includes('intern') && !jdescLower.includes('intern')) return false;
      } else if (!jtypeLower.includes(selLower) && !jtitleLower.includes(selLower)) {
        return false;
      }
    }

    if (locationQuery) {
      const locClean = locationQuery.toLowerCase().trim();
      const jobLoc = job.location.toLowerCase();
      let matchLoc = jobLoc.includes(locClean);
      if (!matchLoc) {
        if ((locClean === 'bengaluru' || locClean === 'bangalore') && (jobLoc.includes('bengaluru') || jobLoc.includes('bangalore'))) {
          matchLoc = true;
        } else if ((locClean === 'gurugram' || locClean === 'gurgaon') && (jobLoc.includes('gurugram') || jobLoc.includes('gurgaon'))) {
          matchLoc = true;
        } else if ((locClean === 'mumbai' || locClean === 'bombay') && (jobLoc.includes('mumbai') || jobLoc.includes('bombay'))) {
          matchLoc = true;
        }
      }
      if (!matchLoc) return false;
    }
    return true;
  });

  // Stage 2: AI Candidate Skill Matching & Partitioning
  const directMatchJobs = stage1Jobs.filter(j => (j.match_score || 0) >= 40 || (j.matched_skills && j.matched_skills.length > 0) || userSkills.length === 0);
  const skillGapJobs = stage1Jobs.filter(j => !directMatchJobs.includes(j));

  if (sortBy === 'match') {
    directMatchJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    skillGapJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  }

  // Top recommendations (top 3 highest match scores)
  const topRecommendations = jobs
    .filter(j => (j.match_score || 0) >= 60)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>💾 PRESERVED SQLITE DATABASE ({jobs.length} Active Positions)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Matching <span className="text-emerald-400 font-semibold">{userSkills.length} candidate skill(s)</span> ({userSkills.slice(0, 4).join(', ')}) against preserved SQLite database opportunities.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerDailyRefresh}
            disabled={isSyncingDaily}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 text-amber-300 ${isSyncingDaily ? 'animate-spin' : ''}`} />
            <span>{isSyncingDaily ? 'Syncing...' : 'Sync Daily Feed'}</span>
          </button>

          <button
            onClick={fetchMatchedJobs}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Database Search Controls */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3.5 shadow-xl">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search Database Positions by Title, Skill, Company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-4 relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Location (Bengaluru, Hyderabad, Pune...)"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryChips.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryFilter === cat
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Daily Sync Alert Notice */}
      {lastSyncNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{lastSyncNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-700 uppercase font-bold">Database Synced</span>
        </div>
      )}

      {/* TOP AI PICKS HIGHLIGHT BANNER */}
      {topRecommendations.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top 3 AI Recommended Database Positions</h3>
                <p className="text-[11px] text-slate-500">Highest skill overlap with your candidate profile</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              High Match Score (60%+)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topRecommendations.map((job) => (
              <div 
                key={job.id} 
                onClick={() => setSelectedJob(job)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 shadow-sm transition-all duration-200 cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{job.title}</h4>
                    <p className="text-[11px] text-slate-500">{job.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {job.match_score}% Match
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>📍 {job.location}</span>
                  <span className="text-emerald-700 font-bold">{job.salary_range}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-blue-600 font-semibold">{job.posted_date}</span>
                  <span className="text-slate-700 hover:text-blue-600 font-bold flex items-center">
                    View & Apply <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRESERVED DATABASE JOBS VIEW */}
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Found <strong className="text-slate-900">{stage1Jobs.length}</strong> preserved database positions ({activeCategoryFilter})</span>
          <span>AI Match Partition: <strong className="text-emerald-700">{directMatchJobs.length} Matched</strong> • <strong className="text-amber-700">{skillGapJobs.length} Skill Gap Opportunities</strong></span>
        </div>

        {/* Job Cards Grid Sections */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading preserved database jobs...</p>
          </div>
        ) : stage1Jobs.length > 0 ? (
          <div className="space-y-8">
            
            {/* SECTION 1: DIRECT MATCHED JOBS */}
            {directMatchJobs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Matched Database Opportunities ({directMatchJobs.length})</span>
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Matched with candidate skills ({userSkills.slice(0, 3).join(', ')})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {directMatchJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelectJob={(j) => setSelectedJob(j)}
                      onOpenSkillGap={(j) => onOpenSkillGap(j)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: RELATED OPPORTUNITIES & SKILL GAP POSITIONS */}
            {skillGapJobs.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Related Positions & Skill Gap Opportunities ({skillGapJobs.length})</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      These database positions match your search criteria. Build missing skills using our AI Skill Gap Analyzer.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-95">
                  {skillGapJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSelectJob={(j) => setSelectedJob(j)}
                      onOpenSkillGap={(j) => onOpenSkillGap(j)}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl text-center border border-slate-200/80 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Database Jobs Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords, location filters, or category selection.
            </p>
          </div>
        )}

      </div>

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
