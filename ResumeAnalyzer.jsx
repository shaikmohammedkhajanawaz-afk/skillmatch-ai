import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Plus, 
  X, 
  ArrowRight,
  Gauge,
  Award,
  RefreshCw,
  TrendingUp,
  Target,
  Briefcase,
  MapPin,
  GraduationCap,
  Clock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ResumeAnalyzer({ setActiveTab }) {
  const { updateUserSkills } = useAuth();
  const fileInputRef = useRef(null);

  const [activeInputMode, setActiveInputMode] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const sampleResumeSnippet = `ALEX RIVERA (CURRICULUM VITAE)
San Francisco, CA | alex.rivera@example.com | github.com/arivera | linkedin.com/in/alex-rivera

PROFESSIONAL SUMMARY
Dynamic Senior Frontend Engineer with 4+ years of experience building high-performance React and Next.js web applications. Demonstrated expertise in TypeScript, Tailwind CSS, REST APIs, GraphQL, and micro-frontend architectures.

WORK EXPERIENCE
Senior Frontend Developer | TechSphere Systems | 2023 - Present
• Spearheaded the architectural migration of legacy dashboard to React 18 and Next.js, improving LCP scores by 40%.
• Engineered reusable UI component library in TypeScript using Tailwind CSS and Storybook, adopted across 6 product squads.
• Integrated GraphQL endpoints with Apollo Client and state management using Redux Toolkit.

ACADEMIC PUBLICATIONS & RESEARCH
• Rivera, A. & Zhang, L. (2025). "Optimizing Client-side Virtual DOM Reconciliation in High-frequency Financial Dashboards." Journal of Web Engineering, 14(2), 45-58.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2017 - 2021 (GPA: 3.8/4.0)

TECHNICAL SKILLS & COMPETENCIES
Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL
Frameworks & Libraries: React, Next.js, Redux, Node.js, Express, Tailwind CSS, Bootstrap
Tools & Platforms: Git, Docker, Webpack, Vite, Jest, Figma, REST API, GraphQL, AWS`;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    setErrorMessage('');
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const fetchJobRecommendations = async (skills) => {
    try {
      const matchRes = await api.matchJobs(skills);
      const matched = matchRes.matched_jobs?.slice(0, 3) || [];
      setRecommendedJobs(matched);
    } catch (err) {
      console.error('Failed to fetch job recommendations', err);
    }
  };

  const handleAnalyze = async () => {
    setErrorMessage('');
    setIsAnalyzing(true);
    setRecommendedJobs([]);

    try {
      let res;
      if (activeInputMode === 'upload') {
        if (!selectedFile) {
          setErrorMessage('Please select a resume file (PDF, DOCX, or TXT) to analyze.');
          setIsAnalyzing(false);
          return;
        }
        res = await api.parseResumeFile(selectedFile);
      } else {
        if (!pastedText.trim()) {
          setErrorMessage('Please enter or paste your Resume/CV text snippet.');
          setIsAnalyzing(false);
          return;
        }
        res = await api.analyzeResumeText(pastedText);
      }

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setAnalysisResult(res);
        const extracted = res.extracted_skills || [];
        updateUserSkills(extracted);
        fetchJobRecommendations(extracted);
      }
    } catch (err) {
      setErrorMessage('Network or server error analyzing resume. Please ensure Flask backend is active.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !analysisResult) return;
    const skill = newSkillInput.trim();
    if (!analysisResult.extracted_skills.includes(skill)) {
      const updatedSkills = [...analysisResult.extracted_skills, skill];
      const updatedResult = { ...analysisResult, extracted_skills: updatedSkills };
      setAnalysisResult(updatedResult);
      updateUserSkills(updatedSkills);
      fetchJobRecommendations(updatedSkills);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!analysisResult) return;
    const updatedSkills = analysisResult.extracted_skills.filter(s => s !== skillToRemove);
    setAnalysisResult({ ...analysisResult, extracted_skills: updatedSkills });
    updateUserSkills(updatedSkills);
    fetchJobRecommendations(updatedSkills);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Resume & CV Parser with Automatic Skill-Gap Audit</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          AI Resume & CV Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload your Resume or CV to calculate ATS score, extract candidate skills, audit skill gaps, and get curated course recommendations.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 bg-slate-900/80">
        
        {/* Toggle Mode */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveInputMode('upload')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Document (PDF / DOCX / TXT)
            </button>
            <button
              onClick={() => setActiveInputMode('text')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeInputMode === 'text'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Resume / CV Text
            </button>
          </div>
        </div>

        {activeInputMode === 'upload' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-slate-950/80 hover:bg-slate-950 transition-all duration-200 cursor-pointer space-y-4"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Click to browse or drag & drop your Resume or CV file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, and TXT documents</p>
            </div>

            {selectedFile && (
              <div 
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                <X 
                  className="w-4 h-4 cursor-pointer text-slate-400 hover:text-rose-400 ml-1" 
                  onClick={() => setSelectedFile(null)} 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Resume / CV Text Content</label>
              <button
                onClick={() => setPastedText(sampleResumeSnippet)}
                className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 font-medium"
              >
                <Sparkles className="w-3 h-3" />
                <span>Load Sample CV / Resume Text</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your Resume or CV text here..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Analyze Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xl shadow-cyan-500/30 transition-all disabled:opacity-50 border border-cyan-400/30"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Analyzing Resume & Auditing Skill Gaps...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Run AI Resume & Skill-Gap Analysis</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Document Type Badge */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Detected Format:</span>
                <h3 className="text-sm font-bold text-white">{analysisResult.document_type || "Standard Resume"}</h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              ATS & Skill-Gap Analyzed
            </span>
          </div>

          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            
            {/* ATS Score Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl text-center flex flex-col items-center justify-center space-y-2 relative overflow-hidden bg-slate-900/80">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <Gauge className="w-20 h-20 text-cyan-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ATS Score Quality</span>
              <div className="relative flex items-center justify-center w-24 h-24 my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      analysisResult.ats_score >= 80 ? "text-emerald-400" :
                      analysisResult.ats_score >= 60 ? "text-amber-400" : "text-rose-400"
                    }
                    strokeDasharray={`${analysisResult.ats_score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {analysisResult.ats_score}%
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                analysisResult.ats_score >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                analysisResult.ats_score >= 60 ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
              }`}>
                {analysisResult.ats_score >= 80 ? "Strong ATS Readiness" : analysisResult.ats_score >= 60 ? "Good Baseline" : "Needs Optimization"}
              </span>
            </div>

            {/* Extracted Skills Count */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between bg-slate-900/80">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Skills Extracted</span>
                <p className="text-4xl font-extrabold text-white mt-2 font-['Plus_Jakarta_Sans']">
                  {analysisResult.total_skills_count || (analysisResult.extracted_skills?.length || 0)}
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-4">Categorized into Programming, Frameworks, Cloud, and Soft Skills.</p>
            </div>

            {/* Sections Found */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between bg-slate-900/80">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sections Completeness</span>
                <p className="text-4xl font-extrabold text-cyan-400 mt-2 font-['Plus_Jakarta_Sans']">
                  {analysisResult.sections_found?.length || 0} / 8
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-4">Recognized section headers (Experience, Research, Skills, etc.).</p>
            </div>

            {/* Word Count Health */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between bg-slate-900/80">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Length & Density</span>
                <p className="text-4xl font-extrabold text-cyan-400 mt-2 font-['Plus_Jakarta_Sans']">
                  {analysisResult.word_count || 0} <span className="text-xs text-slate-400 font-normal">words</span>
                </p>
              </div>
              <p className="text-xs text-slate-400 mt-4">Optimal for ATS screeners and hiring recruiters.</p>
            </div>

          </div>


          {/* DEDICATED AI SKILL-BASED JOB RECOMMENDATIONS SECTION */}
          {recommendedJobs.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4 bg-slate-900/90 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <Target className="w-4 h-4" />
                    <span>Instant AI Job Recommendations</span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                    Top Recommended Jobs For Your Profile
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('jobs')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md transition-all"
                >
                  <span>Explore All Job Matches</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 space-y-3 transition-all shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{job.title}</h4>
                        <p className="text-xs font-semibold text-cyan-400">{job.company}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                        {job.match_score}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {job.matched_skills?.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          ✓ {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-400">{job.location}</span>
                      <button
                        onClick={() => setActiveTab('jobs')}
                        className="text-emerald-400 hover:underline font-bold text-xs"
                      >
                        View & Apply →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Skills Tag Inventory */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>AI Extracted Candidate Skill Inventory</span>
                </h3>
                <p className="text-xs text-slate-400">These skills are automatically saved to your profile for instant job matching.</p>
              </div>

              {/* Add Custom Skill Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add custom skill..."
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Categorized Skills Render */}
            {(analysisResult.extracted_skills || []).length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 italic flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>No skills were explicitly mentioned in the uploaded resume. Skills are only extracted when explicitly stated.</span>
              </div>
            ) : Object.keys(analysisResult.skills_by_category || {}).length > 0 ? (
              <div className="space-y-4 pt-2">
                {Object.entries(analysisResult.skills_by_category).map(([cat, skills]) => (
                  <div key={cat} className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{cat}</span>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-cyan-500/40 transition-colors"
                        >
                          <span>{skill}</span>
                          <X
                            className="w-3 h-3 text-slate-500 hover:text-rose-400 cursor-pointer"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 pt-2">
                {analysisResult.extracted_skills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200"
                  >
                    <span>{skill}</span>
                    <X
                      className="w-3 h-3 text-slate-500 hover:text-rose-400 cursor-pointer"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Match CTA Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTab('jobs')}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
              >
                <span>Find Compatible Jobs ({analysisResult.extracted_skills?.length || 0} Skills Matched)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Strengths & Improvement Action Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Document Key Strengths</span>
              </h3>
              <ul className="space-y-2.5">
                {analysisResult.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Recommendations */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 bg-slate-900/80">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>ATS Improvement Recommendations</span>
              </h3>
              <ul className="space-y-2.5">
                {analysisResult.improvements?.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
