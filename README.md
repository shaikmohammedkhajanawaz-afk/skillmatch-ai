# Skill Match AI – Smart Job Finder

Skill Match AI is a full-stack, AI-powered job-search and career assistance platform designed to empower students and job seekers. The system provides user authentication, AI resume analysis, ATS compliance scoring, skill extraction, smart job matching, interactive resume building, and personalized skill-gap learning roadmaps in a single platform.

---

## 🚀 Key Features

1. **AI Resume Analysis & Skill Extraction**:
   - Accepts resume files (PDF, DOCX, TXT) and direct raw text input.
   - Calculates a 0–100% ATS (Applicant Tracking System) Quality Score.
   - Automatically categorizes technical and soft skills (Programming Languages, Frontend, Backend, Cloud & DevOps, AI/ML, Databases, Soft Skills).
   - Identifies structural strengths and provides actionable ATS optimization recommendations.

2. **Interactive Resume Builder**:
   - Step-by-step wizard for Personal Details, Professional Summary, Work History, Education, and Skills.
   - 4 Customizable Templates: *Modern Tech*, *Executive Slate*, *Creative Glass*, and *Minimalist Classic*.
   - Real-time live document preview and instant PDF export/print capability.

3. **Smart Job Recommendation Engine**:
   - Ranks 50+ tech job listings by compatibility score using Cosine Similarity (TF-IDF) + Jaccard skill overlap.
   - Highlights matched skills vs missing skills directly on each job card.
   - Search by job title, company, or tech keyword with multi-parameter filtering (Full-time, Remote, Hybrid, Internship).

4. **Skill-Gap Analysis & Learning Roadmap**:
   - Audits candidate skills against target job requirements.
   - Displays candidate readiness level (*High Readiness*, *Moderate Readiness*, *Development Needed*).
   - Provides a curated learning roadmap featuring course titles, providers (Udemy, Coursera, Meta, AWS), estimated completion time, and direct tutorial links.

5. **User Authentication & Dashboard**:
   - Integrated Clerk Authentication with zero-friction 1-click candidate demo profiles (*Alex Rivera - Frontend Dev*, *Dr. Marcus Vance - AI Engineer*, *Sophia Patel - Data Analyst*).
   - Personal Dashboard for managing saved job bookmarks, application status tracking (*Applied*, *Interviewing*, *Offered*), and extracted skill inventory.

---

## 🛠️ Project Structure

```
skill-match-ai/
├── backend/                  # Python Flask REST API
│   ├── app.py                # Main Flask API endpoints
│   ├── resume_parser.py      # ATS parser & document text extractor
│   ├── job_matcher.py        # TF-IDF & Jaccard skill similarity matcher
│   ├── skill_extractor.py    # 500+ skill NLP taxonomy matcher
│   ├── dataset.py            # 50+ realistic job listings dataset
│   ├── db.py                 # SQLite database helper
│   ├── skillmatch.db         # Persistent SQLite database
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React 18 + Vite Web Client
│   ├── package.json          # Dependencies & build scripts
│   ├── vite.config.js        # Vite configuration & API proxy
│   ├── tailwind.config.js    # Tailwind CSS styling configuration
│   ├── postcss.config.js     # PostCSS configuration
│   ├── index.html            # Main HTML document with Google Fonts
│   └── src/
│       ├── main.jsx          # React DOM entry point
│       ├── App.jsx           # Main router & state manager
│       ├── index.css         # Tailwind & Glassmorphism custom CSS
│       ├── services/
        │   └── api.js        # Axios REST API client
│       ├── context/
│           └── AuthContext.jsx # Auth & Candidate Profile Context
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           ├── Hero.jsx
│           ├── AuthModal.jsx
│           ├── ResumeAnalyzer.jsx
│           ├── ResumeBuilder.jsx
│           ├── JobSearch.jsx
│           ├── JobCard.jsx
│           ├── JobDetailModal.jsx
│           ├── SkillGapAnalyzer.jsx
│           ├── Dashboard.jsx
│           └── ResumeTemplates/
│               ├── ModernTechTemplate.jsx
│               ├── ExecutiveTemplate.jsx
│               ├── CreativeTemplate.jsx
│               └── ClassicTemplate.jsx
└── README.md
```

---

## 💻 Installation & Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js v18+ and npm

### 1. Run Backend Server (Python Flask)
```powershell
cd backend
python -m pip install -r requirements.txt
python app.py
```
*(Runs on `http://127.0.0.1:5000`)*

### 2. Run Frontend Server (React + Vite)
```powershell
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```
*(Runs on `http://127.0.0.1:3000`)*

---

## 🌐 License
Licensed under the MIT License.
