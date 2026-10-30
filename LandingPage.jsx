import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  FileSearch, 
  FileText, 
  Briefcase, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Award, 
  Radio, 
  Bot, 
  Globe, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  ChevronRight, 
  Star, 
  Cpu, 
  Activity, 
  Play, 
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Terminal,
  Crosshair,
  Sliders,
  Flame
} from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import Logo from './Logo';

export default function LandingPage() {
  const [introStep, setIntroStep] = useState(0); // 0: Singularity, 1: Neural Expansion, 2: Logo Assembly, 3: Tagline, 4: Enter Landing
  const [skipIntro, setSkipIntro] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Hero Demonstration Interactive State
  const [activeDemonstrationSkill, setActiveDemonstrationSkill] = useState('React');
  const [demoPulse, setDemoPulse] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Job matching telemetry data corresponding to selected demo skill
  const demoSkillData = {
    'React': {
      role: 'Senior React & Frontend Architect',
      company: 'TechSphere Systems • Bengaluru',
      matchScore: '98.6%',
      salary: '₹24 - ₹36 LPA',
      skillsMatched: 8,
      totalSkills: 8,
      cosineSim: '0.962',
      jaccardIndex: '0.941'
    },
    'Python': {
      role: 'AI / Backend Systems Engineer',
      company: 'NeuralMind Technologies • Hyderabad',
      matchScore: '97.8%',
      salary: '₹22 - ₹34 LPA',
      skillsMatched: 7,
      totalSkills: 7,
      cosineSim: '0.954',
      jaccardIndex: '0.915'
    },
    'Java': {
      role: 'Enterprise Cloud Services Lead',
      company: 'ApexCore Solutions • Pune / Remote',
      matchScore: '96.4%',
      salary: '₹20 - ₹32 LPA',
      skillsMatched: 9,
      totalSkills: 9,
      cosineSim: '0.941',
      jaccardIndex: '0.889'
    },
    'SQL': {
      role: 'Lead Data Analytics Engineer',
      company: 'FinVeloce Analytics • Mumbai',
      matchScore: '95.9%',
      salary: '₹18 - ₹28 LPA',
      skillsMatched: 6,
      totalSkills: 6,
      cosineSim: '0.932',
      jaccardIndex: '0.875'
    },
    'Machine Learning': {
      role: 'Principal Machine Learning Scientist',
      company: 'CognitiveScale AI • Gurugram',
      matchScore: '99.1%',
      salary: '₹28 - ₹42 LPA',
      skillsMatched: 10,
      totalSkills: 10,
      cosineSim: '0.985',
      jaccardIndex: '0.960'
    }
  };

  // =========================================================================
  // BROWSER-NATIVE WEB AUDIO SYNTHESIZER (CINEMATIC SFX)
  // =========================================================================
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSubBass = () => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const playHoloBeep = (freq = 880) => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const playWarpWhoosh = () => {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // White noise buffer for sci-fi whoosh
      const bufferSize = ctx.sampleRate * 0.6;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.3);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  };

  // Toggle audio
  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (nextState) {
      getAudioContext();
      playHoloBeep(980);
    }
  };

  // Cinematic Timeline Sequence
  useEffect(() => {
    if (skipIntro) return;

    playSubBass();
    const timer1 = setTimeout(() => {
      setIntroStep(1);
      playHoloBeep(640);
    }, 1100);

    const timer2 = setTimeout(() => {
      setIntroStep(2);
      playHoloBeep(1020);
    }, 2400);

    const timer3 = setTimeout(() => {
      setIntroStep(3);
      playHoloBeep(1280);
    }, 3800);

    const timer4 = setTimeout(() => {
      playWarpWhoosh();
      setIntroStep(4);
    }, 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [skipIntro, audioEnabled]);

  // Mouse Parallax Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // =========================================================================
  // ULTRA-CINEMATIC 3D PERSPECTIVE STARFIELD & NEURAL CONSTELATION CANVAS
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 250 Interactive 3D Stars & Neural Nodes
    const particleCount = 220;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * 1200 + 1,
      baseZ: Math.random() * 1200 + 1,
      size: Math.random() * 2.2 + 0.8,
      speed: Math.random() * 1.5 + 0.8,
      color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#2563eb' : '#06b6d4'),
      pulseOffset: Math.random() * Math.PI * 2
    }));

    // Expanding shockwaves from interactions
    let shockwaves = [];

    const handleCanvasClick = (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        opacity: 0.8
      });
      playHoloBeep(1100);
    };
    window.addEventListener('click', handleCanvasClick);

    let time = 0;

    const render = () => {
      time += 0.02;

      // Deep Space Fade Trail
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + mousePos.x * 0.8;
      const cy = height / 2 + mousePos.y * 0.8;

      // Draw Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4;
        sw.opacity *= 0.94;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (sw.radius > sw.maxRadius || sw.opacity < 0.01) {
          shockwaves.splice(i, 1);
        }
      }

      // Camera push factor during warp transition
      const warpFactor = (introStep === 4 && !skipIntro) ? 2.5 : 1;

      // Update & Render 3D Depth Stars
      particles.forEach((p) => {
        p.z -= p.speed * warpFactor;
        if (p.z <= 0) p.z = 1200;

        const k = 450 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= -20 && px <= width + 20 && py >= -20 && py <= height + 20) {
          const size = Math.max(0.6, p.size * k);
          const depthAlpha = Math.min(1, Math.max(0.1, (1200 - p.z) / 950));
          const shimmer = (Math.sin(time * 2 + p.pulseOffset) + 1) * 0.15 + 0.7;

          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = depthAlpha * shimmer;
          ctx.shadowBlur = p.z < 400 ? 12 : 4;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();
        }
      });

      // Draw Neural Synapse Network Lines between nearby nodes
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i += 4) {
        for (let j = i + 1; j < particles.length; j += 7) {
          const p1 = particles[i];
          const p2 = particles[j];

          const k1 = 450 / p1.z;
          const k2 = 450 / p2.z;

          const x1 = p1.x * k1 + cx;
          const y1 = p1.y * k1 + cy;
          const x2 = p2.x * k2 + cx;
          const y2 = p2.y * k2 + cy;

          const dist = Math.hypot(x1 - x2, y1 - y2);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#0284c7';
            ctx.globalAlpha = (1 - dist / 110) * 0.28;
            ctx.lineWidth = 0.7;
            ctx.stroke();

            // Animated traveling light packet along line
            if (i % 8 === 0) {
              const pulseProg = (time * 0.8 + i) % 1;
              const px = x1 + (x2 - x1) * pulseProg;
              const py = y1 + (y2 - y1) * pulseProg;
              ctx.beginPath();
              ctx.arc(px, py, 1.2, 0, Math.PI * 2);
              ctx.fillStyle = '#67e8f9';
              ctx.globalAlpha = 0.8;
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [introStep, skipIntro, mousePos]);

  const handleSelectDemoSkill = (skillName) => {
    setActiveDemonstrationSkill(skillName);
    setDemoPulse(true);
    playHoloBeep(1200);
    setTimeout(() => setDemoPulse(false), 700);
  };

  const handleReplayIntro = () => {
    setSkipIntro(false);
    setIntroStep(0);
    playSubBass();
  };

  const features = [
    {
      icon: FileSearch,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      title: 'AI Resume Analyzer & ATS Scorer',
      desc: 'Upload PDF/DOCX resumes to compute 0-100 ATS scores, extract technical skill inventories, and inspect missing section audits.'
    },
    {
      icon: Radio,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      title: 'Real-Time SerpApi Google Jobs',
      desc: 'Stream verified live tech listings directly from Google Jobs API across Bangalore, Hyderabad, Pune, Mumbai, and pan-India.'
    },
    {
      icon: Layers,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: 'TF-IDF & Jaccard Matching',
      desc: 'Dual-algorithm mathematical vector ranking that scores your match percentage and highlights matched vs missing competencies.'
    },
    {
      icon: Target,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: 'Skill Gap & 60-Day Roadmap',
      desc: 'Identify critical deficits for your target role and generate a day-by-day learning schedule with free resource recommendations.'
    },
    {
      icon: Award,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      title: 'Practice Exams & Coding Sandbox',
      desc: 'Complete aptitude, logical reasoning, and domain technical tests with real-time browser code execution and grading.'
    },
    {
      icon: Bot,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      title: 'Gemini AI Career Coach',
      desc: 'Multimodal conversational advisor for tailored interview practice, resume bullet feedback, and salary negotiation guidance.'
    }
  ];

  const currentMatch = demoSkillData[activeDemonstrationSkill] || demoSkillData['React'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Persistent Cosmic Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80" 
      />

      {/* Global Cinematic Scanline Grid Filter */}
      <div className="fixed inset-0 cinema-scanlines pointer-events-none z-30" />

      {/* ========================================================================= */}
      {/* 🎬 ULTRA-CINEMATIC MOVIE-STYLE STARTUP SEQUENCE */}
      {/* ========================================================================= */}
      {!skipIntro && introStep < 4 && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-1000 ease-out select-none">
          
          {/* Cinematic 2.39:1 Anamorphic Top & Bottom Letterbox Bars */}
          <div className="absolute top-0 left-0 right-0 h-14 sm:h-20 bg-black z-40 border-b border-slate-900 flex items-center justify-between px-6 text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>SKILL MATCH AI // PRODUCTION CINEMATIC PREVIEW</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">ANAMORPHIC WIDESCREEN 2.39:1</span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-20 bg-black z-40 border-t border-slate-900 flex items-center justify-between px-6 text-[10px] font-mono text-slate-500 tracking-widest">
            <span>NEURAL ENGINES ONLINE</span>
            <button
              onClick={() => {
                setSkipIntro(true);
                playWarpWhoosh();
              }}
              className="px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-all font-bold"
            >
              SKIP INTRO [ESC]
            </button>
          </div>

          {/* Volumetric Radial Nebula Backlight */}
          <div className="absolute w-[900px] h-[900px] bg-gradient-to-r from-blue-600/25 via-cyan-500/20 to-indigo-600/25 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />

          {/* Phase 0: Singularity & Horizontal Anamorphic Lens Flare */}
          {introStep === 0 && (
            <div className="relative flex flex-col items-center justify-center py-12 animate-in fade-in duration-1000 space-y-6">
              <div className="relative flex items-center justify-center">
                {/* Horizontal Anamorphic Flare Streak */}
                <div className="absolute w-[80vw] max-w-4xl h-0.5 anamorphic-flare animate-lens-flare" />
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_40px_16px_#38bdf8] animate-ping" />
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_25px_8px_#ffffff]" />
              </div>
              <p className="text-[11px] font-mono tracking-[0.4em] text-cyan-300 uppercase animate-pulse pt-4">
                &gt; INITIALIZING SYNAPTIC VECTOR FIELD...
              </p>
            </div>
          )}

          {/* Phase 1: Neural Constellation & Quantum Vectors */}
          {introStep === 1 && (
            <div className="relative flex flex-col items-center justify-center space-y-6 animate-in zoom-in-50 fade-in duration-800">
              <div className="relative p-8 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md shadow-[0_0_60px_rgba(6,182,212,0.25)]">
                <Cpu className="w-16 h-16 text-cyan-400 animate-spin-slow" />
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
              </div>
              <div className="space-y-1 text-center font-mono">
                <p className="text-xs font-bold text-white tracking-widest uppercase">
                  CALIBRATING 500+ SKILL TAXONOMIES
                </p>
                <p className="text-[10px] text-cyan-400 tracking-wider">
                  [ PYTHON // REACT // DOCKER // ML // TYPESCRIPT // SQL ]
                </p>
              </div>
            </div>
          )}

          {/* Phase 2: Quantum Logo Assembly with Volumetric Light Sweep */}
          {introStep === 2 && (
            <div className="relative group animate-in fade-in zoom-in-75 duration-900 flex flex-col items-center">
              <div className="relative overflow-hidden p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/50 shadow-[0_0_80px_rgba(56,189,248,0.35)]">
                {/* Sweeping Light Ray */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent -skew-x-12 animate-light-sweep pointer-events-none z-20" />
                <Logo size="lg" variant="dark" />
              </div>
              <span className="mt-4 text-[10px] font-mono text-slate-400 tracking-[0.3em] uppercase">
                EMBLEM SYNCHRONIZED
              </span>
            </div>
          )}

          {/* Phase 3: Movie Title & Epic Tagline Reveal */}
          {introStep === 3 && (
            <div className="relative z-10 max-w-2xl text-center space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-900 flex flex-col items-center">
              <div className="p-4 rounded-3xl bg-slate-950/90 border border-cyan-500/40 shadow-2xl">
                <Logo size="lg" variant="dark" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-300 font-['Plus_Jakarta_Sans'] tracking-tight">
                  AI-Powered Smart Job Finder
                </h1>
                <p className="text-xs sm:text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase">
                  THE FUTURE OF TECH CAREER ACCELERATION
                </p>
              </div>

              {/* Enter Button */}
              <button
                onClick={() => {
                  playWarpWhoosh();
                  setIntroStep(4);
                }}
                className="mt-6 px-9 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-extrabold tracking-widest uppercase transition-all shadow-[0_0_35px_rgba(6,182,212,0.5)] transform hover:scale-105 flex items-center space-x-2"
              >
                <span>ENTER APPLICATION &gt;&gt;</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 MAIN CINEMATIC LANDING PAGE */}
      {/* ========================================================================= */}

      {/* Global Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-cyan-500/15 blur-[180px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Sticky Cinematic Navigation Bar */}
      <header className="sticky top-0 z-40 h-20 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo with Holo Glint */}
          <div className="flex items-center space-x-3">
            <Logo size="md" variant="dark" />
          </div>

          {/* Action Navigation Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Audio Ambient Synth Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                audioEnabled 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={audioEnabled ? "Disable Cinematic Audio" : "Enable Atmospheric Cinematic Sound FX"}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{audioEnabled ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            {/* Replay Cinematic Intro Button */}
            <button
              onClick={handleReplayIntro}
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cinematic Intro</span>
            </button>

            <SignInButton mode="modal">
              <button className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-bold transition-all">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 border border-cyan-400/30">
                Get Started
              </button>
            </SignUpButton>

          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-20 lg:pt-18 lg:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Holographic Glowing Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Next-Gen Neural Job Matching & Career Operating System</span>
            </div>

            {/* Master Cinema Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] font-['Plus_Jakarta_Sans']">
              Match Your Skills to <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400">
                Dream Tech Jobs with AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Upload your resume for real-time ATS scoring, match against verified database & live Google Jobs, and follow personalized learning roadmaps.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-xl shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 border border-cyan-400/30">
                  <Flame className="w-4 h-4 text-cyan-300" />
                  <span>Start Matching Jobs Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>

              <SignInButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 shadow-md transition-all flex items-center justify-center space-x-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Candidate Sign In</span>
                </button>
              </SignInButton>
            </div>

            {/* ========================================================================= */}
            {/* ⚡ INTERACTIVE 3D HOLOGRAPHIC SKILL-TO-JOB DEMONSTRATION WIDGET */}
            {/* ========================================================================= */}
            <div className="pt-10 max-w-5xl mx-auto">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl bg-slate-900/90 relative overflow-hidden text-left cinema-border">
                
                {/* Header Readout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                        LIVE NEURAL ROUTING TELEMETRY
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                      Interactive AI Skill-to-Job Matching Simulation
                    </h3>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click any skill to trigger neural routing</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
                  
                  {/* Column 1: Floating Candidate Skills */}
                  <div className="lg:col-span-4 space-y-3">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      1. SELECT CANDIDATE SKILL:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {['React', 'Python', 'Java', 'SQL', 'Machine Learning'].map((skill) => {
                        const isSelected = activeDemonstrationSkill === skill;
                        return (
                          <button
                            key={skill}
                            onClick={() => handleSelectDemoSkill(skill)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                            }`}
                          >
                            <Zap className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span>{skill}</span>
                            {isSelected && <Check className="w-3 h-3 text-cyan-300" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Column 2: 3D Holographic AI Neural Core */}
                  <div className="lg:col-span-4 flex flex-col items-center justify-center py-4 relative">
                    
                    {/* Concentric Orbital Hologram Rings */}
                    <div className="relative flex items-center justify-center">
                      
                      {/* Outer Ring */}
                      <div className="w-28 h-28 rounded-full border border-dashed border-cyan-500/30 animate-spin-slow absolute" />
                      
                      {/* Middle Ring */}
                      <div className="w-24 h-24 rounded-full border-t border-b border-blue-500/40 animate-spin absolute" />

                      {/* Quantum Core Cube */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-2xl transition-all duration-500 ${
                        demoPulse ? 'scale-115 shadow-[0_0_40px_rgba(56,189,248,0.7)]' : 'shadow-[0_0_25px_rgba(56,189,248,0.35)]'
                      }`}>
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                          <Cpu className={`w-9 h-9 text-cyan-400 ${demoPulse ? 'animate-spin' : 'animate-pulse'}`} />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent -skew-x-12 animate-light-sweep" />
                        </div>
                      </div>

                    </div>

                    <div className="text-center mt-3 font-mono">
                      <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        AI QUANTUM PROCESSOR
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Cosine Sim: {currentMatch.cosineSim} • Jaccard: {currentMatch.jaccardIndex}
                      </p>
                    </div>

                  </div>

                  {/* Column 3: Recommended High-Fit Job Card */}
                  <div className="lg:col-span-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      2. ALGORITHMIC JOB MATCH:
                    </span>
                    <div className="p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/30 space-y-3 shadow-xl hover:border-cyan-400 transition-all">
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white font-['Plus_Jakarta_Sans']">
                            {currentMatch.role}
                          </h4>
                          <p className="text-[11px] text-cyan-400 font-medium">
                            {currentMatch.company}
                          </p>
                        </div>
                        <div className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          {currentMatch.matchScore}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900 text-slate-400 font-mono">
                        <span>Est. Comp:</span>
                        <span className="text-slate-200 font-bold">{currentMatch.salary}</span>
                      </div>

                      <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Matched {currentMatch.skillsMatched} of {currentMatch.totalSkills} requirements</span>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Floating Telemetry Chips */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% CLERK AUTHENTICATION</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>REAL-TIME SERPAPI GOOGLE STREAM</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>GEMINI 2.0 REASONING ENGINE</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>52 PRESERVED LOCAL POSITIONS</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 bg-slate-950/90 border-y border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              // ARCHITECTURE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Complete AI Career Operating System
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything required to audit resumes, extract tech skillsets, benchmark matches, and ace interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all duration-300 group bg-slate-900/80 cinema-border">
                  <div className={`p-3 rounded-xl border ${feat.color} w-fit group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3 Step Workflow Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">WORKFLOW PIPELINE</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              How Skill Match AI Accelerates You
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Upload Resume / Profile',
                desc: 'Sign in securely with Clerk Auth and submit your resume for automated PDF/DOCX parsing and ATS scoring.'
              },
              {
                num: '02',
                title: 'Vector Skill Matching',
                desc: 'TF-IDF & Jaccard similarity algorithms rank local verified roles and SerpApi Google Jobs in real time.'
              },
              {
                num: '03',
                title: 'Bridge Gaps & Land Role',
                desc: 'Follow curated 60-day roadmaps, practice technical exam questions, and generate standalone portfolio websites.'
              }
            ].map((step, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 shadow-xl bg-slate-900/80 cinema-border">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-['Plus_Jakarta_Sans']">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Call to Action Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border border-cyan-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden cinema-border">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none" />
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Ready to Accelerate Your Career?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Unlock automated ATS resume scoring, live Google Jobs matching, and AI career guidance today.
            </p>
            <SignUpButton mode="modal">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/30 transition-all border border-cyan-400/30">
                Create Free Account Now
              </button>
            </SignUpButton>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800/80 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" variant="dark" />
          <p className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} SKILL MATCH AI. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

    </div>
  );
}
