import re
import math
from collections import Counter
from skill_extractor import extract_skills_from_text

# Comprehensive Curated Learning Resources Map for missing skills
LEARNING_RESOURCES = {
    "React": {"course": "React - The Complete Guide (incl Hooks & Redux)", "provider": "Udemy / Meta", "time": "48 hrs", "level": "Intermediate", "link": "https://react.dev/learn", "free": True},
    "Python": {"course": "CS50's Introduction to Programming with Python", "provider": "Harvard / edX", "time": "30 hrs", "level": "Beginner", "link": "https://cs50.harvard.edu/python", "free": True},
    "Docker": {"course": "Docker Mastery: with Kubernetes & Swarm", "provider": "Udemy", "time": "21 hrs", "level": "Intermediate", "link": "https://docs.docker.com/get-started/", "free": False},
    "AWS": {"course": "AWS Certified Solutions Architect Associate", "provider": "Coursera / AWS", "time": "35 hrs", "level": "Advanced", "link": "https://aws.amazon.com/training/", "free": False},
    "Node.js": {"course": "Node.js, Express, MongoDB & More: Complete Bootcamp", "provider": "Udemy", "time": "40 hrs", "level": "Intermediate", "link": "https://nodejs.org/en/docs/", "free": True},
    "TypeScript": {"course": "Understanding TypeScript - 2026 Edition", "provider": "Udemy / TS Docs", "time": "15 hrs", "level": "Intermediate", "link": "https://www.typescriptlang.org/docs/", "free": True},
    "Machine Learning": {"course": "Machine Learning Specialization by Andrew Ng", "provider": "Coursera (DeepLearning.AI)", "time": "60 hrs", "level": "Intermediate", "link": "https://www.coursera.org/specializations/machine-learning-introduction", "free": True},
    "Deep Learning": {"course": "Deep Learning Specialization", "provider": "Coursera (DeepLearning.AI)", "time": "50 hrs", "level": "Advanced", "link": "https://www.coursera.org/specializations/deep-learning", "free": True},
    "SQL": {"course": "The Complete SQL Bootcamp (PostgreSQL / MySQL)", "provider": "Udemy", "time": "12 hrs", "level": "Beginner", "link": "https://www.postgresql.org/docs/", "free": True},
    "PostgreSQL": {"course": "PostgreSQL Masterclass for Software Engineers", "provider": "PostgreSQL Tutorial", "time": "15 hrs", "level": "Intermediate", "link": "https://www.postgresqltutorial.com/", "free": True},
    "MongoDB": {"course": "MongoDB University Developer Certification Path", "provider": "MongoDB", "time": "10 hrs", "level": "Beginner", "link": "https://university.mongodb.com/", "free": True},
    "Kubernetes": {"course": "Certified Kubernetes Administrator (CKA) Prep", "provider": "Linux Foundation", "time": "25 hrs", "level": "Advanced", "link": "https://kubernetes.io/docs/tutorials/", "free": True},
    "Tailwind CSS": {"course": "Tailwind CSS From Scratch to Production", "provider": "Tailwind Docs", "time": "6 hrs", "level": "Beginner", "link": "https://tailwindcss.com/docs", "free": True},
    "Tailwind": {"course": "Tailwind CSS From Scratch to Production", "provider": "Tailwind Docs", "time": "6 hrs", "level": "Beginner", "link": "https://tailwindcss.com/docs", "free": True},
    "GraphQL": {"course": "GraphQL Full Course with Apollo Client", "provider": "Apollo GraphQL", "time": "10 hrs", "level": "Intermediate", "link": "https://graphql.org/learn/", "free": True},
    "Figma": {"course": "UI/UX Design Essentials in Figma", "provider": "Coursera / Figma", "time": "15 hrs", "level": "Beginner", "link": "https://help.figma.com/hc/en-us", "free": True},
    "Django": {"course": "Python Django - Complete Web Developer Course", "provider": "Udemy", "time": "25 hrs", "level": "Intermediate", "link": "https://docs.djangoproject.com/", "free": True},
    "FastAPI": {"course": "FastAPI Web Development Masterclass", "provider": "FreeCodeCamp", "time": "8 hrs", "level": "Intermediate", "link": "https://fastapi.tiangolo.com/tutorial/", "free": True},
    "PyTorch": {"course": "Practical Deep Learning for Coders with PyTorch", "provider": "Fast.ai", "time": "50 hrs", "level": "Advanced", "link": "https://fast.ai", "free": True},
    "TensorFlow": {"course": "TensorFlow Developer Professional Certificate", "provider": "Coursera / Google", "time": "35 hrs", "level": "Intermediate", "link": "https://www.tensorflow.org/learn", "free": True},
    "Next.js": {"course": "Next.js 14+ Full Stack Masterclass", "provider": "FreeCodeCamp / Vercel", "time": "16 hrs", "level": "Intermediate", "link": "https://nextjs.org/learn", "free": True},
    "Git": {"course": "Git & GitHub Crash Course for Beginners", "provider": "FreeCodeCamp", "time": "4 hrs", "level": "Beginner", "link": "https://freecodecamp.org", "free": True},
    "Data Analysis": {"course": "Google Data Analytics Professional Certificate", "provider": "Coursera / Google", "time": "80 hrs", "level": "Beginner", "link": "https://coursera.org", "free": True},
    "Tableau": {"course": "Tableau 2026 A-Z: Hands-On Tableau Training", "provider": "Udemy", "time": "10 hrs", "level": "Beginner", "link": "https://tableau.com", "free": False},
    "PowerBI": {"course": "Microsoft Power BI Desktop Masterclass", "provider": "Udemy", "time": "12 hrs", "level": "Beginner", "link": "https://powerbi.microsoft.com", "free": False},
    "Cybersecurity": {"course": "Google Cybersecurity Professional Certificate", "provider": "Coursera / Google", "time": "70 hrs", "level": "Beginner", "link": "https://coursera.org", "free": True},
    "Penetration Testing": {"course": "Ethical Hacking & Penetration Testing Course", "provider": "FreeCodeCamp", "time": "15 hrs", "level": "Intermediate", "link": "https://youtube.com", "free": True},
    "Product Management": {"course": "Become a Product Manager", "provider": "Udemy / Reforge", "time": "20 hrs", "level": "Intermediate", "link": "https://udemy.com", "free": False},
    "Cypress": {"course": "Cypress End-to-End Automation Testing", "provider": "Udemy", "time": "10 hrs", "level": "Intermediate", "link": "https://docs.cypress.io", "free": True},
    "Selenium": {"course": "Selenium WebDriver with Python / Java", "provider": "Udemy", "time": "16 hrs", "level": "Intermediate", "link": "https://selenium.dev", "free": True}
}

def tokenize(text: str) -> list:
    """Tokenize and normalize text into lowercase alphanumeric words."""
    return re.findall(r'\b[a-z0-9\+\#\.\-]{2,}\b', text.lower())

def pure_cosine_similarity(text1: str, text2: str) -> float:
    """Pure Python Cosine Similarity over term frequency vectors."""
    words1 = tokenize(text1)
    words2 = tokenize(text2)

    if not words1 or not words2:
        return 0.0

    tf1 = Counter(words1)
    tf2 = Counter(words2)

    all_vocab = set(tf1.keys()).union(set(tf2.keys()))

    dot_product = sum(tf1[word] * tf2[word] for word in all_vocab)
    mag1 = math.sqrt(sum(v**2 for v in tf1.values()))
    mag2 = math.sqrt(sum(v**2 for v in tf2.values()))

    if mag1 == 0 or mag2 == 0:
        return 0.0

    return dot_product / (mag1 * mag2)

def calculate_job_match(user_skills: list, job: dict, user_text: str = "") -> dict:
    """
    Computes candidate job compatibility score (0-100%), matching skills, and missing skills.
    """
    user_skills_lower = set([s.lower() for s in user_skills])

    req_skills = job.get("required_skills", [])
    nice_skills = job.get("nice_to_have_skills", [])

    req_skills_lower = [s.lower() for s in req_skills]
    nice_skills_lower = [s.lower() for s in nice_skills]

    # Matched & Missing Required Skills
    matched_req = [s for s in req_skills if s.lower() in user_skills_lower]
    missing_req = [s for s in req_skills if s.lower() not in user_skills_lower]

    # Matched Nice-to-have Skills
    matched_nice = [s for s in nice_skills if s.lower() in user_skills_lower]

    # Calculate Skill Overlap Score (0-100)
    req_count = max(len(req_skills), 1)
    req_match_ratio = len(matched_req) / req_count
    nice_match_ratio = (len(matched_nice) / max(len(nice_skills), 1)) if nice_skills else 0.5

    skill_overlap_score = (req_match_ratio * 75) + (nice_match_ratio * 25)

    # Cosine Similarity on job description vs candidate text/skills
    job_full_text = f"{job.get('title', '')} {job.get('description', '')} {' '.join(req_skills)}"
    cand_full_text = f"{' '.join(user_skills)} {user_text}"

    text_similarity = pure_cosine_similarity(job_full_text, cand_full_text)
    text_score = text_similarity * 100

    # Final Combined Match Score (70% skill overlap + 30% text similarity)
    final_score = (skill_overlap_score * 0.70) + (text_score * 0.30)

    # Boost score slightly if applicant has all required skills
    if len(missing_req) == 0 and len(req_skills) > 0:
        final_score = max(final_score, 88.0)

    final_score = int(round(max(15, min(99, final_score))))

    result = dict(job)
    result.update({
        "job_id": job.get("id"),
        "match_score": final_score,
        "matched_skills": matched_req + matched_nice,
        "missing_required_skills": missing_req,
        "missing_nice_skills": [s for s in nice_skills if s.lower() not in user_skills_lower],
        "total_required_count": len(req_skills),
        "matched_required_count": len(matched_req)
    })
    return result

def generate_skill_gap_analysis(user_skills: list, job: dict) -> dict:
    """
    Detailed skill gap analysis for a specific job against user skills.
    Provides learning roadmap and course recommendations.
    """
    match_data = calculate_job_match(user_skills, job)
    missing_skills = match_data["missing_required_skills"] + match_data["missing_nice_skills"]

    learning_roadmap = []
    for skill in missing_skills:
        resource = None
        for k, v in LEARNING_RESOURCES.items():
            if k.lower() in skill.lower() or skill.lower() in k.lower():
                resource = v
                break

        if not resource:
            resource = {
                "course": f"Mastering {skill} Complete Crash Course",
                "provider": "Online Learning Platform / Documentation",
                "time": "10-15 hrs",
                "level": "Intermediate",
                "link": f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}+tutorial",
                "free": True
            }

        learning_roadmap.append({
            "skill": skill,
            "priority": "High" if skill in match_data["missing_required_skills"] else "Medium",
            "course": resource["course"],
            "provider": resource["provider"],
            "estimated_time": resource["time"],
            "level": resource.get("level", "Intermediate"),
            "resource_link": resource["link"],
            "free": resource.get("free", True)
        })

    readiness_level = "High Readiness" if match_data["match_score"] >= 80 else ("Moderate Readiness" if match_data["match_score"] >= 55 else "Development Needed")

    return {
        "job_title": job.get("title"),
        "company": job.get("company"),
        "match_score": match_data["match_score"],
        "readiness_level": readiness_level,
        "matched_skills": match_data["matched_skills"],
        "missing_skills": missing_skills,
        "learning_roadmap": learning_roadmap,
        "advice": f"Acquiring the {len(missing_skills)} missing skill(s) can boost your application match score up to 95%+ for this role."
    }
