import os
import json
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
root_env = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
backend_env = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(root_env):
    load_dotenv(root_env)
elif os.path.exists(backend_env):
    load_dotenv(backend_env)
else:
    load_dotenv()

from skill_extractor import extract_skills_from_text, SKILL_TAXONOMY
from resume_parser import extract_text_from_file, analyze_resume_content
from dataset import get_all_jobs, get_job_by_id, trigger_daily_job_refresh
from live_job_api import fetch_live_jobs_from_external_api
from job_matcher import calculate_job_match, generate_skill_gap_analysis
from ai_chatbot import generate_chatbot_response
from portfolio_generator import generate_portfolio_html
from practice_exam import (
    generate_practice_exam, 
    evaluate_practice_exam, 
    run_code_test_cases,
    generate_ai_interview_questions,
    evaluate_interview_turn
)
import db

app = Flask("skill_match_backend")
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# Initialize Database
db.init_db()

USER_PROFILES = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "service": "Skill Match AI Backend API",
        "version": "1.4.0"
    })

# ================= PRACTICE EXAMINATION ROUTES =================

@app.route('/api/practice-exam/generate', methods=['POST'])
def generate_exam_endpoint():
    data = request.get_json() or {}
    user_skills = data.get('user_skills', ['Python', 'JavaScript', 'SQL', 'React'])
    exam_mode = data.get('exam_mode', 'full')
    difficulty = data.get('difficulty', 'medium')

    exam = generate_practice_exam(user_skills=user_skills, exam_mode=exam_mode, difficulty=difficulty)
    return jsonify(exam)

@app.route('/api/practice-exam/run-code', methods=['POST'])
def run_code_endpoint():
    data = request.get_json() or {}
    language = data.get('language', 'Python')
    code = data.get('code', '')
    problem_id = data.get('problem_id', 'code_py_1')

    res = run_code_test_cases(language, code, problem_id)
    return jsonify(res)

@app.route('/api/practice-exam/submit', methods=['POST'])
def submit_exam_endpoint():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'demo_user')
    mode = data.get('exam_mode', 'full')
    difficulty = data.get('difficulty', 'medium')

    report = evaluate_practice_exam(data)

    # Save attempt in database for progress tracking
    attempt_id = db.save_exam_attempt(
        user_id=user_id,
        mode=mode,
        difficulty=difficulty,
        overall=report['overall_score'],
        apt=report['aptitude_score'],
        reas=report['reasoning_score'],
        tech=report['technical_score'],
        code=report['coding_score'],
        accuracy=report['accuracy'],
        attempted=report['questions_attempted'],
        correct=report['questions_correct'],
        strong_skills=report['strong_skills'],
        weak_skills=report['weak_skills']
    )

    report['attempt_id'] = attempt_id
    return jsonify(report)

@app.route('/api/practice-exam/history', methods=['GET'])
def get_exam_history_endpoint():
    user_id = request.args.get('user_id', 'demo_user')
    attempts = db.get_user_exam_attempts(user_id)
    return jsonify({"attempts": attempts})

@app.route('/api/interview/start', methods=['POST'])
def start_interview_endpoint():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'demo_user')
    target_role = data.get('target_role', 'Software Engineer')
    user_profile = db.get_user_profile(user_id) or data.get('profile', {})

    result = generate_ai_interview_questions(profile_data=user_profile, target_role=target_role)
    return jsonify(result)

@app.route('/api/interview/turn', methods=['POST'])
def evaluate_interview_turn_endpoint():
    data = request.get_json() or {}
    question = data.get('question', '')
    candidate_answer = data.get('candidate_answer') or data.get('answer', '')
    target_role = data.get('target_role', 'Software Engineer')

    evaluation = evaluate_interview_turn(question, candidate_answer, target_role=target_role)
    return jsonify(evaluation)

# ================= RESUME & MATCHING ROUTES =================

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    resume_text = ""

    if 'file' in request.files:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            try:
                file_bytes = uploaded_file.read()
                resume_text = extract_text_from_file(file_bytes, uploaded_file.filename)
            except Exception as e:
                return jsonify({"error": f"Failed to parse uploaded file: {str(e)}"}), 400

    if not resume_text and request.is_json:
        data = request.get_json() or {}
        resume_text = data.get('resume_text', '')

    if not resume_text.strip():
        return jsonify({"error": "No resume file or text provided."}), 400

    analysis_result = analyze_resume_content(resume_text)
    return jsonify(analysis_result)

@app.route('/api/extract-skills', methods=['POST'])
def api_extract_skills():
    """
    Extract skills strictly explicitly mentioned in the provided resume text.
    No inferences, no assumed skills, no recommended skills.
    If no skills are found, returns an empty list.
    """
    data = request.get_json() or {}
    text = data.get('text') or data.get('resume_text', '')
    if not text.strip():
        return jsonify({
            "extracted_skills": [],
            "all_skills": [],
            "skills_by_category": {},
            "by_category": {},
            "total_count": 0
        })
    extracted_data = extract_skills_from_text(text)
    return jsonify(extracted_data)

from serpapi_service import fetch_serpapi_google_jobs

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    jobs = get_all_jobs()
    return jsonify({"jobs": jobs, "total_count": len(jobs)})

@app.route('/api/live-jobs', methods=['POST'])
def search_live_serpapi_jobs():
    """
    Dedicated endpoint for real-time SerpApi Google Jobs live search.
    Does NOT modify, replace, or touch SQLite database or local jobs feed.
    """
    data = request.get_json() or {}
    query = data.get('query', 'Software Engineer')
    location = data.get('location', 'India')
    job_type = data.get('job_type', '')
    user_skills = data.get('user_skills') or data.get('skills', [])

    # Fetch live jobs from SerpApi Google Jobs service
    result = fetch_serpapi_google_jobs(query=query, location=location, job_type=job_type)
    live_jobs = result.get('jobs', [])

    # Apply candidate skill matching dynamically to live jobs (without DB modification)
    matched_live_jobs = []
    for j in live_jobs:
        match_info = calculate_job_match(user_skills, j)
        j['match_score'] = match_info.get('match_score', 0)
        j['matched_skills'] = match_info.get('matched_skills', [])
        j['missing_skills'] = match_info.get('missing_skills', [])
        matched_live_jobs.append(j)

    matched_live_jobs.sort(key=lambda x: x.get('match_score', 0), reverse=True)

    return jsonify({
        "jobs": matched_live_jobs,
        "total_count": len(matched_live_jobs),
        "source": result.get('source', 'SerpApi Google Jobs'),
        "error": result.get('error'),
        "query": query,
        "location": location
    })

@app.route('/api/jobs/refresh-daily', methods=['POST'])
def refresh_daily_jobs_endpoint():
    refresh_result = trigger_daily_job_refresh()
    return jsonify(refresh_result)

def process_two_stage_job_filtering(raw_jobs, query="", location="", job_type="", category="All", user_skills=None):
    user_skills = user_skills or []
    query_clean = query.strip().lower()
    loc_clean = location.strip().lower()
    type_clean = job_type.strip().lower()

    # --- STAGE 1: Live Job Search Filters (Keyword, Location, Job Type, Category) ---
    stage1_jobs = []
    for job in raw_jobs:
        full_text = f"{job.get('title','')} {job.get('company','')} {job.get('description','')} {job.get('department','')} {' '.join(job.get('required_skills',[]))}".lower()

        # Keyword filter (all search query terms must be present in job text)
        if query_clean:
            query_words = [w.strip() for w in query_clean.split() if len(w.strip()) > 1]
            if not all(w in full_text for w in query_words):
                continue

        # Location filter with synonym matching (e.g. Bengaluru / Bangalore)
        if loc_clean:
            job_loc = job.get('location', '').lower()
            match_loc = loc_clean in job_loc
            if not match_loc:
                if (loc_clean in ['bengaluru', 'bangalore']) and any(alias in job_loc for alias in ['bengaluru', 'bangalore']):
                    match_loc = True
                elif (loc_clean in ['gurugram', 'gurgaon']) and any(alias in job_loc for alias in ['gurugram', 'gurgaon']):
                    match_loc = True
                elif (loc_clean in ['mumbai', 'bombay']) and any(alias in job_loc for alias in ['mumbai', 'bombay']):
                    match_loc = True
            if not match_loc:
                continue

        # Job Type filter (e.g. Internship, Full-time, Part-time, Contract)
        if type_clean:
            jtype = str(job.get('job_type', '')).lower()
            jtitle = str(job.get('title', '')).lower()
            jdesc = str(job.get('description', '')).lower()
            if type_clean == 'internship':
                if 'intern' not in jtype and 'intern' not in jtitle and 'intern' not in jdesc:
                    continue
            elif type_clean not in jtype and type_clean not in jtitle:
                continue

        # Category filter
        if category and category != 'All':
            if category == 'Frontend & Mobile' and not any(k in full_text for k in ['react', 'frontend', 'mobile', 'ios', 'android', 'vue', 'angular', 'flutter', 'ui']):
                continue
            elif category == 'Backend & Fullstack' and not any(k in full_text for k in ['python', 'backend', 'node', 'java', 'golang', 'php', 'fullstack', 'express', 'spring']):
                continue
            elif category == 'AI, ML & Data' and not any(k in full_text for k in ['ai', 'machine learning', 'data', 'llm', 'pytorch', 'tensorflow', 'mlops', 'analytics']):
                continue
            elif category == 'DevOps & Cloud' and not any(k in full_text for k in ['devops', 'aws', 'cloud', 'kubernetes', 'sre', 'docker', 'terraform', 'linux']):
                continue
            elif category == 'Cybersecurity & QA' and not any(k in full_text for k in ['security', 'qa', 'testing', 'cypress', 'selenium', 'cybersecurity']):
                continue
            elif category == 'Product & Risk' and not any(k in full_text for k in ['product', 'fraud', 'risk', 'aml', 'scrum', 'agile']):
                continue

        stage1_jobs.append(job)

    print(f"[Stage 1 Filter Log] Received {len(raw_jobs)} raw jobs -> {len(stage1_jobs)} jobs remaining after Stage 1 (query='{query}', location='{location}', type='{job_type}', category='{category}')")

    # --- STAGE 2: Optional AI Candidate-Skill Matching & Partitioning ---
    matched_jobs = []
    skill_gap_jobs = []

    for job in stage1_jobs:
        match_info = calculate_job_match(user_skills, job)
        score = match_info.get('match_score', 0)
        matched_req = len(match_info.get('matched_skills', []))

        if score >= 40 or matched_req >= 1 or not user_skills:
            matched_jobs.append(match_info)
        else:
            skill_gap_jobs.append(match_info)

    matched_jobs.sort(key=lambda x: x.get('match_score', 0), reverse=True)
    skill_gap_jobs.sort(key=lambda x: x.get('match_score', 0), reverse=True)

    print(f"[Stage 2 Skill Match Log] {len(matched_jobs)} jobs in Direct Matched tier, {len(skill_gap_jobs)} jobs in Skill Gap tier for user_skills={len(user_skills)} active")

    return {
        "raw_count": len(raw_jobs),
        "stage1_count": len(stage1_jobs),
        "stage1_jobs": stage1_jobs,
        "matched_jobs": matched_jobs,
        "skill_gap_jobs": skill_gap_jobs
    }

@app.route('/api/jobs/search-api', methods=['POST'])
def search_jobs_with_api_key():
    data = request.get_json() or {}
    api_key = data.get('api_key', '')
    app_id = data.get('app_id', '')
    query = data.get('query', 'software engineer')
    location = data.get('location', '')
    job_type = data.get('job_type', '')
    category = data.get('category', 'All')
    user_skills = data.get('user_skills') or data.get('skills', [])

    api_res = fetch_live_jobs_from_external_api(query=query, location=location or "india", job_type=job_type, api_key=api_key, app_id=app_id)
    raw_jobs = api_res.get('jobs', [])
    source = api_res.get('source', 'External Live Job API')
    error = api_res.get('error')

    is_fallback = False
    if not raw_jobs and error:
        # If API key returned an error/exception, fallback to verified local dataset feed
        print(f"[Backend Search API] SerpApi/External API returned error ('{error}'). Falling back to verified 52 jobs dataset.")
        raw_jobs = get_all_jobs()
        source = "Local verified feed (API fallback)"
        is_fallback = True
    elif not raw_jobs:
        # Genuine 0 results returned by live search
        print(f"[Backend Search API] SerpApi returned 0 search results for query='{query}', location='{location}'.")
        raw_jobs = get_all_jobs()
        source = "Local verified feed (0 live results fallback)"
        is_fallback = True

    two_stage_res = process_two_stage_job_filtering(raw_jobs, query=query, location=location, job_type=job_type, category=category, user_skills=user_skills)

    if two_stage_res["stage1_count"] == 0 and not is_fallback:
        print(f"[Backend Search API] Stage 1 filter returned 0 jobs from live API for query='{query}', location='{location}'. Falling back to verified opportunities dataset.")
        fallback_jobs = get_all_jobs()
        two_stage_res = process_two_stage_job_filtering(fallback_jobs, query=query, location=location, job_type=job_type, category=category, user_skills=user_skills)
        source = "Local verified feed (Live API 0-match fallback)"
        is_fallback = True

    return jsonify({
        "jobs": two_stage_res["stage1_jobs"],
        "matched_jobs": two_stage_res["matched_jobs"],
        "skill_gap_jobs": two_stage_res["skill_gap_jobs"],
        "total_count": two_stage_res["stage1_count"],
        "total_matched_count": len(two_stage_res["matched_jobs"]),
        "total_skill_gap_count": len(two_stage_res["skill_gap_jobs"]),
        "source": source,
        "error": error,
        "is_fallback": is_fallback
    })

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job_detail(job_id):
    job = get_job_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(job)

@app.route('/api/match-jobs', methods=['POST'])
def match_jobs_endpoint():
    data = request.get_json() or {}
    user_skills = data.get('user_skills') or data.get('skills', [])
    query = data.get('query', '')
    location = data.get('location', '')
    job_type = data.get('job_type', '')
    category = data.get('category', 'All')

    all_jobs = get_all_jobs()
    two_stage_res = process_two_stage_job_filtering(all_jobs, query=query, location=location, job_type=job_type, category=category, user_skills=user_skills)

    return jsonify({
        "jobs": two_stage_res["stage1_jobs"],
        "matched_jobs": two_stage_res["matched_jobs"],
        "skill_gap_jobs": two_stage_res["skill_gap_jobs"],
        "user_skills": user_skills,
        "total_matches": two_stage_res["stage1_count"]
    })

@app.route('/api/skill-gap', methods=['POST'])
def skill_gap_endpoint():
    data = request.get_json() or {}
    user_skills = data.get('user_skills') or data.get('skills', [])
    target_job_id = data.get('target_job_id') or data.get('job_id') or 'job-1'

    target_job = get_job_by_id(target_job_id)
    if not target_job:
        target_job = get_all_jobs()[0]

    gap_analysis = generate_skill_gap_analysis(user_skills, target_job)
    return jsonify(gap_analysis)

# ================= AI CAREER COACH & PORTFOLIO ROUTES =================

@app.route('/api/chat', methods=['POST'])
@app.route('/api/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.get_json() or {}
    user_message = data.get('message', '')
    conversation_history = data.get('history') or data.get('conversation_history', [])
    user_skills = data.get('user_skills') or data.get('skills', [])
    target_role = data.get('target_role', '')
    api_key = data.get('gemini_api_key') or data.get('api_key', '')

    if not user_message.strip():
        return jsonify({"error": "Message text is required"}), 400

    bot_response = generate_chatbot_response(
        user_message=user_message,
        user_skills=user_skills,
        target_role=target_role,
        conversation_history=conversation_history,
        api_key=api_key
    )
    return jsonify(bot_response)

@app.route('/api/portfolio/generate', methods=['POST'])
def generate_portfolio_endpoint():
    data = request.get_json() or {}
    template_style = data.get('template_style', 'modern_tech')
    user_profile = data.get('user_data', {})

    html_code = generate_portfolio_html(user_profile, template_style=template_style)

    return jsonify({
        "html_code": html_code,
        "template_style": template_style,
        "filename": "portfolio.html"
    })

@app.route('/api/saved-jobs', methods=['GET'])
def get_saved_jobs_endpoint():
    user_id = request.args.get('user_id', 'demo_user')
    saved_ids = db.get_saved_job_ids(user_id)
    all_jobs = get_all_jobs()
    saved_jobs = [j for j in all_jobs if j['id'] in saved_ids]
    return jsonify({"saved_jobs": saved_jobs})

@app.route('/api/saved-jobs', methods=['POST'])
def save_job_endpoint():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'demo_user')
    job_id = data.get('job_id')
    if not job_id:
        return jsonify({"error": "job_id is required"}), 400
    db.save_job(user_id, job_id)
    return jsonify({"success": True, "message": "Job saved successfully"})

@app.route('/api/saved-jobs/<job_id>', methods=['DELETE'])
def remove_saved_job_endpoint(job_id):
    user_id = request.args.get('user_id', 'demo_user')
    db.remove_saved_job(user_id, job_id)
    return jsonify({"success": True, "message": "Job removed from saved list"})

@app.route('/api/applications', methods=['POST'])
def apply_job_endpoint():
    data = request.get_json() or {}
    user_id = data.get('user_id', 'demo_user')
    job_id = data.get('job_id')
    resume_id = data.get('resume_id', 'default_resume')
    if not job_id:
        return jsonify({"error": "job_id is required"}), 400
    app_id = db.save_application(user_id, job_id, resume_id)
    return jsonify({"success": True, "application_id": app_id, "message": "Application submitted successfully!"})

@app.route('/api/applications', methods=['GET'])
def get_user_applications_endpoint():
    user_id = request.args.get('user_id', 'demo_user')
    applications = db.get_user_applications(user_id)
    return jsonify({"applications": applications})

@app.route('/api/profile', methods=['POST'])
def save_profile_endpoint():
    data = request.get_json() or {}
    user_id = data.get('user_id') or data.get('id') or 'demo_user'
    db.save_full_user_profile(user_id, data)
    saved_profile = db.get_user_profile(user_id)
    return jsonify({"success": True, "message": "Profile saved successfully", "profile": saved_profile})

@app.route('/api/profile/<user_id>', methods=['GET'])
def get_profile_endpoint(user_id):
    profile = db.get_user_profile(user_id)
    if not profile:
        profile = {
            "user_id": user_id,
            "full_name": "Alex Rivera",
            "email": "alex.rivera@example.com",
            "phone": "+91 98765 43210",
            "desired_job_role": "Frontend Engineer",
            "technical_skills": ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git", "Next.js", "Redux"],
            "ats_score": 84,
            "completion_percentage": 65
        }
    return jsonify(profile)

@app.route('/api/profile/upload-photo', methods=['POST'])
def upload_profile_photo_endpoint():
    user_id = request.form.get('user_id') or 'demo_user'
    photo_url = ""

    if 'file' in request.files:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            try:
                import base64
                file_bytes = uploaded_file.read()
                mime_type = uploaded_file.content_type or 'image/jpeg'
                encoded = base64.b64encode(file_bytes).decode('utf-8')
                photo_url = f"data:{mime_type};base64,{encoded}"
            except Exception as e:
                return jsonify({"error": f"Failed to upload photo: {str(e)}"}), 400

    if not photo_url and request.is_json:
        data = request.get_json() or {}
        user_id = data.get('user_id', user_id)
        photo_url = data.get('photo_url', '')

    existing_profile = db.get_user_profile(user_id) or {"user_id": user_id}
    existing_profile['photo_url'] = photo_url
    db.save_full_user_profile(user_id, existing_profile)

    return jsonify({"success": True, "photo_url": photo_url, "message": "Profile photo updated successfully!"})

@app.route('/api/profile/upload-resume', methods=['POST'])
def upload_profile_resume_endpoint():
    user_id = request.form.get('user_id') or 'demo_user'
    resume_text = ""
    filename = ""

    if 'file' in request.files:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            try:
                filename = uploaded_file.filename
                file_bytes = uploaded_file.read()
                resume_text = extract_text_from_file(file_bytes, filename)
            except Exception as e:
                return jsonify({"error": f"Failed to parse resume file: {str(e)}"}), 400

    if not resume_text:
        return jsonify({"error": "No valid resume file provided."}), 400

    analysis = analyze_resume_content(resume_text)
    extracted_skills = analysis.get('extracted_skills', [])
    ats_score = analysis.get('ats_score') or analysis.get('overall_ats_score', 75)

    existing_profile = db.get_user_profile(user_id) or {"user_id": user_id}
    existing_profile['resume_filename'] = filename
    existing_profile['resume_text'] = resume_text
    existing_profile['ats_score'] = ats_score
    existing_profile['technical_skills'] = extracted_skills
    existing_profile['extracted_skills'] = extracted_skills

    db.save_full_user_profile(user_id, existing_profile)
    updated_profile = db.get_user_profile(user_id)

    return jsonify({
        "success": True,
        "message": "Resume uploaded and analyzed successfully!",
        "filename": filename,
        "ats_score": ats_score,
        "extracted_skills": extracted_skills,
        "analysis": analysis,
        "profile": updated_profile
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
