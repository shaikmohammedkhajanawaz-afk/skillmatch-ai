import os
import urllib.request
import urllib.parse
import urllib.error
import socket
import time
import json
from dotenv import load_dotenv
from skill_extractor import extract_skills_from_text

# Ensure environment variables are loaded
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
backend_env = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv()

def fetch_serpapi_google_jobs(query: str = "Software Engineer", location: str = "India", job_type: str = "") -> dict:
    """
    Fetches real-time live job listings from SerpApi Google Jobs engine (engine=google_jobs).
    Reads SERPAPI_KEY securely from server environment. Never writes or modifies SQLite DB.
    Implements 60s timeout, retry backoff, specific HTTP error handling, and job deduplication.
    """
    api_key = os.environ.get("SERPAPI_KEY", "") or os.environ.get("JOB_SEARCH_API_KEY", "")
    if not api_key:
        print("[SerpApi Live Service Warning] No SERPAPI_KEY found in server environment.")
        return {
            "jobs": [],
            "total_count": 0,
            "error": "No SERPAPI_KEY configured in server environment variables. Please add SERPAPI_KEY to your server .env file.",
            "source": "SerpApi Google Jobs"
        }

    clean_query = query.strip() or "Software Engineer"
    clean_location = location.strip() or "India"
    full_q = f"{clean_query} {job_type}".strip() if job_type else clean_query

    params = {
        "engine": "google_jobs",
        "q": full_q,
        "location": clean_location,
        "gl": "in",
        "hl": "en",
        "api_key": api_key
    }

    serp_url = f"https://serpapi.com/search.json?{urllib.parse.urlencode(params)}"
    print(f"[SerpApi Live Service] Querying engine=google_jobs for q='{full_q}', location='{clean_location}' (timeout=60s)...")

    max_retries = 2
    attempt = 0
    data = None
    last_error_msg = ""

    while attempt <= max_retries:
        attempt += 1
        try:
            req = urllib.request.Request(serp_url, headers={'User-Agent': 'SkillMatchAI/1.4 (GoogleJobs/Live)'})
            # Increased read timeout to 60 seconds
            with urllib.request.urlopen(req, timeout=60) as response:
                raw_bytes = response.read()
                data = json.loads(raw_bytes.decode('utf-8'))
                print(f"[SerpApi Live Service] Response received successfully on attempt {attempt}.")
                break
        except urllib.error.HTTPError as http_err:
            code = http_err.code
            print(f"[SerpApi HTTPError {code}] Attempt {attempt} failed: {http_err.reason}")
            if code in (401, 403):
                last_error_msg = "Invalid or unauthorized SerpApi key. Please check your SERPAPI_KEY in server .env."
                break
            elif code == 429:
                last_error_msg = "SerpApi search rate limit or monthly quota exceeded."
                break
            elif code in (500, 502, 503, 504):
                last_error_msg = f"SerpApi Google Jobs server temporary error (HTTP {code})."
            else:
                last_error_msg = f"SerpApi returned HTTP status code {code}."

        except (socket.timeout, urllib.error.URLError) as net_err:
            print(f"[SerpApi Timeout/URLError] Attempt {attempt} failed: {str(net_err)}")
            last_error_msg = "Live Search API connection timed out. SerpApi engine took longer than expected to respond."

        except Exception as e:
            print(f"[SerpApi Exception] Attempt {attempt} error: {str(e)}")
            last_error_msg = f"Live Search API Exception: {str(e)}"

        if attempt <= max_retries:
            print(f"[SerpApi Retrying] Sleeping 1.5s before retry attempt {attempt + 1}/{max_retries + 1}...")
            time.sleep(1.5)

    if not data:
        print(f"[SerpApi Live Service Failure] All {attempt} attempts failed. Returning empty live list.")
        return {
            "jobs": [],
            "total_count": 0,
            "error": last_error_msg or "Live Search temporarily unavailable. Please try again.",
            "source": "SerpApi Google Jobs"
        }

    if "error" in data:
        err_text = data.get("error", "Unknown API error")
        print(f"[SerpApi API Error Payload] {err_text}")
        return {
            "jobs": [],
            "total_count": 0,
            "error": f"SerpApi Error: {err_text}",
            "source": "SerpApi Google Jobs"
        }

    job_results = data.get('jobs_results', [])
    print(f"[SerpApi Live Service Success] Retrieved {len(job_results)} raw Google Jobs.")

    live_jobs = []
    seen_ids = set()

    for i, item in enumerate(job_results):
        job_id = str(item.get('job_id', f"idx-{i}"))
        if job_id in seen_ids:
            continue
        seen_ids.add(job_id)

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
            query_words = [q.capitalize() for q in clean_query.split() if len(q) > 2]
            extracted_skills = list(set(query_words + ["Git", "SQL", "Problem Solving"]))

        # Get redirect / apply URL
        related_links = item.get('related_links', [])
        apply_url = "#"
        if related_links and isinstance(related_links, list) and len(related_links) > 0:
            apply_url = related_links[0].get('link', '#')
        elif item.get('share_link'):
            apply_url = item.get('share_link')

        live_jobs.append({
            "id": f"serpapi-{job_id}",
            "title": title,
            "company": item.get('company_name', 'Tech Enterprise'),
            "logo_bg": "from-purple-600 to-indigo-600",
            "location": item.get('location', f"{clean_location.capitalize()} (Google Jobs)"),
            "job_type": detected_type,
            "experience_level": "Entry Level" if detected_type == "Internship" or "junior" in title_lower else "Mid Level",
            "salary_range": ext.get('salary', 'Salary Competitive / Market Rate'),
            "department": "Engineering",
            "vacancies": 1,
            "posted_date": ext.get('posted_at', 'Live Google Job'),
            "required_skills": extracted_skills[:6],
            "nice_to_have_skills": ["Cloud", "Git", "Problem Solving"],
            "description": desc or f"Live Google Job opportunity for {title} at {item.get('company_name', 'Enterprise')}.",
            "responsibilities": [
                f"Perform core engineering and development tasks for {title}.",
                "Collaborate with technology team and stakeholder groups."
            ],
            "perks": ["Verified Live Google Job", "Remote / Hybrid Flexible"],
            "redirect_url": apply_url,
            "is_live_api": True,
            "is_live": True
        })

    return {
        "jobs": live_jobs,
        "total_count": len(live_jobs),
        "error": None if live_jobs else "No live Google jobs found matching your current query. Try broader keywords or location.",
        "source": "SerpApi Google Jobs"
    }
