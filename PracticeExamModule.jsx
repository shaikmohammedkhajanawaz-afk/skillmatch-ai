import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Brain, 
  Code, 
  Bot, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Timer, 
  Play, 
  Send, 
  Sparkles, 
  Zap, 
  Award, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Layers, 
  Terminal, 
  BookOpen, 
  UserCheck, 
  Target, 
  ShieldCheck, 
  AlertCircle,
  FileCode,
  MessageSquare,
  Cpu,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function PracticeExamModule() {
  const { user, userSkills } = useAuth();

  // Primary Category Navigation: 'overview', 'aptitude', 'reasoning', 'coding', 'interview'
  const [activeCategory, setActiveCategory] = useState('overview');

  // Exam Generation Data
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examHistory, setExamHistory] = useState([]);

  // Sub-Category State Filters
  const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedTargetRole, setSelectedTargetRole] = useState('Software Engineer');
  const [selectedAptTopic, setSelectedAptTopic] = useState('All');
  const [selectedReasTopic, setSelectedReasTopic] = useState('All');

  // Quiz / Practice State
  const [currentSection, setCurrentSection] = useState('aptitude');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Coding IDE State
  const [selectedCodeProblem, setSelectedCodeProblem] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [codeExecutionRes, setCodeExecutionRes] = useState(null);
  const [executingCode, setExecutingCode] = useState(false);

  // AI Interview Mode State
  const [interviewData, setInterviewData] = useState(null);
  const [currentInterviewIdx, setCurrentInterviewIdx] = useState(0);
  const [candidateInterviewAns, setCandidateInterviewAns] = useState('');
  const [interviewTurnEval, setInterviewTurnEval] = useState(null);
  const [evaluatingTurn, setEvaluatingTurn] = useState(false);
  const [interviewLogs, setInterviewLogs] = useState([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Final Report State
  const [evaluationReport, setEvaluationReport] = useState(null);

  // Initial Load
  useEffect(() => {
    loadExamData();
    fetchHistory();
  }, [user?.id]);

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const loadExamData = async () => {
    setLoading(true);
    try {
      const res = await api.generatePracticeExam(userSkills, 'full', selectedDifficulty.toLowerCase());
      setExamData(res);

      // Set default coding problem
      const pyProbs = res?.sections?.coding?.problems || [];
      if (pyProbs.length > 0) {
        setSelectedCodeProblem(pyProbs[0]);
        setUserCode(pyProbs[0].default_code || '');
      }
    } catch (err) {
      console.warn('Could not load exam structure', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.getPracticeExamHistory(user?.id || 'demo_user');
      setExamHistory(res.attempts || []);
    } catch (err) {
      console.warn('Could not fetch exam history', err);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Category Practice Mode
  const startCategoryPractice = (category) => {
    setActiveCategory(category);
    setCurrentQIndex(0);
    setShowHint(false);
    setShowExplanation(false);
    setTimerSeconds(0);
    setTimerRunning(true);

    if (category === 'interview') {
      startAIInterviewSession();
    }
  };

  // AI Interview Session Initializer
  const startAIInterviewSession = async () => {
    setLoading(true);
    setInterviewCompleted(false);
    setInterviewLogs([]);
    setCurrentInterviewIdx(0);
    setInterviewTurnEval(null);
    setCandidateInterviewAns('');

    try {
      const profileData = await api.getProfile(user?.id || 'demo_user');
      const res = await api.startAIInterview(user?.id || 'demo_user', selectedTargetRole, profileData);
      setInterviewData(res);
    } catch (err) {
      console.warn('Could not start AI interview', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer Turn in AI Interview
  const handleNextInterviewTurn = async () => {
    if (!interviewData || !interviewData.questions) return;
    const currentQ = interviewData.questions[currentInterviewIdx];
    if (!currentQ) return;

    setEvaluatingTurn(true);
    try {
      const evalRes = await api.evaluateInterviewTurn(currentQ.question, candidateInterviewAns, selectedTargetRole);
      setInterviewTurnEval(evalRes);

      const turnLog = {
        question: currentQ.question,
        category: currentQ.category,
        answer: candidateInterviewAns,
        evaluation: evalRes
      };
      setInterviewLogs(prev => [...prev, turnLog]);
    } catch (err) {
      console.error('Turn evaluation error', err);
    } finally {
      setEvaluatingTurn(false);
    }
  };

  const handleProceedNextInterviewQuestion = () => {
    setInterviewTurnEval(null);
    setCandidateInterviewAns('');
    if (currentInterviewIdx + 1 < (interviewData?.questions?.length || 0)) {
      setCurrentInterviewIdx(prev => prev + 1);
    } else {
      setInterviewCompleted(true);
    }
  };

  // Code Execution Handler
  const handleRunCode = async () => {
    if (!selectedCodeProblem) return;
    setExecutingCode(true);
    try {
      const res = await api.runExamCode(selectedLanguage, userCode, selectedCodeProblem.id);
      setCodeExecutionRes(res);
    } catch (err) {
      console.error('Code execution failed', err);
    } finally {
      setExecutingCode(false);
    }
  };

  // MCQ Selection Handler
  const handleSelectOption = (qId, optionText) => {
    setMcqAnswers(prev => ({ ...prev, [qId]: optionText }));
  };

  // Submit Practice Test
  const handleSubmitExam = async () => {
    setTimerRunning(false);
    setLoading(true);
    try {
      const payload = {
        user_id: user?.id || 'demo_user',
        exam_mode: activeCategory === 'overview' ? 'full' : activeCategory,
        difficulty: selectedDifficulty.toLowerCase(),
        mcq_answers: mcqAnswers,
        code_submissions: selectedCodeProblem ? { [selectedCodeProblem.id]: userCode } : {},
        exam_structure: examData
      };
      const res = await api.submitPracticeExam(payload);
      setEvaluationReport(res);
      fetchHistory();
    } catch (err) {
      console.error('Failed to submit exam', err);
    } finally {
      setLoading(false);
    }
  };

  // Questions Array helper for Active Category
  const getActiveQuestionsList = () => {
    if (!examData || !examData.sections) return [];
    if (activeCategory === 'aptitude') {
      const qs = examData.sections.aptitude?.questions || [];
      if (selectedAptTopic === 'All') return qs;
      return qs.filter(q => q.topic === selectedAptTopic);
    }
    if (activeCategory === 'reasoning') {
      const qs = examData.sections.reasoning?.questions || [];
      if (selectedReasTopic === 'All') return qs;
      return qs.filter(q => q.topic === selectedReasTopic);
    }
    return [];
  };

  const activeQuestions = getActiveQuestionsList();
  const currentQ = activeQuestions[currentQIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel-dark p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Assessment & Placement Prep Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Practice & AI Interview Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Prepare for placement exams & technical interviews with Quant Aptitude, Logical Reasoning, Multi-Language Coding IDE, and 1-on-1 AI Mock Interviews.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => startCategoryPractice('aptitude')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'aptitude'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Aptitude
          </button>
          <button
            onClick={() => startCategoryPractice('reasoning')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'reasoning'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Reasoning
          </button>
          <button
            onClick={() => startCategoryPractice('coding')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'coding'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Coding IDE
          </button>
          <button
            onClick={() => startCategoryPractice('interview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'interview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            AI Mock Interview
          </button>
        </div>
      </div>

      {/* CATEGORY 1: OVERVIEW DASHBOARD */}
      {activeCategory === 'overview' && (
        <div className="space-y-8">
          
          {/* 4 Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Quantitative Aptitude */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Quantitative Aptitude</h3>
                <p className="text-xs text-slate-400 mt-1">Percentages, Profit & Loss, Ratios, Time & Work, Speed, Probability, Data Interpretation.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400">10 Placement Topics</span>
                <button
                  onClick={() => startCategoryPractice('aptitude')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-blue-500/20"
                >
                  <span>Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Logical Reasoning */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Logical & Verbal Reasoning</h3>
                <p className="text-xs text-slate-400 mt-1">Series, Coding-Decoding, Blood Relations, Syllogisms, Seating Arrangements, Puzzles.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-cyan-400">8 Reasoning Topics</span>
                <button
                  onClick={() => startCategoryPractice('reasoning')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-cyan-500/20"
                >
                  <span>Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Multi-Language Coding IDE */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Multi-Language Coding IDE</h3>
                <p className="text-xs text-slate-400 mt-1">Python, JavaScript, Java, C, C++. Problem statements, constraints, sample & test cases.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-400">5 Languages Supported</span>
                <button
                  onClick={() => startCategoryPractice('coding')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-purple-500/20"
                >
                  <span>Open IDE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: AI Technical & Mock Interview */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl space-y-4 hover:border-rose-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">AI Technical & Mock Interview</h3>
                <p className="text-xs text-slate-400 mt-1">Resume & role-tailored 1-on-1 interview practice with turn-by-turn AI feedback & scoring.</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-bold text-rose-400">1-on-1 Gemini AI</span>
                <button
                  onClick={() => startCategoryPractice('interview')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-rose-500/20"
                >
                  <span>Start Interview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Performance & History Analytics */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/90 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Candidate Performance & Progress History</h3>
                  <p className="text-[11px] text-slate-400">Track scores, accuracy, and AI recommendations over time</p>
                </div>
              </div>
            </div>

            {examHistory.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <Award className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-200">No Assessment Attempts Recorded Yet</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Start practicing Aptitude, Reasoning, Coding, or AI Mock Interview sessions above to record your scores and generate personalized topic recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {examHistory.map((att, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">Attempt #{att.id}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 uppercase">
                          {att.exam_mode} Mode ({att.difficulty})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Date: {new Date(att.created_at).toLocaleDateString()} • Accuracy: <strong className="text-emerald-400">{att.accuracy}%</strong>
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Overall Score</span>
                        <span className="text-lg font-extrabold text-cyan-300">{att.overall_score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* CATEGORY 2 & 3: QUANTITATIVE APTITUDE & LOGICAL REASONING HUB */}
      {(activeCategory === 'aptitude' || activeCategory === 'reasoning') && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/90 shadow-xl space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
                {activeCategory === 'aptitude' ? 'Quantitative Aptitude' : 'Logical Reasoning'}
              </div>
              
              {/* Topic Selector Filter */}
              <select
                value={activeCategory === 'aptitude' ? selectedAptTopic : selectedReasTopic}
                onChange={(e) => activeCategory === 'aptitude' ? setSelectedAptTopic(e.target.value) : setSelectedReasTopic(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
              >
                <option value="All">All Topics</option>
                {activeCategory === 'aptitude' ? (
                  <>
                    <option value="Percentages">Percentages</option>
                    <option value="Time & Work">Time & Work</option>
                    <option value="Profit & Loss">Profit & Loss</option>
                    <option value="Time, Speed & Distance">Speed & Distance</option>
                    <option value="Probability">Probability</option>
                    <option value="Ratios">Ratios</option>
                    <option value="Averages">Averages</option>
                    <option value="Data Interpretation">Data Interpretation</option>
                  </>
                ) : (
                  <>
                    <option value="Number Series">Number Series</option>
                    <option value="Coding-Decoding">Coding-Decoding</option>
                    <option value="Blood Relations">Blood Relations</option>
                    <option value="Directions">Directions</option>
                    <option value="Syllogisms">Syllogisms</option>
                    <option value="Seating Arrangements">Seating Arrangements</option>
                    <option value="Puzzles">Puzzles</option>
                  </>
                )}
              </select>

              {/* Difficulty Level Selector */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
              >
                <option value="Easy">Beginner</option>
                <option value="Medium">Intermediate</option>
                <option value="Hard">Advanced</option>
              </select>
            </div>

            {/* Timer Display */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 font-bold shadow-inner">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Active Question View */}
          {currentQ ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Question {currentQIndex + 1} of {activeQuestions.length}</span>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] uppercase font-bold">
                  {currentQ.topic} ({currentQ.difficulty})
                </span>
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
                <p className="text-base font-bold text-white leading-relaxed font-['Plus_Jakarta_Sans']">
                  {currentQ.question}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.options?.map((opt, idx) => {
                  const isSelected = mcqAnswers[currentQ.id] === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`p-4 rounded-2xl text-xs font-semibold text-left transition-all flex items-center justify-between border ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-500/10 font-bold'
                          : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:bg-slate-900 hover:border-cyan-500/50 hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Hint & Explanation Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>

                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{showExplanation ? 'Hide Explanation' : 'Show Solution'}</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => { setCurrentQIndex(prev => prev - 1); setShowHint(false); setShowExplanation(false); }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800 hover:text-white disabled:opacity-40 transition-colors"
                  >
                    Previous
                  </button>

                  {currentQIndex + 1 < activeQuestions.length ? (
                    <button
                      onClick={() => { setCurrentQIndex(prev => prev + 1); setShowHint(false); setShowExplanation(false); }}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                    >
                      Submit Section
                    </button>
                  )}
                </div>
              </div>

              {/* Hint Box */}
              {showHint && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 animate-in fade-in">
                  <strong>Hint:</strong> Focus on identifying the key variables and applying standard formula transformation.
                </div>
              )}

              {/* Solution & Explanation Box */}
              {showExplanation && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Correct Answer: {currentQ.correct_answer}</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">{currentQ.explanation}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              No questions found for the selected topic/filter.
            </div>
          )}

        </div>
      )}

      {/* CATEGORY 4: MULTI-LANGUAGE ONLINE CODING IDE PLATFORM */}
      {activeCategory === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side: Problem Statement & Constraints */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Problem Statement</h3>
              </div>

              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-purple-300 focus:outline-none"
              >
                <option value="Python">Python 3</option>
                <option value="JavaScript">JavaScript (Node)</option>
                <option value="Java">Java 17</option>
                <option value="C">C (GCC)</option>
                <option value="C++">C++ 20</option>
              </select>
            </div>

            {selectedCodeProblem ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">{selectedCodeProblem.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                      {selectedCodeProblem.difficulty}
                    </span>
                    <span className="text-slate-400 text-[11px]">{selectedCodeProblem.topic || 'Algorithms'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Description</span>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {selectedCodeProblem.problem_statement}
                  </p>
                </div>

                {selectedCodeProblem.constraints && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Constraints</span>
                    <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px] mt-1">
                      {selectedCodeProblem.constraints}
                    </pre>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Sample Input / Output</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block font-bold">Input</span>
                      <pre className="text-slate-200 font-mono mt-1">{selectedCodeProblem.sample_input}</pre>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block font-bold">Output</span>
                      <pre className="text-emerald-400 font-mono mt-1">{selectedCodeProblem.sample_output}</pre>
                    </div>
                  </div>
                </div>

                {selectedCodeProblem.hint && (
                  <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-[11px]">
                    <strong>Expected Concept:</strong> {selectedCodeProblem.expected_approach || selectedCodeProblem.hint}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">Loading coding problem...</div>
            )}
          </div>

          {/* Right Side: Code Editor & Execution Test Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Online Code Editor ({selectedLanguage})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunCode}
                    disabled={executingCode}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Run Test Cases</span>
                  </button>

                  <button
                    onClick={handleSubmitExam}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                  >
                    Submit Solution
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <textarea
                rows={14}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none focus:border-purple-500 leading-relaxed shadow-inner"
              />

              {/* Test Case Execution Output Panel */}
              {codeExecutionRes && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">Test Case Execution Matrix</span>
                    <span className={codeExecutionRes.all_passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {codeExecutionRes.passed_count} / {codeExecutionRes.total_test_cases} Test Cases Passed
                    </span>
                  </div>

                  <div className="space-y-2">
                    {codeExecutionRes.test_results?.map((tr, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {tr.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          <span className="text-slate-300 font-mono">Test Case {tr.test_case}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">Expected: {tr.expected_output}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* CATEGORY 5: TECHNICAL QUESTIONS & 1-ON-1 AI MOCK INTERVIEW MODE */}
      {activeCategory === 'interview' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/90 space-y-6">
          
          {/* Interview Controls & Target Role Picker */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1-on-1 AI Technical Mock Interview</h3>
                <p className="text-[11px] text-slate-400">Personalized using your resume & profile skills</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-xs text-slate-400 font-bold">Target Role:</label>
              <select
                value={selectedTargetRole}
                onChange={(e) => { setSelectedTargetRole(e.target.value); startAIInterviewSession(); }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-rose-300 focus:outline-none"
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Java Developer">Java Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Python Developer">Python Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>

              <button
                onClick={startAIInterviewSession}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>Restart</span>
              </button>
            </div>
          </div>

          {/* Active Interview Turn View */}
          {!interviewCompleted && interviewData?.questions ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Interview Question {currentInterviewIdx + 1} of {interviewData.questions.length}</span>
                <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] uppercase font-bold">
                  {interviewData.questions[currentInterviewIdx]?.category}
                </span>
              </div>

              {/* Question Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-rose-950/20 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">AI Interviewer Question</span>
                <p className="text-lg font-bold text-white leading-relaxed font-['Plus_Jakarta_Sans']">
                  "{interviewData.questions[currentInterviewIdx]?.question}"
                </p>
              </div>

              {/* Candidate Answer Textbox */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Your Answer / Technical Explanation:</label>
                <textarea
                  rows={6}
                  placeholder="Type your structured answer here. Include concepts, architecture details, and problem-solving steps..."
                  value={candidateInterviewAns}
                  onChange={(e) => setCandidateInterviewAns(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed shadow-inner"
                />
              </div>

              {/* Submit Turn Button */}
              {!interviewTurnEval ? (
                <button
                  onClick={handleNextInterviewTurn}
                  disabled={evaluatingTurn || !candidateInterviewAns.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-xl shadow-rose-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                >
                  <Bot className="w-4 h-4" />
                  <span>{evaluatingTurn ? 'Gemini AI Evaluating Answer...' : 'Submit Answer for AI Evaluation'}</span>
                </button>
              ) : (
                /* Turn Evaluation Results Card */
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Gemini AI Turn Evaluation</span>
                    <span className="text-lg font-extrabold text-white">Score: {interviewTurnEval.score}/100</span>
                  </div>

                  {/* Rating Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Correctness</span>
                      <span className="font-bold text-emerald-400">{interviewTurnEval.correctness}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Tech Depth</span>
                      <span className="font-bold text-indigo-400">{interviewTurnEval.technical_depth}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Communication</span>
                      <span className="font-bold text-cyan-400">{interviewTurnEval.communication}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Confidence</span>
                      <span className="font-bold text-amber-400">{interviewTurnEval.confidence}</span>
                    </div>
                  </div>

                  {/* Feedback Points */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <span className="font-bold text-slate-400 block">AI Constructive Feedback:</span>
                    {interviewTurnEval.feedback?.map((fb, idx) => (
                      <p key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{fb}</span>
                      </p>
                    ))}
                  </div>

                  {/* Ideal Sample Answer */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                    <span className="font-bold text-indigo-400 block">Sample Ideal Answer Model:</span>
                    <p className="text-slate-300 leading-relaxed">{interviewTurnEval.ideal_answer}</p>
                  </div>

                  <button
                    onClick={handleProceedNextInterviewQuestion}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                  >
                    Proceed to Next Interview Question →
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Interview Final Completion Summary */
            <div className="text-center py-12 space-y-6 max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  AI Mock Interview Completed!
                </h3>
                <p className="text-xs text-slate-400">
                  Great job! You have answered all interview questions tailored for the {selectedTargetRole} position.
                </p>
              </div>

              <button
                onClick={startAIInterviewSession}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xl shadow-indigo-600/30"
              >
                Start New AI Mock Interview
              </button>
            </div>
          )}

        </div>
      )}

      {/* FINAL EXAMINATION REPORT MODAL OVERLAY */}
      {evaluationReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-indigo-500/30 shadow-2xl p-6 sm:p-8 space-y-6 bg-slate-950 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-indigo-400" />
                <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                  AI Assessment Performance Report
                </h3>
              </div>
              <button onClick={() => setEvaluationReport(null)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Score Ring / Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Overall Score</span>
                <p className="text-xl font-extrabold text-white">{evaluationReport.overall_score}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
                <p className="text-xl font-extrabold text-cyan-300">{evaluationReport.accuracy}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Aptitude</span>
                <p className="text-xl font-extrabold text-purple-300">{evaluationReport.aptitude_score}%</p>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Reasoning</span>
                <p className="text-xl font-extrabold text-rose-300">{evaluationReport.reasoning_score}%</p>
              </div>
            </div>

            {/* AI Recommended Practice Topics */}
            {evaluationReport.ai_improvement_plan && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Recommended Next Practice Topics</h4>
                <div className="space-y-2">
                  {evaluationReport.ai_improvement_plan.map((plan, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-white block">{plan.weak_skill}</span>
                      <p className="text-slate-400 text-[11px]">Recommended: {plan.recommended_practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setEvaluationReport(null)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
            >
              Close Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
