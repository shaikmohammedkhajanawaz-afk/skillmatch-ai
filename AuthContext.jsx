import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEMO_PROFILES = [
  {
    id: 'demo_frontend',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git', 'Next.js', 'Redux'],
    ats_score: 84
  },
  {
    id: 'demo_ai',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@example.com',
    role: 'AI / ML Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-Learn', 'NLP', 'Machine Learning', 'Pandas', 'NumPy', 'Docker'],
    ats_score: 92
  },
  {
    id: 'demo_data',
    name: 'Sophia Patel',
    email: 'sophia.patel@example.com',
    role: 'Data Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Data Analysis', 'Statistics', 'PowerBI'],
    ats_score: 79
  }
];

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillmatch_user');
    return saved ? JSON.parse(saved) : DEMO_PROFILES[0];
  });

  const [userSkills, setUserSkills] = useState(user?.skills || []);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync Clerk authenticated profile into active candidate user state
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const clerkProfile = {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'Clerk User',
        email: clerkUser.primaryEmailAddress?.emailAddress || 'candidate@example.com',
        role: 'Candidate',
        avatar: clerkUser.imageUrl || DEMO_PROFILES[0].avatar,
        skills: userSkills.length > 0 ? userSkills : DEMO_PROFILES[0].skills,
        ats_score: 88,
        isClerk: true
      };
      setUser(clerkProfile);
      localStorage.setItem('skillmatch_user', JSON.stringify(clerkProfile));
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('skillmatch_user', JSON.stringify(user));
      setUserSkills(user.skills || []);
      fetchUserData(user.id);
    }
  }, [user?.id]);

  const fetchUserData = async (userId) => {
    try {
      const dbProfile = await api.getProfile(userId);
      if (dbProfile && dbProfile.user_id) {
        const skillsList = dbProfile.technical_skills || dbProfile.extracted_skills || dbProfile.skills || [];
        setUser(prev => ({
          ...prev,
          ...dbProfile,
          name: dbProfile.full_name || prev?.name || 'Candidate',
          avatar: dbProfile.photo_url || prev?.avatar || '',
          role: dbProfile.desired_job_role || dbProfile.target_role || prev?.role || 'Candidate',
          skills: skillsList
        }));
        if (skillsList.length > 0) {
          setUserSkills(skillsList);
        }
      }

      const savedRes = await api.getSavedJobs(userId);
      setSavedJobIds(savedRes.saved_ids || []);

      const appRes = await api.getApplications(userId);
      setApplications(appRes.applications || []);
    } catch (err) {
      console.warn('Could not load user data from backend', err);
    }
  };

  const loginAsDemo = (profileId) => {
    const selected = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];
    setUser(selected);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    if (isSignedIn) {
      try {
        clerkSignOut();
      } catch (err) {
        console.warn('Clerk signout warning', err);
      }
    }
    setUser(null);
    setUserSkills([]);
    localStorage.removeItem('skillmatch_user');
  };

  const updateUserSkills = (newSkills) => {
    const unique = Array.from(new Set(newSkills));
    setUserSkills(unique);
    if (user) {
      const updated = { ...user, skills: unique };
      setUser(updated);
      api.saveProfile({
        user_id: user.id,
        full_name: user.name,
        email: user.email,
        target_role: user.role,
        extracted_skills: unique,
        ats_score: user.ats_score || 80
      });
    }
  };

  const toggleSaveJob = async (jobId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.toggleSaveJob(jobId, user.id);
      if (res.is_saved) {
        setSavedJobIds(prev => [...prev, jobId]);
      } else {
        setSavedJobIds(prev => prev.filter(id => id !== jobId));
      }
    } catch (err) {
      console.error('Failed to toggle save job', err);
    }
  };

  const addApplication = (appData) => {
    setApplications(prev => [appData, ...prev]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userSkills,
      savedJobIds,
      applications,
      isAuthModalOpen,
      setIsAuthModalOpen,
      loginAsDemo,
      logout,
      updateUserSkills,
      toggleSaveJob,
      addApplication,
      demoProfiles: DEMO_PROFILES,
      isSignedIn,
      clerkUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
