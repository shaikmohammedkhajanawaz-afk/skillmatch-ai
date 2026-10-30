import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Layout, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench,
  FolderKanban,
  Zap,
  BookOpen,
  Award,
  Globe
} from 'lucide-react';
import ModernTechTemplate from './ResumeTemplates/ModernTechTemplate';
import ExecutiveTemplate from './ResumeTemplates/ExecutiveTemplate';
import CreativeTemplate from './ResumeTemplates/CreativeTemplate';
import ClassicTemplate from './ResumeTemplates/ClassicTemplate';
import { useAuth } from '../context/AuthContext';

export default function ResumeBuilder() {
  const { updateUserSkills } = useAuth();
  
  const [docTypeMode, setDocTypeMode] = useState('resume'); // 'resume' vs 'cv'
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // 'modern', 'executive', 'creative', 'classic', 'academic_cv'
  const [activeFormTab, setActiveFormTab] = useState('personal');

  const [resumeData, setResumeData] = useState({
    fullName: 'Alex Rivera, Ph.D.',
    email: 'alex.rivera@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    github: 'github.com/arivera',
    linkedin: 'linkedin.com/in/alexrivera',
    website: 'alexrivera.dev',
    summary: 'Senior Software Engineer & AI Researcher with 5+ years of experience building high-performance distributed systems, NLP skill extraction engines, and publishing academic papers.',
    skills: ['Python', 'PyTorch', 'React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'SQL', 'Docker', 'Git', 'REST API'],
    experience: [
      {
        role: 'Senior AI Engineer & Tech Lead',
        company: 'TechSphere Systems',
        duration: '2023 - Present',
        description: 'Led architectural migration of core ML pipelines and React dashboard, improving throughput by 45%.'
      },
      {
        role: 'Research Assistant & Developer',
        company: 'Neural AI Labs',
        duration: '2021 - 2023',
        description: 'Engineered high-frequency data parsing pipelines in Python & C++. Published 2 IEEE conference papers.'
      }
    ],
    education: [
      {
        degree: 'Ph.D. in Computer Science & Artificial Intelligence',
        institution: 'Indian Institute of Science (IISc), Bengaluru',
        year: '2021 - 2025'
      },
      {
        degree: 'B.Tech in Computer Engineering',
        institution: 'National Institute of Technology (NIT)',
        year: '2017 - 2021'
      }
    ],
    projects: [
      {
        title: 'Skill Match AI Engine',
        description: 'Built an AI-powered job matching platform using React, Python Flask, and TF-IDF natural language processing.'
      }
    ],
    publications: [
      {
        title: 'Optimizing Virtual DOM & NLP Skill Extraction in High-Scale Systems',
        journal: 'IEEE Transactions on Software Engineering',
        year: '2025',
        doi: '10.1109/TSE.2025.109283'
      }
    ],
    awards: [
      {
        title: 'Best Research Paper Award',
        organization: 'International Conference on AI Systems',
        year: '2024'
      }
    ]
  });

  const [skillInput, setSkillInput] = useState('');

  const templates = [
    { id: 'modern', name: 'Modern Tech Resume', badge: 'Popular', bg: 'from-indigo-600 to-violet-600' },
    { id: 'executive', name: 'Executive Slate Resume', badge: 'Corporate', bg: 'from-slate-700 to-zinc-900' },
    { id: 'creative', name: 'Creative Glass Resume', badge: 'Vibrant', bg: 'from-teal-600 to-emerald-600' },
    { id: 'classic', name: 'Academic / Executive CV', badge: 'Multi-Page CV', bg: 'from-slate-600 to-slate-800' }
  ];

  const handleInputChange = (field, value) => {
    setResumeData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', description: '' }]
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...resumeData.experience];
    updated[index][field] = value;
    setResumeData(prev => ({ ...prev, experience: updated }));
  };

  const handleRemoveExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    const updated = [...resumeData.education];
    updated[index][field] = value;
    setResumeData(prev => ({ ...prev, education: updated }));
  };

  const handleRemoveEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleAddPublication = () => {
    setResumeData(prev => ({
      ...prev,
      publications: [...(prev.publications || []), { title: '', journal: '', year: '', doi: '' }]
    }));
  };

  const handleUpdatePublication = (index, field, value) => {
    const updated = [...(resumeData.publications || [])];
    updated[index][field] = value;
    setResumeData(prev => ({ ...prev, publications: updated }));
  };

  const handleRemovePublication = (index) => {
    setResumeData(prev => ({
      ...prev,
      publications: (prev.publications || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    const skill = skillInput.trim();
    if (!resumeData.skills.includes(skill)) {
      const updatedSkills = [...resumeData.skills, skill];
      setResumeData(prev => ({ ...prev, skills: updatedSkills }));
      updateUserSkills(updatedSkills);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = resumeData.skills.filter(s => s !== skillToRemove);
    setResumeData(prev => ({ ...prev, skills: updatedSkills }));
    updateUserSkills(updatedSkills);
  };

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive AI Resume & Curriculum Vitae (CV) Builder</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Build & Export Professional Resume / CV
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Create standard 1-2 page Resumes or detailed Academic / Executive Curriculum Vitae (CV) with PDF export.
          </p>
        </div>

        {/* Mode Toggle & Action Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setDocTypeMode('resume'); setSelectedTemplate('modern'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                docTypeMode === 'resume' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resume Mode (1-2 Pgs)
            </button>
            <button
              onClick={() => { setDocTypeMode('cv'); setSelectedTemplate('classic'); }}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                docTypeMode === 'cv' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Curriculum Vitae (CV Mode)
            </button>
          </div>

          <button
            onClick={handlePrintDownload}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Template Selector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3 bg-slate-900/80">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Template Layout Style:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl.id)}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedTemplate === tpl.id
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{tpl.name}</p>
                <span className="text-[10px] text-slate-400">{tpl.badge}</span>
              </div>
              {selectedTemplate === tpl.id && (
                <Check className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Builder Grid (Editor Form + Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6 bg-slate-900/80">
          
          {/* Form Section Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFormTab('personal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'personal' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setActiveFormTab('summary')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'summary' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveFormTab('experience')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'experience' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Work ({resumeData.experience.length})
            </button>
            <button
              onClick={() => setActiveFormTab('education')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'education' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveFormTab('skills')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeFormTab === 'skills' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Skills ({resumeData.skills.length})
            </button>

            {/* Additional CV Section Tab */}
            {docTypeMode === 'cv' && (
              <button
                onClick={() => setActiveFormTab('publications')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${
                  activeFormTab === 'publications' ? 'bg-emerald-600 text-white shadow-sm' : 'hover:text-emerald-300'
                }`}
              >
                📚 Publications ({resumeData.publications?.length || 0})
              </button>
            )}
          </div>

          {/* Form Content per active tab */}
          {activeFormTab === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name & Degrees</label>
                <input
                  type="text"
                  value={resumeData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">GitHub / Website</label>
                  <input
                    type="text"
                    value={resumeData.github}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={resumeData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeFormTab === 'summary' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Executive / Academic CV Summary</label>
              <textarea
                rows={6}
                value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                placeholder="Highlight your years of research, academic credentials, core technical stack, key achievements, and domain expertise..."
              />
            </div>
          )}

          {activeFormTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">Professional Experience Entries</span>
                <button
                  onClick={handleAddExperience}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveExperience(idx)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Job Role / Title"
                      value={exp.role}
                      onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Duration (e.g. 2022 - Present)"
                    value={exp.duration}
                    onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />

                  <textarea
                    rows={3}
                    placeholder="Key responsibilities and quantified accomplishments..."
                    value={exp.description}
                    onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          )}

          {activeFormTab === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">Education & Academic Degrees</span>
                <button
                  onClick={handleAddEducation}
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <button
                    onClick={() => handleRemoveEducation(idx)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    placeholder="Degree (e.g. Ph.D. in Computer Science)"
                    value={edu.degree}
                    onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="University / School"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Year / Graduation Date"
                      value={edu.year}
                      onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeFormTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a skill (e.g., Python, PyTorch)..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {resumeData.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300"
                  >
                    <span>{skill}</span>
                    <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-400 ml-1">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Publications & Research Papers Tab for CV Mode */}
          {activeFormTab === 'publications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white">Academic Publications & Patents</span>
                <button
                  onClick={handleAddPublication}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Publication</span>
                </button>
              </div>

              {(resumeData.publications || []).map((pub, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 relative">
                  <button
                    onClick={() => handleRemovePublication(idx)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    placeholder="Paper Title (e.g. Optimizing Virtual DOM...)"
                    value={pub.title}
                    onChange={(e) => handleUpdatePublication(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Journal / Conference Name"
                      value={pub.journal}
                      onChange={(e) => handleUpdatePublication(idx, 'journal', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Publication Year"
                      value={pub.year}
                      onChange={(e) => handleUpdatePublication(idx, 'year', e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:border-cyan-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Live Preview Display (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Live {docTypeMode === 'cv' ? 'Curriculum Vitae (CV)' : 'ATS Resume'} Document Preview</span>
            </span>
            <span className="text-[11px] text-slate-400">{docTypeMode === 'cv' ? 'Academic/Executive Multi-Page CV' : 'Standard A4 Format'}</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-x-auto shadow-2xl">
            {selectedTemplate === 'modern' && <ModernTechTemplate resumeData={resumeData} />}
            {selectedTemplate === 'executive' && <ExecutiveTemplate resumeData={resumeData} />}
            {selectedTemplate === 'creative' && <CreativeTemplate resumeData={resumeData} />}
            {selectedTemplate === 'classic' && <ClassicTemplate resumeData={resumeData} />}
          </div>
        </div>

      </div>

    </div>
  );
}
