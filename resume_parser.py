import io
import re
from skill_extractor import extract_skills_from_text

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import docx
except ImportError:
    docx = None

def clean_extracted_text(raw_text: str) -> str:
    """Cleans up PDF/DOCX artifacts, non-breaking spaces, hyphenated line wraps, and ligatures."""
    if not raw_text:
        return ""
    # Normalize ligatures
    ligatures = {
        'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl',
        '’': "'", '‘': "'", '“': '"', '”': '"', '\xa0': ' ', '\u200b': ' '
    }
    for lig, rep in ligatures.items():
        raw_text = raw_text.replace(lig, rep)

    # De-hyphenate words split across lines e.g. "experi-\nence" -> "experience"
    cleaned = re.sub(r'(\b[a-zA-Z]{3,})-\n\s*([a-zA-Z]{3,}\b)', r'\1\2', raw_text)
    
    # Normalize excessive newlines and whitespace
    cleaned = re.sub(r'\r\n', '\n', cleaned)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    
    return cleaned.strip()

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """
    Extracts raw text from uploaded PDF, DOCX, or TXT resume files with full table,
    form, and page support.
    """
    ext = filename.lower().split('.')[-1]
    
    if ext == 'txt':
        try:
            raw = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            raw = file_bytes.decode('latin-1', errors='ignore')
        return clean_extracted_text(raw)
            
    elif ext == 'pdf':
        extracted_text = ""
        if pypdf is not None:
            try:
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                page_texts = []
                for idx, page in enumerate(reader.pages):
                    txt = page.extract_text()
                    if txt:
                        page_texts.append(txt)
                extracted_text = "\n".join(page_texts)
            except Exception as e:
                print(f"[Resume Parser] pypdf extraction warning for {filename}: {e}")
        
        if extracted_text.strip():
            return clean_extracted_text(extracted_text)
            
        # Fallback binary string cleanup if PDF text extraction stream fails
        raw = file_bytes.decode('utf-8', errors='ignore')
        clean_raw = re.sub(r'[^\x20-\x7E\n\r\t]', ' ', raw)
        return clean_extracted_text(clean_raw)

    elif ext in ['docx', 'doc']:
        extracted_text = ""
        if docx is not None:
            try:
                doc = docx.Document(io.BytesIO(file_bytes))
                text_parts = []
                # 1. Extract paragraphs
                for paragraph in doc.paragraphs:
                    if paragraph.text and paragraph.text.strip():
                        text_parts.append(paragraph.text.strip())
                # 2. Extract table cells (critical for multi-column resumes)
                for table in doc.tables:
                    for row in table.rows:
                        row_cells = [cell.text.strip() for cell in row.cells if cell.text and cell.text.strip()]
                        if row_cells:
                            text_parts.append(" | ".join(dict.fromkeys(row_cells)))
                extracted_text = "\n".join(text_parts)
            except Exception as e:
                print(f"[Resume Parser] docx extraction warning for {filename}: {e}")
                
        if extracted_text.strip():
            return clean_extracted_text(extracted_text)
            
        raw = file_bytes.decode('utf-8', errors='ignore')
        clean_raw = re.sub(r'[^\x20-\x7E\n\r\t]', ' ', raw)
        return clean_extracted_text(clean_raw)

    else:
        raw = file_bytes.decode('utf-8', errors='ignore')
        return clean_extracted_text(re.sub(r'[^\x20-\x7E\n\r\t]', ' ', raw))

def analyze_resume_content(resume_text: str) -> dict:
    """
    Analyzes Resume or CV text to extract genuine skills directly from the resume,
    perform ATS section audit, calculate 0-100 ATS compliance score, and highlight strengths/improvements.
    """
    if not resume_text or len(resume_text.strip()) < 10:
        return {
            "error": "Resume text is empty or could not be read. Please upload a valid PDF, DOCX, or paste resume text.",
            "ats_score": 15,
            "document_type": "Resume / CV",
            "extracted_skills": [],
            "skills_by_category": {},
            "sections_found": [],
            "missing_sections": [
                "Contact Information", "Professional Summary", "Work Experience",
                "Education & Academic Credentials", "Skills & Competencies", "Projects & Portfolios"
            ],
            "strengths": ["Document received."],
            "improvements": ["Ensure file contains selectable plain text content."],
            "metrics": {"section_score": 5, "skill_score": 0, "length_score": 5, "impact_score": 5}
        }

    clean_text = clean_extracted_text(resume_text.strip())
    words = clean_text.split()
    word_count = len(words)

    # Detect if document is an Academic/Executive CV vs standard Resume
    is_cv = bool(re.search(r'(curriculum vitae|\bcv\b|publications|research|teaching|academic|grants|fellowships|dissertation)', clean_text, re.IGNORECASE))
    document_type = "Curriculum Vitae (CV)" if is_cv else "Standard Resume"

    # 1. Genuine Skill Extraction directly based on resume content
    extracted_skill_data = extract_skills_from_text(clean_text)
    all_skills = extracted_skill_data.get("extracted_skills", [])
    skills_by_cat = extracted_skill_data.get("skills_by_category", {})

    # 2. Section Detection (Resume & CV sections)
    sections = {
        "Contact Information": bool(re.search(r'(email|phone|linkedin|github|contact|@|\d{10})', clean_text, re.IGNORECASE)),
        "Professional Summary": bool(re.search(r'(summary|profile|about me|objective|overview)', clean_text, re.IGNORECASE)),
        "Work Experience": bool(re.search(r'(experience|employment|work history|career|internship)', clean_text, re.IGNORECASE)),
        "Education & Academic Credentials": bool(re.search(r'(education|degree|university|college|bachelor|master|phd|gpa|diploma)', clean_text, re.IGNORECASE)),
        "Skills & Competencies": bool(re.search(r'(skills|technical skills|technologies|expertise|competencies|tools)', clean_text, re.IGNORECASE)),
        "Projects & Portfolios": bool(re.search(r'(projects|portfolio|key projects|academic projects)', clean_text, re.IGNORECASE)),
        "Publications & Research": bool(re.search(r'(publication|research|journal|conference|paper|patent|dissertation)', clean_text, re.IGNORECASE)),
        "Certifications & Awards": bool(re.search(r'(certif|license|honor|award|grant|fellowship)', clean_text, re.IGNORECASE))
    }

    found_sections = [sec for sec, present in sections.items() if present]

    # 3. Action Verbs & Metrics Detection
    action_verbs = [
        "managed", "developed", "created", "led", "engineered", "designed", "implemented",
        "published", "researched", "increased", "reduced", "improved", "built", "architected",
        "optimized", "spearheaded", "collaborated", "automated", "scaled", "authored", "presented",
        "configured", "deployed", "refactored", "orchestrated", "mentored"
    ]
    verb_matches = [verb for verb in action_verbs if re.search(r'\b' + verb + r'\b', clean_text, re.IGNORECASE)]
    metrics_matches = re.findall(r'(\d+%\s*|\$\d+|\d+\+\s*|increased by \d+|reduced by \d+|\b\d{2,}\b)', clean_text, re.IGNORECASE)

    # 4. Compute ATS Score breakdown (0-100)
    section_score = (len(found_sections) / len(sections)) * 35
    skill_score = min(len(all_skills) * 3, 30)

    # Word count scoring tuned for CVs (longer) vs Resumes (1-2 pages)
    if is_cv:
        length_score = 15 if 400 <= word_count <= 2500 else 10
    else:
        if 250 <= word_count <= 950:
            length_score = 15
        elif 150 <= word_count < 250 or 950 < word_count <= 1400:
            length_score = 10
        else:
            length_score = 5

    action_score = min(len(verb_matches) * 2, 10)
    metrics_score = min(len(metrics_matches) * 2.5, 10)

    ats_score = int(round(section_score + skill_score + length_score + action_score + metrics_score))
    ats_score = max(15, min(100, ats_score))

    # 5. Dynamic Strengths directly derived from resume
    strengths = []
    if is_cv:
        strengths.append("Recognized as a comprehensive Curriculum Vitae (CV) format.")
    if len(all_skills) >= 6:
        strengths.append(f"High technical & domain skill density ({len(all_skills)} relevant skills identified).")
    elif len(all_skills) >= 1:
        strengths.append(f"Successfully identified {len(all_skills)} core technical competencies.")
    if "Work Experience" in found_sections and "Education & Academic Credentials" in found_sections:
        strengths.append("Clear structural organization with standard ATS section headers.")
    if "Publications & Research" in found_sections:
        strengths.append("Includes academic research, publications, or conference presentations.")
    if len(verb_matches) >= 3:
        strengths.append(f"Effective action verb usage ({', '.join(verb_matches[:3])}).")
    if len(metrics_matches) >= 2:
        strengths.append("Includes quantified achievements and performance metrics.")
    if not strengths:
        strengths.append("Contains legible plain text sections.")

    # 6. Dynamic Improvement Recommendations
    improvements = []
    missing = [sec for sec, present in sections.items() if not present and sec in ["Professional Summary", "Projects & Portfolios", "Work Experience", "Skills & Competencies"]]
    if missing:
        improvements.append(f"Add key section header(s): {', '.join(missing)}.")
    if len(all_skills) < 5:
        improvements.append("List more technical skills and frameworks in your Skills section to improve automated ATS screening.")
    if len(metrics_matches) < 2:
        improvements.append("Include measurable results (e.g., 'Improved performance by 35%').")
    if is_cv and "Publications & Research" not in found_sections:
        improvements.append("Consider adding a Publications or Research projects section for your CV.")
    if word_count < 200:
        improvements.append("Expand detailed bullet points detailing your career accomplishments and responsibilities.")

    return {
        "ats_score": ats_score,
        "document_type": document_type,
        "word_count": word_count,
        "extracted_skills": all_skills,
        "skills_by_category": skills_by_cat,
        "total_skills_count": len(all_skills),
        "sections_found": found_sections,
        "missing_sections": [sec for sec, present in sections.items() if not present],
        "strengths": strengths,
        "improvements": improvements,
        "metrics": {
            "section_score": int(round(section_score)),
            "skill_score": int(round(skill_score)),
            "length_score": int(round(length_score)),
            "impact_score": int(round(action_score + metrics_score))
        }
    }
