import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Code2, 
  Plus, 
  Trash2, 
  Layers, 
  Upload,
  Image as ImageIcon,
  User,
  X,
  Palette
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PortfolioGenerator() {
  const { user, userSkills } = useAuth();
  const photoInputRef = useRef(null);

  const [selectedTemplate, setSelectedTemplate] = useState('modern_tech');
  const [activeFormTab, setActiveFormTab] = useState('profile');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [portfolioData, setPortfolioData] = useState({
    name: user?.name || 'Alex Rivera',
    title: user?.role || 'Full Stack Software Engineer',
    bio: 'Passionate developer building high-performance web applications, AI tools, and accessible user interfaces.',
    location: 'Bengaluru, Karnataka',
    email: user?.email || 'alex.rivera@example.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    skills: userSkills.length > 0 ? userSkills : ['React', 'Python', 'TypeScript', 'SQL', 'Tailwind CSS', 'Node.js', 'Docker', 'Git'],
    projects: [
      {
        title: 'Skill Match AI - Smart Job Finder',
        description: 'AI-powered job matching and resume parser application built with React, Python Flask, and NLP skill extraction.',
        tech: ['React', 'Python', 'Flask', 'Tailwind CSS'],
        link: 'https://github.com'
      },
      {
        title: 'Real-time Analytics Dashboard',
        description: 'High-frequency streaming telemetry visualization platform built with microservices architecture.',
        tech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
        link: 'https://github.com'
      }
    ],
    experience: [
      {
        role: 'Senior Frontend Engineer',
        company: 'TechSphere Systems',
        period: '2023 - Present',
        description: 'Led architectural migration of enterprise dashboard to React 18, improving LCP speed by 40%.'
      }
    ]
  });

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80'
  ];

  const templates = [
    { id: 'modern_tech', name: 'Cyberpunk Glow', badge: 'Popular', desc: 'Dark theme with glowing indigo gradients & floating avatar animation' },
    { id: 'creative', name: 'Creative Emerald', badge: 'Vibrant', desc: 'Vibrant green theme with card layouts for Designers & Frontends' },
    { id: 'terminal', name: 'DevOps Terminal', badge: 'DevOps', desc: 'Code-block aesthetic with typing animation for Backend & DevOps' },
    { id: 'executive', name: 'Executive Slate', badge: 'Clean', desc: 'Corporate slate palette with subtle scale hover transitions' },
    { id: 'futuristic_3d', name: 'Futuristic 3D Rose', badge: '3D Mesh', desc: 'Animated gradient text, 3D tilt effects & rose glowing accents' }
  ];

  useEffect(() => {
    handleGenerateWebsite();
  }, [portfolioData, selectedTemplate]);

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generatePortfolio(portfolioData, selectedTemplate);
      setGeneratedHtml(res.html_code);
    } catch (err) {
      console.error('Failed to generate portfolio HTML', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPortfolioData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProject = () => {
    setPortfolioData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', tech: ['React'], link: '' }]
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    const updated = [...portfolioData.projects];
    updated[index][field] = value;
    setPortfolioData(prev => ({ ...prev, projects: updated }));
  };

  const handleRemoveProject = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleInputChange('avatar', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${portfolioData.name.toLowerCase().replace(/\s+/g, '_')}_portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2 shadow-lg shadow-cyan-500/10">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Portfolio Website Generator & Animation Designer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Build & Export Your Modern Portfolio Website
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Choose from 5 distinct styles with smooth CSS transitions, floating avatar animations, and 1-click HTML website download.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center space-x-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? "HTML Copied!" : "Copy HTML Code"}</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
          >
            <Download className="w-4 h-4" />
            <span>Download HTML Website</span>
          </button>
        </div>
      </div>

      {/* Template Theme Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3 bg-slate-900/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Select Portfolio Style & CSS Transitions:</span>
          </span>
          <span className="text-[11px] text-cyan-400 font-semibold">5 Distinct Themes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-300 ${
                selectedTemplate === tpl.id
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-md scale-[1.02]'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-bold text-white">{tpl.name}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{tpl.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs Editor + Live Sandbox iFrame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Editor (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 bg-slate-900/80">
          
          {/* Form Tabs */}
          <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFormTab('profile')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'profile' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Profile & Photo
            </button>
            <button
              onClick={() => setActiveFormTab('projects')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'projects' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Projects ({portfolioData.projects.length})
            </button>
            <button
              onClick={() => setActiveFormTab('skills')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'skills' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skills
            </button>
          </div>

          {/* Profile Form */}
          {activeFormTab === 'profile' && (
            <div className="space-y-4">
              
              {/* PROFILE PHOTO INSERTION BOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-white flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>Insert Profile Photo</span>
                </label>

                <div className="flex items-center space-x-4">
                  <img
                    src={portfolioData.avatar}
                    alt="Portfolio Profile"
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-md flex-shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />

                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo (JPG/PNG/WEBP)</span>
                    </button>
                    <p className="text-[10px] text-slate-400">Image gets embedded directly into your portfolio HTML file.</p>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Or Pick Professional Avatar Preset:</span>
                  <div className="flex items-center space-x-2">
                    {avatarPresets.map((presetUrl, pIdx) => (
                      <img
                        key={pIdx}
                        src={presetUrl}
                        alt=""
                        onClick={() => handleInputChange('avatar', presetUrl)}
                        className={`w-7 h-7 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform ${
                          portfolioData.avatar === presetUrl ? 'ring-2 ring-cyan-400' : 'opacity-60'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={portfolioData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headline Title</label>
                <input
                  type="text"
                  value={portfolioData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  value={portfolioData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  value={portfolioData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={portfolioData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={portfolioData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Projects Form */}
          {activeFormTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Featured Projects</span>
                <button
                  onClick={handleAddProject}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {portfolioData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveProject(idx)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Project description and key features..."
                    value={proj.description}
                    onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Skills Form */}
          {activeFormTab === 'skills' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Skills Inventory (Comma-separated)</label>
              <textarea
                rows={5}
                value={portfolioData.skills.join(', ')}
                onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-400">Edit skills separated by commas to update the portfolio badges.</p>
            </div>
          )}

        </div>

        {/* Right Column: Live iFrame Sandbox Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Live Interactive Website Preview</span>
            </span>
            <span className="text-[11px] text-slate-400">Includes Hover Animations & Transitions</span>
          </div>

          <div className="w-full h-[650px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
            <iframe
              srcDoc={generatedHtml}
              title="Portfolio Website Sandbox Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
