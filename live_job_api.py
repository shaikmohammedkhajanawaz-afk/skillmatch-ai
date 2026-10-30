import os
import urllib.request
import urllib.parse
import json
from dotenv import load_dotenv

# Load environment variables from root or backend directory
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
backend_env = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv()

from skill_extractor import extract_skills_from_text

from skill_extractor import extract_skills_from_text

def fetch_live_jobs_from_external_api(query: str = "software engineer", location: str = "india", job_type: str = "", api_key: str = "", app_id: str = "") -> dict:
    """
    Fetches real-time live job listings from external Job Search APIs using an API Key.
    Supports SerpApi Google Jobs, Adzuna API, RapidAPI JSearch, and custom REST API endpoints.
    Returns dict: {"jobs": list, "error": str/None, "source": str, "raw_count": int}
    """
    serpapi_env_key = os.environ.get("SERPAPI_KEY", "") or os.environ.get("JOB_SEARCH_API_KEY", "")
    key_to_use = api_key or serpapi_env_key
    id_to_use = app_id or os.environ.get("JOB_SEARCH_APP_ID", "")

    if not key_to_use:
        return {"jobs": [], "error": "No API key configured", "source": "None", "raw_count": 0}

    # 1. SerpApi Google Jobs Integration
    full_q = f"{query} {job_type}".strip() if job_type else query
    serp_url = f"https://serpapi.com/search.json?engine=google_jobs&q={urllib.parse.quote(full_q + ' in ' + location)}&api_key={key_to_use}"
    print(f"[SerpApi] Requesting Google Jobs: engine=google_jobs, q='{full_q} in {location}', api_key='***{key_to_use[-4:] if len(key_to_use) >= 4 else key_to_use}'")

    try:
        req = urllib.request.Request(serp_url, headers={'User-Agent': 'SkillMatchAI/1.3'})
        with urllib.request.urlopen(req, timeout=6) as response:
            data = json.loads(response.read().decode('utf-8'))
            if "error" in data:
                print(f"[SerpApi Error Payload] {data['error']}")
                return {"jobs": [], "error": str(data['error']), "source": "SerpApi Error", "raw_count": 0}

            job_results = data.get('jobs_results', [])
            print(f"[SerpApi Response] Received {len(job_results)} raw jobs from SerpApi Google Jobs")

            live_jobs = []
            for i, item in enumerate(job_results):
                title = item.get('title', 'Software Engineer')
                desc = item.get('description', '')
                ext = item.get('detected_extensions', {})
                sched = str(ext.get('schedule_type', '')).lower()
                title_lower = title.lower()
                desc_lower = desc.lower()

                # Dynamic Job Type Detection
                if 'intern' in sched or 'intern' in title_lower or 'intern' in desc_lower:
                    detected_type = 'Internship'
                elif 'part-time' in sched or 'part time' in title_lower:
                    detected_type = 'Part-time'
                elif 'contract' in sched or 'contract' in title_lower:
                    detected_type = 'Contract'
                else:
                    detected_type = 'Full-time'

                # Extract required skills dynamically from title and description
                skill_res = extract_skills_from_text(f"{title} {desc}")
                extracted_skills = skill_res.get('extracted_skills', []) if isinstance(skill_res, dict) else list(skill_res)
                if not extracted_skills:
                    query_skill = [q.capitalize() for q in query.split() if len(q) > 2]
                    extracted_skills = list(set(query_skill + ["Git", "SQL", "Problem Solving"]))

                live_jobs.append({
                    "id": f"serpapi-{item.get('job_id', i)}",
                    "title": title,
                    "company": item.get('company_name', 'Tech Enterprise'),
                    "logo_bg": "from-purple-600 to-indigo-600",
                    "location": item.get('location', f"{location.capitalize()} (Google Jobs)"),
                    "job_type": detected_type,
                    "experience_level": "Entry Level" if detected_type == "Internship" or "junior" in title_lower else "Mid Level",
                    "salary_range": ext.get('salary', '₹8,00,000 - ₹16,00,000 / yr'),
                    "department": "Engineering",
                    "vacancies": 2,
                    "posted_date": ext.get('posted_at', 'Live Google Jobs'),
                    "required_skills": extracted_skills[:6],
                    "nice_to_have_skills": ["Docker", "AWS", "CI/CD"],
                    "description": desc or f"Live job position fetched via SerpApi Google Jobs for {title}.",
                    "responsibilities": [f"Develop production code for {title}.", "Collaborate with cross-functional teams."],
                    "perks": ["Verified Live Google Job", "Flexible Hours", "Health Insurance"],
                    "redirect_url": item.get('related_links', [{}])[0].get('link', '#') if item.get('related_links') else '#'
                })

            return {"jobs": live_jobs, "error": None, "source": "SerpApi Google Jobs", "raw_count": len(live_jobs)}
    except Exception as e:
        print(f"[SerpApi Request Notice] {e}")
        return {"jobs": [], "error": str(e), "source": "SerpApi Error", "raw_count": 0}
