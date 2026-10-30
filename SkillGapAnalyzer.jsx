import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SkillGapAnalyzer({ selectedTargetJob }) {
  const { userSkills } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(selectedTargetJob?.id || 'job-1');
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobsList();
  }, []);

  useEffect(() => {
    if (selectedTargetJob) {
      setSelectedJobId(selectedTargetJob.id);
    }
  }, [selectedTargetJob]);

  useEffect(() => {
    if (selectedJobId) {
      fetchSkillGap();
    }
  }, [selectedJobId, userSkills]);

  const fetchJobsList = async () => {
    try {
      const res = await api.getJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs list', err);
    }
  };

  const fetchSkillGap = async () => {
    setLoading(true);
    try {
      const res = await api.getSkillGap(selectedJobId, userSkills);
      setGapData(res);
    } catch (err) {
      console.error('Failed to get skill gap', err);
    } finally {
      setLoading(false);
    }
  };

  const currentJob = jobs.find(j => j.id === selectedJobId) || selectedTargetJob;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Skill-Gap & Curated Course Recommendations</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Skill-Gap Analysis & Curated Courses
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Compare your current candidate skills against specific target job requirements to identify missing competencies and access top recommended courses.
        </p>
      </div>

      {/* Target Job Selector Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
              Select Target Job Position for Skill Gap Audit:
            </label>
            <p className="text-xs text-slate-400">Choose any position from our verified live job database.</p>
          </div>

          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500 max-w-md w-full"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gap Analysis Main View */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <TrendingUp className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Analyzing target job requirements against candidate profile...</p>
        </div>
      ) : gapData ? (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Target Job Summary & Readiness Score */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-900/80">
            
            {/* Left Column (Job info) */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{gapData.company}</span>
                <span>•</span>
                <span className="text-cyan-400 font-medium">{gapData.job_title}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                Target Role Skill Gap Breakdown
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {gapData.advice}
              </p>
            </div>

            {/* Right Column (Readiness Badge) */}
            <div className="md:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 text-center space-y-2 bg-slate-950/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidate Readiness</span>
              <p className="text-3xl font-extrabold text-cyan-400 font-['Plus_Jakarta_Sans']">
                {gapData.match_score}%
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                gapData.match_score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                gapData.match_score >= 55 ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
              }`}>
                {gapData.readiness_level}
              </span>
            </div>

          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Matched Skills Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Skills You Possess ({gapData.matched_skills?.length || 0})</span>
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Matched</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {gapData.matched_skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Missing Skill Gaps ({gapData.missing_skills?.length || 0})</span>
                </h3>
                <span className="text-[11px] text-amber-400 font-semibold">Action Required</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {gapData.missing_skills?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    ! {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Curated Learning Roadmap & Course Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2 font-['Plus_Jakarta_Sans']">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Curated Courses For Missing Skill Gaps</span>
              </h3>
              <span className="text-xs text-slate-400">Direct course links & completion estimates</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gapData.learning_roadmap?.map((item, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-cyan-500/40 flex flex-col justify-between space-y-4 bg-slate-900/80">
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                        {item.skill}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                          item.free ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                        }`}>
                          {item.free ? "100% Free" : "Paid"}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          item.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white pt-1 line-clamp-2">
                      {item.course}
                    </h4>
                    <p className="text-xs text-slate-400">🏛️ {item.provider}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <span className="text-xs text-slate-400 flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {item.estimated_time} ({item.level})
                    </span>

                    <a
                      href={item.resource_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center space-x-1 transition-colors border border-cyan-400/30"
                    >
                      <span>Open Course</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
