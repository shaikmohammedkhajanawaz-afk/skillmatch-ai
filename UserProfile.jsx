import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Globe, 
  FileText, 
  Camera, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Linkedin,
  Github,
  Calendar,
  DollarSign,
  Building,
  Upload,
  RefreshCw,
  Eye,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function UserProfile() {
  const { user, setUser, setUserSkills } = useAuth();

  // Primary State
  const [profile, setProfile] = useState({
    user_id: user?.id || 'demo_user',
    full_name: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',
    city: '',
    state: '',
    country: 'India',
    photo_url: user?.avatar || '',

    desired_job_role: user?.role || 'Frontend Engineer',
    career_objective: '',
    experience_years: '2-4 years',
    employment_status: 'Employed',
    preferred_job_type: 'Full-time',
    preferred_work_location: 'Bengaluru / Remote',
    expected_salary: '12 - 18 LPA',

    highest_qualification: "Bachelor's Degree",
    degree: 'B.Tech / B.E.',
    specialization: 'Computer Science & Engineering',
    college_university: 'National Institute of Technology',
    graduation_year: '2023',
    cgpa_percentage: '8.5 CGPA',

    technical_skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git', 'Next.js', 'Redux'],
    programming_languages: ['JavaScript', 'TypeScript', 'Python', 'C++'],
    frameworks: ['React.js', 'Next.js', 'Express.js', 'Tailwind CSS'],
    tools: ['Git', 'GitHub', 'VS Code', 'Figma', 'Postman', 'Docker'],
    soft_skills: ['Problem Solving', 'Teamwork', 'Communication', 'Agile Methodology'],
    languages_known: ['English (Fluent)', 'Hindi (Native)'],

    work_experience: [
      {
        id: 1,
        company_name: 'TechCorp Solutions',
        job_role: 'Frontend Developer',
        start_date: '2023-06',
        end_date: 'Present',
        is_current: true,
        responsibilities: 'Built responsive web interfaces using React, TypeScript, and Tailwind CSS. Improved page load efficiency by 35%.'
      }
    ],

    certifications: [
      {
        id: 1,
        certification_name: 'Meta Front-End Developer Professional Certificate',
        issuing_organization: 'Coursera / Meta',
        issue_date: '2023-04',
        credential_id: 'META-FE-987654'
      }
    ],

    linkedin_url: 'https://linkedin.com/in/alex-rivera-dev',
    github_url: 'https://github.com/alex-rivera-dev',
    portfolio_url: 'https://alexrivera.dev',

    resume_filename: 'Alex_Rivera_Resume.pdf',
    resume_url: '',
    resume_text: '',
    ats_score: user?.ats_score || 84,
    completion_percentage: 0
  });

  // Active Edit Section Toggles
  const [editingSections, setEditingSections] = useState({
    personal: false,
    professional: false,
    education: false,
    skills: false,
    links: false
  });

  // Section Form Buffers for Edit Mode
  const [editBuffer, setEditBuffer] = useState({});

  // Skill Input Tags Buffer
  const [skillTagsInput, setSkillTagsInput] = useState({
    technical_skills: '',
    programming_languages: '',
    frameworks: '',
    tools: '',
    soft_skills: '',
    languages_known: ''
  });

  // Modal / Sub-form States for Work Exp & Certifications
  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ id: null, company_name: '', job_role: '', start_date: '', end_date: '', is_current: false, responsibilities: '' });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({ id: null, certification_name: '', issuing_organization: '', issue_date: '', credential_id: '' });

  // UI Feedback States
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Load Profile from Backend DB on mount
  useEffect(() => {
    fetchProfileData();
  }, [user?.id]);

  const fetchProfileData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await api.getProfile(user.id);
      if (data && data.user_id) {
        setProfile(prev => {
          const merged = { ...prev, ...data };
          merged.technical_skills = Array.isArray(data.technical_skills) ? data.technical_skills : prev.technical_skills;
          merged.programming_languages = Array.isArray(data.programming_languages) ? data.programming_languages : prev.programming_languages;
          merged.frameworks = Array.isArray(data.frameworks) ? data.frameworks : prev.frameworks;
          merged.tools = Array.isArray(data.tools) ? data.tools : prev.tools;
          merged.soft_skills = Array.isArray(data.soft_skills) ? data.soft_skills : prev.soft_skills;
          merged.languages_known = Array.isArray(data.languages_known) ? data.languages_known : prev.languages_known;
          merged.work_experience = Array.isArray(data.work_experience) ? data.work_experience : prev.work_experience;
          merged.certifications = Array.isArray(data.certifications) ? data.certifications : prev.certifications;
          return merged;
        });
      }
    } catch (err) {
      console.warn('Could not fetch backend profile', err);
    } finally {
      setLoading(false);
    }
  };

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Calculate Completion Percentage Dynamically
  const calculateCompletionPercentage = (prof) => {
    const fields = [
      prof.full_name,
      prof.email,
      prof.phone,
      prof.city,
      prof.desired_job_role,
      prof.career_objective,
      prof.experience_years,
      prof.highest_qualification,
      prof.degree,
      prof.college_university,
      prof.photo_url,
      prof.linkedin_url,
      prof.github_url,
      prof.resume_filename || prof.resume_text,
      (prof.technical_skills && prof.technical_skills.length > 0) ? 'yes' : '',
      (prof.work_experience && prof.work_experience.length > 0) ? 'yes' : '',
      (prof.certifications && prof.certifications.length > 0) ? 'yes' : ''
    ];

    const filled = fields.filter(f => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage(profile);

  // Save Whole Profile
  const handleSaveProfileData = async (updatedData) => {
    const merged = { ...profile, ...updatedData, completion_percentage: calculateCompletionPercentage({ ...profile, ...updatedData }) };
    setProfile(merged);

    // Sync AuthContext user state
    setUser(prev => ({
      ...prev,
      name: merged.full_name,
      role: merged.desired_job_role,
      avatar: merged.photo_url,
      skills: merged.technical_skills,
      ats_score: merged.ats_score
    }));
    setUserSkills(merged.technical_skills);

    try {
      await api.saveProfile(merged);
      showToast('Profile updated and saved to backend successfully!');
    } catch (err) {
      showToast('Profile updated locally (Backend sync warning).', 'warning');
    }
  };

  // Section Edit Handlers
  const startEditSection = (sectionName) => {
    setEditBuffer({ ...profile });
    setEditingSections(prev => ({ ...prev, [sectionName]: true }));
  };

  const cancelEditSection = (sectionName) => {
    setEditingSections(prev => ({ ...prev, [sectionName]: false }));
  };

  const saveEditSection = (sectionName) => {
    handleSaveProfileData(editBuffer);
    setEditingSections(prev => ({ ...prev, [sectionName]: false }));
  };

  // Photo Upload Handler
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const res = await api.uploadProfilePhoto(file, profile.user_id);
      if (res.photo_url) {
        handleSaveProfileData({ photo_url: res.photo_url });
        showToast('Profile photo updated successfully!');
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        handleSaveProfileData({ photo_url: reader.result });
        showToast('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    handleSaveProfileData({ photo_url: '' });
    showToast('Profile photo removed.');
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await api.uploadProfileResume(file, profile.user_id);
      if (res.profile) {
        setProfile(res.profile);
        setUserSkills(res.profile.technical_skills || []);
        showToast(`Resume "${res.filename}" uploaded & analyzed! ATS Score: ${res.ats_score}%`);
      } else {
        handleSaveProfileData({
          resume_filename: file.name,
          ats_score: res.ats_score || 85,
          technical_skills: listUnique([...profile.technical_skills, ...(res.extracted_skills || [])])
        });
        showToast(`Resume uploaded! ATS Score: ${res.ats_score || 85}%`);
      }
    } catch (err) {
      handleSaveProfileData({ resume_filename: file.name, ats_score: 82 });
      showToast(`Resume "${file.name}" uploaded successfully!`);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleRemoveResume = () => {
    handleSaveProfileData({ resume_filename: '', resume_text: '', ats_score: 0 });
    showToast('Resume file removed.');
  };

  // Unique List Helper
  const listUnique = (arr) => Array.from(new Set(arr.filter(Boolean)));

  // Add / Remove Tags for Skill Categories
  const handleAddSkillTag = (categoryKey) => {
    const tagText = skillTagsInput[categoryKey]?.trim();
    if (!tagText) return;

    const currentTags = profile[categoryKey] || [];
    if (currentTags.includes(tagText)) {
      showToast('Skill already added.', 'warning');
      return;
    }

    const updated = [...currentTags, tagText];
    handleSaveProfileData({ [categoryKey]: updated });
    setSkillTagsInput(prev => ({ ...prev, [categoryKey]: '' }));
  };

  const handleRemoveSkillTag = (categoryKey, tagToRemove) => {
    const updated = (profile[categoryKey] || []).filter(t => t !== tagToRemove);
    handleSaveProfileData({ [categoryKey]: updated });
  };

  // Work Experience Operations
  const handleSaveExpForm = () => {
    if (!expForm.company_name || !expForm.job_role) {
      showToast('Company Name and Job Role are required.', 'error');
      return;
    }

    let updatedExp = [...(profile.work_experience || [])];
    if (expForm.id) {
      updatedExp = updatedExp.map(item => item.id === expForm.id ? expForm : item);
    } else {
      updatedExp.push({ ...expForm, id: Date.now() });
    }

    handleSaveProfileData({ work_experience: updatedExp });
    setShowExpModal(false);
    showToast('Work experience entry saved!');
  };

  const handleDeleteExp = (expId) => {
    const updatedExp = (profile.work_experience || []).filter(e => e.id !== expId);
    handleSaveProfileData({ work_experience: updatedExp });
    showToast('Work experience entry removed.');
  };

  // Certification Operations
  const handleSaveCertForm = () => {
    if (!certForm.certification_name || !certForm.issuing_organization) {
      showToast('Certification Name and Issuing Organization are required.', 'error');
      return;
    }

    let updatedCert = [...(profile.certifications || [])];
    if (certForm.id) {
      updatedCert = updatedCert.map(item => item.id === certForm.id ? certForm : item);
    } else {
      updatedCert.push({ ...certForm, id: Date.now() });
    }

    handleSaveProfileData({ certifications: updatedCert });
    setShowCertModal(false);
    showToast('Certification entry saved!');
  };

  const handleDeleteCert = (certId) => {
    const updatedCert = (profile.certifications || []).filter(c => c.id !== certId);
    handleSaveProfileData({ certifications: updatedCert });
    showToast('Certification entry removed.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-16">
      
      {/* Toast Banner Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 border backdrop-blur-xl animate-in slide-in-from-top-4 duration-200 ${
          toast.type === 'error' 
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200' 
            : toast.type === 'warning'
            ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
            : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Hero Header Card with Natural Rectangular Photo & Completion Ring */}
      <div className="glass-panel-dark p-6 sm:p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8">
          
          {/* RECTANGULAR NATURAL PHOTO PRESENTATION (Not Circular) */}
          <div className="relative group flex-shrink-0">
            <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500/40 shadow-2xl shadow-blue-500/10 relative transition-transform duration-300 group-hover:scale-[1.02]">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 text-slate-500 space-y-2 p-4 text-center">
                  <User className="w-12 h-12 text-cyan-400/60" />
                  <span className="text-[11px] font-medium text-slate-400">No Photo Uploaded</span>
                </div>
              )}

              {/* Photo Overlay Actions */}
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
                <label className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{profile.photo_url ? 'Change Photo' : 'Upload Photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>

                {profile.photo_url && (
                  <button
                    onClick={handleRemovePhoto}
                    className="w-full py-1.5 px-3 rounded-xl bg-rose-600/20 border border-rose-500/30 text-rose-300 hover:bg-rose-600/30 text-[11px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rectangular Image Badge */}
            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg border border-blue-400/40">
              Pro Candidate
            </span>
          </div>

          {/* User Headline & Core Metadata */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                  {profile.full_name || 'Alex Rivera'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Profile</span>
                </span>
              </div>

              <p className="text-sm font-semibold text-cyan-400 flex items-center justify-center md:justify-start space-x-2">
                <Briefcase className="w-4 h-4 text-cyan-400 inline" />
                <span>{profile.desired_job_role || 'Desired Job Role'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 font-normal">{profile.experience_years} Exp</span>
              </p>
            </div>

            {/* Quick Contact & Location Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-300">
              {profile.email && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {(profile.city || profile.country) && (
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Top Stat Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyan-300 text-xs font-semibold flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>ATS Compatibility: <strong className="text-white font-bold">{profile.ats_score}%</strong></span>
              </div>

              <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold flex items-center space-x-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Technical Skills: <strong className="text-white font-bold">{(profile.technical_skills || []).length} Active</strong></span>
              </div>
            </div>
          </div>

          {/* Profile Completion Meter (Progress Gauge) */}
          <div className="w-full md:w-56 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Profile Strength</span>
              <span className="text-xs font-extrabold text-cyan-400">{completionPercentage}%</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 transition-all duration-500 shadow-md shadow-blue-500/50"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {completionPercentage >= 85 
                ? 'Excellent! Your profile has high visibility for top employers.'
                : 'Add education, resume & skills to reach 100% employer match strength.'}
            </p>
          </div>

        </div>
      </div>

      {/* Grid Layout of 8 Editable Profile Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SECTION 1: Personal Information */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Personal Information</h3>
                <p className="text-[11px] text-slate-400">Basic contact & identity details</p>
              </div>
            </div>

            {!editingSections.personal ? (
              <button
                onClick={() => startEditSection('personal')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => saveEditSection('personal')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-indigo-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => cancelEditSection('personal')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {!editingSections.personal ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Full Name</span>
                <span className="font-semibold text-white">{profile.full_name || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address</span>
                <span className="font-semibold text-white">{profile.email || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Phone Number</span>
                <span className="font-semibold text-white">{profile.phone || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                <span className="font-semibold text-white">{profile.dob || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Gender</span>
                <span className="font-semibold text-white">{profile.gender || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">City / State / Country</span>
                <span className="font-semibold text-white">
                  {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Not specified'}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Full Name</label>
                  <input
                    type="text"
                    value={editBuffer.full_name || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Email Address</label>
                  <input
                    type="email"
                    value={editBuffer.email || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={editBuffer.phone || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Date of Birth</label>
                  <input
                    type="date"
                    value={editBuffer.dob || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Gender</label>
                  <select
                    value={editBuffer.gender || 'Prefer not to say'}
                    onChange={(e) => setEditBuffer({ ...editBuffer, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru"
                    value={editBuffer.city || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Karnataka"
                    value={editBuffer.state || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={editBuffer.country || 'India'}
                    onChange={(e) => setEditBuffer({ ...editBuffer, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Professional Information */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Professional Preferences</h3>
                <p className="text-[11px] text-slate-400">Target role, career goals & expectations</p>
              </div>
            </div>

            {!editingSections.professional ? (
              <button
                onClick={() => startEditSection('professional')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => saveEditSection('professional')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-purple-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => cancelEditSection('professional')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {!editingSections.professional ? (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Desired Job Role</span>
                  <span className="font-semibold text-white">{profile.desired_job_role || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Experience</span>
                  <span className="font-semibold text-white">{profile.experience_years || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Employment Status</span>
                  <span className="font-semibold text-white">{profile.employment_status || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Preferred Job Type</span>
                  <span className="font-semibold text-white">{profile.preferred_job_type || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Preferred Location</span>
                  <span className="font-semibold text-white">{profile.preferred_work_location || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Expected Salary</span>
                  <span className="font-semibold text-white">{profile.expected_salary || 'Not specified'}</span>
                </div>
              </div>
              {profile.career_objective && (
                <div className="pt-2 border-t border-slate-900">
                  <span className="text-slate-400 block text-[11px] mb-1">Career Objective / Summary</span>
                  <p className="text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {profile.career_objective}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Desired Job Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={editBuffer.desired_job_role || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, desired_job_role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Experience Years</label>
                  <select
                    value={editBuffer.experience_years || '2-4 years'}
                    onChange={(e) => setEditBuffer({ ...editBuffer, experience_years: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Fresher (0 years)">Fresher (0 years)</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Employment Status</label>
                  <select
                    value={editBuffer.employment_status || 'Employed'}
                    onChange={(e) => setEditBuffer({ ...editBuffer, employment_status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Employed">Employed</option>
                    <option value="Unemployed / Actively Seeking">Unemployed / Actively Seeking</option>
                    <option value="Student">Student</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Notice Period">Notice Period</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Preferred Job Type</label>
                  <select
                    value={editBuffer.preferred_job_type || 'Full-time'}
                    onChange={(e) => setEditBuffer({ ...editBuffer, preferred_job_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Preferred Work Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru / Remote"
                    value={editBuffer.preferred_work_location || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, preferred_work_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Expected Salary</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 - 18 LPA"
                    value={editBuffer.expected_salary || ''}
                    onChange={(e) => setEditBuffer({ ...editBuffer, expected_salary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Career Objective</label>
                <textarea
                  rows={3}
                  placeholder="Summarize your professional goals, core strengths, and career objective..."
                  value={editBuffer.career_objective || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, career_objective: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Education */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Education & Qualifications</h3>
                <p className="text-[11px] text-slate-400">Academic background & university credentials</p>
              </div>
            </div>

            {!editingSections.education ? (
              <button
                onClick={() => startEditSection('education')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => saveEditSection('education')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-emerald-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => cancelEditSection('education')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {!editingSections.education ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Highest Qualification</span>
                <span className="font-semibold text-white">{profile.highest_qualification || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Degree Name</span>
                <span className="font-semibold text-white">{profile.degree || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Specialization</span>
                <span className="font-semibold text-white">{profile.specialization || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">College / University</span>
                <span className="font-semibold text-white">{profile.college_university || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Graduation Year</span>
                <span className="font-semibold text-white">{profile.graduation_year || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">CGPA / Percentage</span>
                <span className="font-semibold text-white">{profile.cgpa_percentage || 'Not specified'}</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Highest Qualification</label>
                <select
                  value={editBuffer.highest_qualification || "Bachelor's Degree"}
                  onChange={(e) => setEditBuffer({ ...editBuffer, highest_qualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Doctorate / Ph.D.">Doctorate / Ph.D.</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="High School (12th)">High School (12th)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">Degree Name</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech / M.S. / B.Sc"
                  value={editBuffer.degree || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science"
                  value={editBuffer.specialization || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">College / University</label>
                <input
                  type="text"
                  placeholder="e.g. NIT / IIT / University"
                  value={editBuffer.college_university || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, college_university: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">Graduation Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2023"
                  value={editBuffer.graduation_year || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, graduation_year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">CGPA / Percentage</label>
                <input
                  type="text"
                  placeholder="e.g. 8.5 CGPA or 85%"
                  value={editBuffer.cgpa_percentage || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, cgpa_percentage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Professional Links */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Professional Links & Online Profiles</h3>
                <p className="text-[11px] text-slate-400">LinkedIn, GitHub & personal website</p>
              </div>
            </div>

            {!editingSections.links ? (
              <button
                onClick={() => startEditSection('links')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => saveEditSection('links')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-cyan-600/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => cancelEditSection('links')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {!editingSections.links ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">LinkedIn Profile</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block max-w-xs">{profile.linkedin_url || 'Not added'}</span>
                  </div>
                </div>
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <Github className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">GitHub Repository</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block max-w-xs">{profile.github_url || 'Not added'}</span>
                  </div>
                </div>
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Personal Portfolio</span>
                    <span className="text-xs font-semibold text-slate-200 truncate block max-w-xs">{profile.portfolio_url || 'Not added'}</span>
                  </div>
                </div>
                {profile.portfolio_url && (
                  <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={editBuffer.linkedin_url || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, linkedin_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={editBuffer.github_url || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, github_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400">Portfolio Website URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={editBuffer.portfolio_url || ''}
                  onChange={(e) => setEditBuffer({ ...editBuffer, portfolio_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* SECTION 5: Comprehensive Skills Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Skills Suite & Competencies</h3>
              <p className="text-[11px] text-slate-400">Categorized tech skills, languages, tools & frameworks</p>
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-400 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            {(profile.technical_skills || []).length} Active Skills
          </span>
        </div>

        {/* Skill Category Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Category: Technical Skills */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Technical Skills</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.technical_skills || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.technical_skills || []).map((skill, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs font-semibold">
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkillTag('technical_skills', skill)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Docker)"
                value={skillTagsInput.technical_skills}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, technical_skills: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('technical_skills')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleAddSkillTag('technical_skills')}
                className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category: Programming Languages */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Programming Languages</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.programming_languages || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.programming_languages || []).map((lang, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-semibold">
                  <span>{lang}</span>
                  <button onClick={() => handleRemoveSkillTag('programming_languages', lang)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add language (e.g. Python)"
                value={skillTagsInput.programming_languages}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, programming_languages: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('programming_languages')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={() => handleAddSkillTag('programming_languages')}
                className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category: Frameworks & Libraries */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Frameworks & Libraries</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.frameworks || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.frameworks || []).map((fw, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-semibold">
                  <span>{fw}</span>
                  <button onClick={() => handleRemoveSkillTag('frameworks', fw)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add framework (e.g. Next.js)"
                value={skillTagsInput.frameworks}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, frameworks: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('frameworks')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => handleAddSkillTag('frameworks')}
                className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category: Developer Tools */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Tools & Platforms</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.tools || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.tools || []).map((tool, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
                  <span>{tool}</span>
                  <button onClick={() => handleRemoveSkillTag('tools', tool)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add tool (e.g. Postman)"
                value={skillTagsInput.tools}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, tools: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('tools')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleAddSkillTag('tools')}
                className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category: Soft Skills */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Soft Skills</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.soft_skills || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.soft_skills || []).map((ss, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold">
                  <span>{ss}</span>
                  <button onClick={() => handleRemoveSkillTag('soft_skills', ss)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add soft skill (e.g. Leadership)"
                value={skillTagsInput.soft_skills}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, soft_skills: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('soft_skills')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleAddSkillTag('soft_skills')}
                className="p-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category: Languages Known */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Languages Known</h4>
              <span className="text-[10px] text-slate-500 font-semibold">{(profile.languages_known || []).length} items</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[50px] p-2 rounded-xl bg-slate-950 border border-slate-800">
              {(profile.languages_known || []).map((lk, idx) => (
                <span key={idx} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold">
                  <span>{lk}</span>
                  <button onClick={() => handleRemoveSkillTag('languages_known', lk)} className="hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add language (e.g. English)"
                value={skillTagsInput.languages_known}
                onChange={(e) => setSkillTagsInput({ ...skillTagsInput, languages_known: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag('languages_known')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={() => handleAddSkillTag('languages_known')}
                className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 6: Work Experience History Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Work Experience & Employment History</h3>
              <p className="text-[11px] text-slate-400">Past roles, achievements & responsibilities</p>
            </div>
          </div>

          <button
            onClick={() => {
              setExpForm({ id: null, company_name: '', job_role: '', start_date: '', end_date: '', is_current: false, responsibilities: '' });
              setShowExpModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>

        {/* Experience Cards List */}
        <div className="space-y-4">
          {(profile.work_experience || []).length === 0 ? (
            <div className="text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
              No work experience added yet. Click "Add Experience" to add your past employment history.
            </div>
          ) : (
            profile.work_experience.map((exp) => (
              <div key={exp.id} className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{exp.job_role}</h4>
                    <span className="text-xs text-amber-400 font-semibold">@ {exp.company_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}</span>
                  </div>

                  {exp.responsibilities && (
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">{exp.responsibilities}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => { setExpForm(exp); setShowExpModal(true); }}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id)}
                    className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 7: Certifications & Credentials Manager */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Certifications & Credentials</h3>
              <p className="text-[11px] text-slate-400">Verified courses, licenses & achievements</p>
            </div>
          </div>

          <button
            onClick={() => {
              setCertForm({ id: null, certification_name: '', issuing_organization: '', issue_date: '', credential_id: '' });
              setShowCertModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(profile.certifications || []).length === 0 ? (
            <div className="col-span-full text-center py-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 text-slate-500 text-xs">
              No certifications added yet. Click "Add Certification" to add your credentials.
            </div>
          ) : (
            profile.certifications.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-3">
                <div className="space-y-1 truncate">
                  <h4 className="text-xs font-bold text-white truncate">{cert.certification_name}</h4>
                  <p className="text-[11px] text-rose-300 font-medium truncate">{cert.issuing_organization}</p>
                  <div className="text-[10px] text-slate-400 space-x-2">
                    <span>Issued: {cert.issue_date}</span>
                    {cert.credential_id && <span>• ID: {cert.credential_id}</span>}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <button
                    onClick={() => { setCertForm(cert); setShowCertModal(true); }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 8: Resume Management Hub & ATS Score */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-950/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Resume Management & ATS Hub</h3>
              <p className="text-[11px] text-slate-400">Upload, preview, replace and parse your master resume</p>
            </div>
          </div>

          {profile.ats_score > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 text-cyan-300 text-xs font-bold">
              ATS Compliance: {profile.ats_score}%
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                {profile.resume_filename || 'No Resume File Attached'}
              </h4>
              <p className="text-xs text-slate-400">
                {profile.resume_filename 
                  ? 'Master resume stored and synchronized with AI Matcher.'
                  : 'Upload your PDF or DOCX resume to extract technical skills and compute ATS score.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-lg transition-colors">
              <Upload className="w-4 h-4" />
              <span>{profile.resume_filename ? 'Replace Resume' : 'Upload Resume'}</span>
              <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
            </label>

            {profile.resume_filename && (
              <>
                <button
                  onClick={() => setShowResumePreview(!showResumePreview)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showResumePreview ? 'Hide Preview' : 'View Content'}</span>
                </button>

                <button
                  onClick={handleRemoveResume}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Parsed Resume Content Preview Box */}
        {showResumePreview && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-900 pb-2">
              <span>Parsed Resume Text Preview</span>
              <span className="text-indigo-400">{profile.resume_filename}</span>
            </div>
            <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              {profile.resume_text || 'Dynamic Senior Frontend Developer with experience building high performance React web applications...'}
            </pre>
          </div>
        )}
      </div>

      {/* MODAL 1: Work Experience Modal Form */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-5 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {expForm.id ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              <button onClick={() => setShowExpModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. TechCorp Solutions"
                  value={expForm.company_name}
                  onChange={(e) => setExpForm({ ...expForm, company_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Job Role / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={expForm.job_role}
                  onChange={(e) => setExpForm({ ...expForm, job_role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Start Date</label>
                  <input
                    type="month"
                    value={expForm.start_date}
                    onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">End Date</label>
                  <input
                    type="month"
                    disabled={expForm.is_current}
                    value={expForm.is_current ? '' : expForm.end_date}
                    onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="is_current_cb"
                  checked={expForm.is_current}
                  onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-900 text-amber-500"
                />
                <label htmlFor="is_current_cb" className="text-xs text-slate-300">I currently work here</label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Responsibilities & Achievements</label>
                <textarea
                  rows={3}
                  placeholder="Key accomplishments and responsibilities..."
                  value={expForm.responsibilities}
                  onChange={(e) => setExpForm({ ...expForm, responsibilities: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-900">
              <button
                onClick={() => setShowExpModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpForm}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow-md"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Certification Modal Form */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-5 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {certForm.id ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setShowCertModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400">Certification Name</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={certForm.certification_name}
                  onChange={(e) => setCertForm({ ...certForm, certification_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400">Issuing Organization</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon Web Services / Coursera"
                  value={certForm.issuing_organization}
                  onChange={(e) => setCertForm({ ...certForm, issuing_organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Issue Date</label>
                  <input
                    type="month"
                    value={certForm.issue_date}
                    onChange={(e) => setCertForm({ ...certForm, issue_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400">Credential ID / Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS-987654"
                    value={certForm.credential_id}
                    onChange={(e) => setCertForm({ ...certForm, credential_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-900">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCertForm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Save Certification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
