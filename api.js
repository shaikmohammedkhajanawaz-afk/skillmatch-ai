import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Check API health
  checkHealth: async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      return res.data;
    } catch (err) {
      console.error('Health check failed', err);
      return { status: 'offline' };
    }
  },

  // ================= PRACTICE EXAMINATION METHODS =================
  generatePracticeExam: async (skills = [], examMode = 'full', difficulty = 'medium') => {
    const res = await axios.post(`${API_BASE}/practice-exam/generate`, {
      user_skills: skills,
      exam_mode: examMode,
      difficulty: difficulty
    });
    return res.data;
  },

  submitPracticeExam: async (payload) => {
    const res = await axios.post(`${API_BASE}/practice-exam/submit`, payload);
    return res.data;
  },

  runExamCode: async (language, code, problemId) => {
    const res = await axios.post(`${API_BASE}/practice-exam/run-code`, {
      language,
      code,
      problem_id: problemId
    });
    return res.data;
  },

  getPracticeExamHistory: async (userId = 'demo_user') => {
    const res = await axios.get(`${API_BASE}/practice-exam/history`, { params: { user_id: userId } });
    return res.data;
  },

  // Analyze uploaded resume file (PDF/DOCX/TXT) or raw text
  analyzeResume: async (fileOrText) => {
    if (fileOrText instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrText);
      const res = await axios.post(`${API_BASE}/analyze-resume`, formData);
      return res.data;
    } else {
      const res = await axios.post(`${API_BASE}/analyze-resume`, { resume_text: fileOrText });
      return res.data;
    }
  },

  parseResumeFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`${API_BASE}/analyze-resume`, formData);
    return res.data;
  },

  analyzeResumeText: async (pastedText) => {
    const res = await axios.post(`${API_BASE}/analyze-resume`, { resume_text: pastedText });
    return res.data;
  },

  // Extract skills from string
  extractSkills: async (text) => {
    const res = await axios.post(`${API_BASE}/extract-skills`, { text });
    return res.data;
  },

  // Fetch jobs list with optional query params
  getJobs: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/jobs`, { params });
    return res.data;
  },

  // Trigger daily job refresh sync
  refreshDailyJobs: async () => {
    const res = await axios.post(`${API_BASE}/jobs/refresh-daily`);
    return res.data;
  },

  // Dedicated SerpApi Google Jobs Live Search (reads SERPAPI_KEY on backend)
  searchLiveSerpApiJobs: async (query = 'Software Engineer', location = 'India', jobType = '', userSkills = []) => {
    const res = await axios.post(`${API_BASE}/live-jobs`, {
      query,
      location,
      job_type: jobType,
      user_skills: userSkills
    });
    return res.data;
  },

  // Search live jobs with API Key (SerpApi Google Jobs / Adzuna / RapidAPI JSearch / Custom)
  searchJobsWithApiKey: async (payloadOrKey, appId = '', query = 'software engineer', location = 'india') => {
    let payload = {};
    if (typeof payloadOrKey === 'object' && payloadOrKey !== null) {
      payload = payloadOrKey;
    } else {
      payload = {
        api_key: payloadOrKey,
        app_id: appId,
        query: query,
        location: location
      };
    }
    const res = await axios.post(`${API_BASE}/jobs/search-api`, payload);
    return res.data;
  },

  // Get job details by ID
  getJobDetail: async (jobId) => {
    const res = await axios.get(`${API_BASE}/jobs/${jobId}`);
    return res.data;
  },

  // Match jobs against user skills
  matchJobs: async (skills = [], userText = '') => {
    const res = await axios.post(`${API_BASE}/match-jobs`, { skills, user_text: userText });
    return res.data;
  },

  // Get skill gap analysis & learning roadmap for job
  getSkillGap: async (jobId, skills = []) => {
    const res = await axios.post(`${API_BASE}/skill-gap`, { job_id: jobId, skills });
    return res.data;
  },

  // Send AI Chatbot Message
  sendChatMessage: async (message, skills = [], targetRole = '', history = []) => {
    const res = await axios.post(`${API_BASE}/chatbot`, { message, skills, target_role: targetRole, history });
    return res.data;
  },

  // Generate Portfolio HTML Website Code
  generatePortfolio: async (userData, templateStyle = 'modern_tech') => {
    const res = await axios.post(`${API_BASE}/portfolio/generate`, { user_data: userData, template_style: templateStyle });
    return res.data;
  },

  // Get saved jobs for user
  getSavedJobs: async (userId = 'demo_user') => {
    const res = await axios.get(`${API_BASE}/saved-jobs`, { params: { user_id: userId } });
    return res.data;
  },

  // Toggle save job bookmark
  toggleSaveJob: async (jobId, userId = 'demo_user') => {
    const res = await axios.post(`${API_BASE}/saved-jobs/toggle`, { user_id: userId, job_id: jobId });
    return res.data;
  },

  // Get user applications
  getApplications: async (userId = 'demo_user') => {
    const res = await axios.get(`${API_BASE}/applications`, { params: { user_id: userId } });
    return res.data;
  },

  // Submit job application
  submitApplication: async (payload) => {
    const res = await axios.post(`${API_BASE}/applications`, payload);
    return res.data;
  },

  // Save / update user profile
  saveProfile: async (profileData) => {
    const res = await axios.post(`${API_BASE}/profile`, profileData);
    return res.data;
  },

  // Get profile
  getProfile: async (userId = 'demo_user') => {
    const res = await axios.get(`${API_BASE}/profile/${userId}`);
    return res.data;
  },

  // Upload profile photo
  uploadProfilePhoto: async (fileOrBase64, userId = 'demo_user') => {
    if (fileOrBase64 instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrBase64);
      formData.append('user_id', userId);
      const res = await axios.post(`${API_BASE}/profile/upload-photo`, formData);
      return res.data;
    } else {
      const res = await axios.post(`${API_BASE}/profile/upload-photo`, { user_id: userId, photo_url: fileOrBase64 });
      return res.data;
    }
  },

  // Upload profile resume
  uploadProfileResume: async (file, userId = 'demo_user') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    const res = await axios.post(`${API_BASE}/profile/upload-resume`, formData);
    return res.data;
  },

  // Start AI Interview Mode
  startAIInterview: async (userId = 'demo_user', targetRole = 'Software Engineer', profileData = {}) => {
    const res = await axios.post(`${API_BASE}/interview/start`, { user_id: userId, target_role: targetRole, profile: profileData });
    return res.data;
  },

  // Evaluate single turn in AI Interview
  evaluateInterviewTurn: async (question, candidateAnswer, targetRole = 'Software Engineer') => {
    const res = await axios.post(`${API_BASE}/interview/turn`, { question, candidate_answer: candidateAnswer, target_role: targetRole });
    return res.data;
  }
};
