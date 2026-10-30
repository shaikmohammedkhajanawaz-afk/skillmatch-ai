import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "skillmatch.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # User Profile table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_profile (
            user_id TEXT PRIMARY KEY,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            dob TEXT,
            gender TEXT,
            city TEXT,
            state TEXT,
            country TEXT,
            photo_url TEXT,
            desired_job_role TEXT,
            career_objective TEXT,
            experience_years TEXT,
            employment_status TEXT,
            preferred_job_type TEXT,
            preferred_work_location TEXT,
            expected_salary TEXT,
            highest_qualification TEXT,
            degree TEXT,
            specialization TEXT,
            college_university TEXT,
            graduation_year TEXT,
            cgpa_percentage TEXT,
            technical_skills TEXT,
            programming_languages TEXT,
            frameworks TEXT,
            tools TEXT,
            soft_skills TEXT,
            languages_known TEXT,
            work_experience TEXT,
            certifications TEXT,
            linkedin_url TEXT,
            github_url TEXT,
            portfolio_url TEXT,
            resume_filename TEXT,
            resume_url TEXT,
            resume_text TEXT,
            ats_score INTEGER DEFAULT 0,
            completion_percentage INTEGER DEFAULT 0,
            target_role TEXT,
            extracted_skills TEXT,
            updated_at TIMESTAMP
        )
    ''')

    # Migration helper to add missing columns to existing user_profile table if needed
    cursor.execute("PRAGMA table_info(user_profile)")
    existing_columns = [row['name'] for row in cursor.fetchall()]
    new_columns = [
        ("phone", "TEXT"), ("dob", "TEXT"), ("gender", "TEXT"), ("city", "TEXT"),
        ("state", "TEXT"), ("country", "TEXT"), ("photo_url", "TEXT"), ("desired_job_role", "TEXT"),
        ("career_objective", "TEXT"), ("experience_years", "TEXT"), ("employment_status", "TEXT"),
        ("preferred_job_type", "TEXT"), ("preferred_work_location", "TEXT"), ("expected_salary", "TEXT"),
        ("highest_qualification", "TEXT"), ("degree", "TEXT"), ("specialization", "TEXT"),
        ("college_university", "TEXT"), ("graduation_year", "TEXT"), ("cgpa_percentage", "TEXT"),
        ("technical_skills", "TEXT"), ("programming_languages", "TEXT"), ("frameworks", "TEXT"),
        ("tools", "TEXT"), ("soft_skills", "TEXT"), ("languages_known", "TEXT"),
        ("work_experience", "TEXT"), ("certifications", "TEXT"), ("linkedin_url", "TEXT"),
        ("github_url", "TEXT"), ("portfolio_url", "TEXT"), ("resume_filename", "TEXT"),
        ("resume_url", "TEXT"), ("completion_percentage", "INTEGER DEFAULT 0")
    ]
    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            try:
                cursor.execute(f"ALTER TABLE user_profile ADD COLUMN {col_name} {col_type}")
            except Exception as e:
                print(f"[DB Migration] Column {col_name} alter notice: {e}")

    conn.commit()

def get_user_profile(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user_profile WHERE user_id = ?', (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    data = dict(row)
    # Parse JSON fields safely
    for json_field in ['technical_skills', 'programming_languages', 'frameworks', 'tools', 'soft_skills', 'languages_known', 'work_experience', 'certifications', 'extracted_skills']:
        if json_field in data and data[json_field]:
            try:
                data[json_field] = json.loads(data[json_field])
            except Exception:
                pass
    return data

def save_full_user_profile(user_id, profile_data):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    def stringify(val):
        if isinstance(val, (list, dict)):
            return json.dumps(val)
        return str(val) if val is not None else ""

    full_name = profile_data.get('full_name') or profile_data.get('name', '')
    email = profile_data.get('email', '')
    phone = profile_data.get('phone', '')
    dob = profile_data.get('dob', '')
    gender = profile_data.get('gender', '')
    city = profile_data.get('city', '')
    state = profile_data.get('state', '')
    country = profile_data.get('country', '')
    photo_url = profile_data.get('photo_url') or profile_data.get('avatar', '')

    desired_job_role = profile_data.get('desired_job_role') or profile_data.get('target_role', '')
    career_objective = profile_data.get('career_objective', '')
    experience_years = str(profile_data.get('experience_years', ''))
    employment_status = profile_data.get('employment_status', '')
    preferred_job_type = profile_data.get('preferred_job_type', '')
    preferred_work_location = profile_data.get('preferred_work_location', '')
    expected_salary = profile_data.get('expected_salary', '')

    highest_qualification = profile_data.get('highest_qualification', '')
    degree = profile_data.get('degree', '')
    specialization = profile_data.get('specialization', '')
    college_university = profile_data.get('college_university', '')
    graduation_year = str(profile_data.get('graduation_year', ''))
    cgpa_percentage = str(profile_data.get('cgpa_percentage', ''))

    technical_skills = stringify(profile_data.get('technical_skills', []))
    programming_languages = stringify(profile_data.get('programming_languages', []))
    frameworks = stringify(profile_data.get('frameworks', []))
    tools = stringify(profile_data.get('tools', []))
    soft_skills = stringify(profile_data.get('soft_skills', []))
    languages_known = stringify(profile_data.get('languages_known', []))

    work_experience = stringify(profile_data.get('work_experience', []))
    certifications = stringify(profile_data.get('certifications', []))

    linkedin_url = profile_data.get('linkedin_url', '')
    github_url = profile_data.get('github_url', '')
    portfolio_url = profile_data.get('portfolio_url', '')

    resume_filename = profile_data.get('resume_filename', '')
    resume_url = profile_data.get('resume_url', '')
    resume_text = profile_data.get('resume_text', '')
    ats_score = int(profile_data.get('ats_score') or 0)
    completion_percentage = int(profile_data.get('completion_percentage') or 0)

    # Combined extracted skills for matching compatibility
    extracted_skills_list = profile_data.get('skills') or profile_data.get('technical_skills') or []
    extracted_skills = stringify(extracted_skills_list)

    cursor.execute('''
        INSERT INTO user_profile (
            user_id, full_name, email, phone, dob, gender, city, state, country, photo_url,
            desired_job_role, career_objective, experience_years, employment_status, preferred_job_type, preferred_work_location, expected_salary,
            highest_qualification, degree, specialization, college_university, graduation_year, cgpa_percentage,
            technical_skills, programming_languages, frameworks, tools, soft_skills, languages_known,
            work_experience, certifications, linkedin_url, github_url, portfolio_url,
            resume_filename, resume_url, resume_text, ats_score, completion_percentage, target_role, extracted_skills, updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?
        ) ON CONFLICT(user_id) DO UPDATE SET
            full_name=excluded.full_name,
            email=excluded.email,
            phone=excluded.phone,
            dob=excluded.dob,
            gender=excluded.gender,
            city=excluded.city,
            state=excluded.state,
            country=excluded.country,
            photo_url=excluded.photo_url,
            desired_job_role=excluded.desired_job_role,
            career_objective=excluded.career_objective,
            experience_years=excluded.experience_years,
            employment_status=excluded.employment_status,
            preferred_job_type=excluded.preferred_job_type,
            preferred_work_location=excluded.preferred_work_location,
            expected_salary=excluded.expected_salary,
            highest_qualification=excluded.highest_qualification,
            degree=excluded.degree,
            specialization=excluded.specialization,
            college_university=excluded.college_university,
            graduation_year=excluded.graduation_year,
            cgpa_percentage=excluded.cgpa_percentage,
            technical_skills=excluded.technical_skills,
            programming_languages=excluded.programming_languages,
            frameworks=excluded.frameworks,
            tools=excluded.tools,
            soft_skills=excluded.soft_skills,
            languages_known=excluded.languages_known,
            work_experience=excluded.work_experience,
            certifications=excluded.certifications,
            linkedin_url=excluded.linkedin_url,
            github_url=excluded.github_url,
            portfolio_url=excluded.portfolio_url,
            resume_filename=excluded.resume_filename,
            resume_url=excluded.resume_url,
            resume_text=excluded.resume_text,
            ats_score=excluded.ats_score,
            completion_percentage=excluded.completion_percentage,
            target_role=excluded.target_role,
            extracted_skills=excluded.extracted_skills,
            updated_at=excluded.updated_at
    ''', (
        user_id, full_name, email, phone, dob, gender, city, state, country, photo_url,
        desired_job_role, career_objective, experience_years, employment_status, preferred_job_type, preferred_work_location, expected_salary,
        highest_qualification, degree, specialization, college_university, graduation_year, cgpa_percentage,
        technical_skills, programming_languages, frameworks, tools, soft_skills, languages_known,
        work_experience, certifications, linkedin_url, github_url, portfolio_url,
        resume_filename, resume_url, resume_text, ats_score, completion_percentage, desired_job_role, extracted_skills, now
    ))
    conn.commit()
    conn.close()

def save_user_profile(user_id, name, email, target_role, skills, resume_text="", ats_score=0):
    save_full_user_profile(user_id, {
        "user_id": user_id,
        "full_name": name,
        "email": email,
        "desired_job_role": target_role,
        "technical_skills": skills,
        "resume_text": resume_text,
        "ats_score": ats_score
    })

    conn = get_db_connection()
    cursor = conn.cursor()

    # Saved Jobs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            job_id TEXT,
            saved_at TIMESTAMP,
            UNIQUE(user_id, job_id)
        )
    ''')

    # Job Applications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS job_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            job_id TEXT,
            job_title TEXT,
            company TEXT,
            status TEXT DEFAULT 'Applied',
            applied_at TIMESTAMP,
            notes TEXT,
            UNIQUE(user_id, job_id)
        )
    ''')

    # Community Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS community_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel_id TEXT,
            user_id TEXT,
            user_name TEXT,
            user_role TEXT,
            avatar TEXT,
            message_text TEXT,
            is_mentor BOOLEAN DEFAULT 0,
            likes_count INTEGER DEFAULT 0,
            attachment_name TEXT,
            attachment_url TEXT,
            created_at TIMESTAMP
        )
    ''')

    # 1-to-1 Mentor Sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mentor_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            mentor_id TEXT,
            mentor_name TEXT,
            topic TEXT,
            date_time TEXT,
            status TEXT DEFAULT 'Scheduled',
            notes TEXT,
            created_at TIMESTAMP
        )
    ''')

    # Practice Examination Attempts Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS exam_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            exam_mode TEXT,
            difficulty TEXT,
            overall_score INTEGER,
            aptitude_score INTEGER,
            reasoning_score INTEGER,
            technical_score INTEGER,
            coding_score INTEGER,
            accuracy INTEGER,
            attempted_count INTEGER,
            correct_count INTEGER,
            strong_skills TEXT,
            weak_skills TEXT,
            created_at TIMESTAMP
        )
    ''')

    # Career Support Threads table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS support_threads (
            thread_id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            category TEXT,
            status TEXT DEFAULT 'Active',
            is_ask_anyone INTEGER DEFAULT 0,
            created_at TIMESTAMP,
            updated_at TIMESTAMP
        )
    ''')

    # Career Support Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS support_messages (
            msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
            thread_id TEXT,
            sender_type TEXT,
            sender_name TEXT,
            sender_avatar TEXT,
            message_text TEXT,
            attachment_name TEXT,
            attachment_url TEXT,
            timestamp TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()

def save_user_profile(user_id, name, email, target_role, skills, resume_text="", ats_score=0):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO user_profile (user_id, full_name, email, target_role, extracted_skills, resume_text, ats_score, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            full_name=excluded.full_name,
            email=excluded.email,
            target_role=excluded.target_role,
            extracted_skills=excluded.extracted_skills,
            resume_text=excluded.resume_text,
            ats_score=excluded.ats_score,
            updated_at=excluded.updated_at
    ''', (user_id, name, email, target_role, json.dumps(skills), resume_text, ats_score, now))
    conn.commit()
    conn.close()

def save_job(user_id, job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT OR IGNORE INTO saved_jobs (user_id, job_id, saved_at)
        VALUES (?, ?, ?)
    ''', (user_id, job_id, now))
    conn.commit()
    conn.close()

def remove_saved_job(user_id, job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?
    ''', (user_id, job_id))
    conn.commit()
    conn.close()

def get_saved_job_ids(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT job_id FROM saved_jobs WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [row['job_id'] for row in rows]

def save_application(user_id, job_id, job_title="", company="", notes=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO job_applications (user_id, job_id, job_title, company, status, applied_at, notes)
        VALUES (?, ?, ?, ?, 'Applied', ?, ?)
        ON CONFLICT(user_id, job_id) DO UPDATE SET
            applied_at=excluded.applied_at
    ''', (user_id, job_id, job_title, company, now, notes))
    app_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return app_id

def get_user_applications(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM job_applications WHERE user_id = ? ORDER BY applied_at DESC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def save_community_message(channel_id, user_id, user_name, user_role, avatar, message_text, is_mentor=False, attachment_name="", attachment_url=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO community_messages (channel_id, user_id, user_name, user_role, avatar, message_text, is_mentor, attachment_name, attachment_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (channel_id, user_id, user_name, user_role, avatar, message_text, 1 if is_mentor else 0, attachment_name, attachment_url, now))
    msg_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return msg_id

def get_community_messages(channel_id, limit=50):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM community_messages WHERE channel_id = ? ORDER BY created_at ASC LIMIT ?', (channel_id, limit))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def book_mentor_session(user_id, mentor_id, mentor_name, topic, date_time, notes=""):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO mentor_sessions (user_id, mentor_id, mentor_name, topic, date_time, status, notes, created_at)
        VALUES (?, ?, ?, ?, ?, 'Scheduled', ?, ?)
    ''', (user_id, mentor_id, mentor_name, topic, date_time, notes, now))
    sess_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return sess_id

def get_user_mentor_sessions(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM mentor_sessions WHERE user_id = ? ORDER BY created_at DESC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Exam Attempt Tracking Methods
def save_exam_attempt(user_id, mode, difficulty, overall, apt, reas, tech, code, accuracy, attempted, correct, strong_skills, weak_skills):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO exam_attempts (
            user_id, exam_mode, difficulty, overall_score, aptitude_score,
            reasoning_score, technical_score, coding_score, accuracy,
            attempted_count, correct_count, strong_skills, weak_skills, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id, mode, difficulty, overall, apt, reas, tech, code, accuracy,
        attempted, correct, json.dumps(strong_skills), json.dumps(weak_skills), now
    ))
    attempt_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return attempt_id

def get_user_exam_attempts(user_id="demo_user"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM exam_attempts WHERE user_id = ? ORDER BY created_at ASC', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    results = []
    for r in rows:
        item = dict(r)
        item['strong_skills'] = json.loads(item['strong_skills'] or '[]')
        item['weak_skills'] = json.loads(item['weak_skills'] or '[]')
        results.append(item)
    return results

