import re

# =========================================================================
# COMPREHENSIVE MASTER SKILL TAXONOMY
# Covers 180+ industry-standard tech competencies aligned with verified jobs
# =========================================================================

SKILL_TAXONOMY = {
    "Programming Languages": [
        "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "Go",
        "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "SQL", "HTML5",
        "CSS3", "Sass", "Bash", "Shell", "PowerShell", "R", "Scala", "Julia", "Perl"
    ],
    "Frontend Development": [
        "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Redux",
        "Tailwind CSS", "Bootstrap", "Material UI", "Webpack", "Vite", "Storybook",
        "jQuery", "HTML/CSS", "Design Systems", "RxJS", "WebAssembly"
    ],
    "Backend & APIs": [
        "Node.js", "Express", "Django", "FastAPI", "Flask", "Spring Boot",
        ".NET Core", "Ruby on Rails", "Laravel", "GraphQL", "REST API", "gRPC",
        "WebSockets", "Microservices", "Distributed Systems", "Celery", "Kafka", "RabbitMQ"
    ],
    "Databases & Storage": [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "SQL Server",
        "Cassandra", "DynamoDB", "Firebase", "Supabase", "Prisma", "Snowflake",
        "Elasticsearch", "Oracle", "Database Administration"
    ],
    "Cloud & DevOps": [
        "AWS", "AWS Lambda", "Azure", "GCP", "Docker", "Kubernetes",
        "Terraform", "Ansible", "CI/CD", "GitHub Actions", "Jenkins",
        "Linux", "Unix", "Nginx", "Apache", "Helm", "Prometheus", "Grafana"
    ],
    "AI, Machine Learning & Data": [
        "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP",
        "LLMs", "Generative AI", "RAG", "LangChain", "HuggingFace", "Vector Databases",
        "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "OpenCV", "Pandas",
        "NumPy", "Tableau", "PowerBI", "Excel", "Spark", "Airflow", "Data Analysis",
        "Statistics", "dbt"
    ],
    "Testing & QA Automation": [
        "Jest", "Cypress", "Playwright", "Selenium", "Pytest", "JUnit",
        "Postman", "JMeter", "Gatling", "SonarQube", "QA Automation",
        "Performance Testing"
    ],
    "Mobile Development": [
        "React Native", "Flutter", "Android", "iOS", "SwiftUI",
        "Jetpack Compose", "Xcode"
    ],
    "Tools & Methodologies": [
        "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
        "Figma", "Agile", "Scrum", "Kanban", "Product Management",
        "Project Management", "UI/UX", "User Research"
    ],
    "Cybersecurity & IT": [
        "Cybersecurity", "Penetration Testing", "Network Security", "Networking",
        "Wireshark", "Burp Suite", "Cryptography", "Fraud Detection",
        "Active Directory", "IT Support", "Incident Response"
    ],
    "Soft Skills": [
        "Problem Solving", "Communication", "Teamwork", "Leadership",
        "Critical Thinking", "Time Management", "Adaptability",
        "Collaboration", "Mentorship", "Analytical Thinking",
        "Negotiation", "Conflict Resolution", "Interpersonal Skills"
    ]
}

# =========================================================================
# PRECISION REGEX PATTERNS & SYNONYMS FOR ACCURATE EXTRACTION
# Prevents false positives while capturing punctuation, bullets, and slashes
# =========================================================================

SKILL_PATTERNS = {
    # Programming Languages
    "Python": [r"\bpython(?:3)?\b"],
    "JavaScript": [
        r"\bjavascript\b",
        r"(?:^|[\s,;:\(\)\[\]/|])js(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:html|css|python|ts|typescript|react|node))"
    ],
    "TypeScript": [
        r"\btypescript(?:\.js)?\b",
        r"\btype[\s\-_]+script\b",
        r"\btsx\b",
        r"\bts\b(?=\s*(?:,|/|\||\&|\band\b)\s*(?:js|javascript|react|node|angular|python|vue|tailwind|redux|next|html|css|express|frontend))",
        r"(?:js|javascript|react|node|angular|python|vue|tailwind|redux|next|html|css|express|frontend)\s*(?:,|/|\||\&|\band\b)\s*\bts\b",
        r'[,:/|]\s*ts\s*[,:/|]'
    ],
    "Java": [r"\bjava\b(?!\s*script|\s*[\-_]script)"],
    "C++": [r"\bc\+\+(?!\w)", r"\bcpp\b"],
    "C#": [r"\bc\#(?!\w)", r"\bc[\-\s]?sharp\b"],
    "C": [
        r"\bc\s*(?:programming|language)\b",
        r"\blanguages\s*[:\-]\s*c(?!\w)",
        r"\bc\b(?=\s*(?:and|with|in|,|/)\s*(?:c\+\+|c\#|assembly|embedded|linux|python|java|rust))",
        r"(?:c\+\+|c\#|assembly|embedded|linux|python|java|rust)\s*(?:and|with|in|,|/)\s*\bc\b",
        r'[,:/|]\s*c\s*[,:/|]'
    ],
    "Go": [
        r"\bgolang\b",
        r"\bgo\s+(?:language|programming|lang)\b",
        r"\bgo\b(?=\s+(?:and|with|in|,|/)\s+(?:docker|kubernetes|python|rust|c\+\+|c\#|java|grpc|postgres|redis|aws|microservices))",
        r"(?:docker|kubernetes|python|rust|c\+\+|c\#|java|grpc|postgres|redis|aws|microservices)\s+(?:and|with|in|,|/)\s+\bgo\b",
        r'[,:/|]\s*go\s*[,:/|]'
    ],
    "Rust": [r"\brust\b(?:\s+(?:lang|programming))?"],
    "PHP": [r"\bphp\b"],
    "Ruby": [r"\bruby\b(?!\s*on\s*rails)"],
    "Swift": [r"\bswift\b(?!\s*ui)"],
    "Kotlin": [r"\bkotlin\b"],
    "Dart": [r"\bdart\b"],
    "SQL": [r"\bsql\b"],
    "HTML5": [r"\bhtml5?\b"],
    "CSS3": [r"(?<!tailwind\s)(?<!tailwind[\-_])\bcss3?\b"],
    "Sass": [r"\bsass\b", r"\bscss\b"],
    "Bash": [r"\bbash\b", r"\bshell\s*(?:scripting)?\b"],
    "PowerShell": [r"\bpowershell\b"],
    "R": [
        r"\br\s+(?:programming|language|studio)\b",
        r"\brstudio\b",
        r"\br\b(?=\s+(?:and|with|in|,|/)\s+(?:python|sas|spss|sql|matlab|stata|statistics|data))",
        r"(?:python|sas|spss|sql|matlab|stata|statistics|data)\s+(?:and|with|in|,|/)\s+\br\b",
        r'[,:/|]\s*r\s*[,:/|]'
    ],
    "Scala": [r"\bscala\b"],
    "Julia": [r"\bjulia(?:\s+language|\s+programming)?\b"],
    "Perl": [r"\bperl\b"],

    # Frontend Development
    "React": [r"\breact(?:\.js|js)?\b(?!\s*native)"],
    "Next.js": [r"\bnext(?:\.js|js)?\b"],
    "Vue.js": [r"\bvue(?:\.js|js)?\b"],
    "Nuxt.js": [r"\bnuxt(?:\.js|js)?\b"],
    "Angular": [r"\bangular(?:\.js|js)?\b"],
    "Svelte": [r"\bsvelte\b"],
    "Redux": [r"\bredux\b(?:\s*toolkit)?"],
    "Tailwind CSS": [
        r"\btailwind(?:\s*css|\.css)?\b",
        r"\btailwind[\-_]css\b",
        r"\btailwind\b"
    ],
    "Bootstrap": [r"\bbootstrap\b"],
    "Material UI": [r"\bmaterial[\s\-_]*ui\b", r"\bmui\b"],
    "Webpack": [r"\bwebpack\b"],
    "Vite": [r"\bvite\b"],
    "Storybook": [r"\bstorybook\b"],
    "jQuery": [r"\bjquery\b"],
    "HTML/CSS": [r"\bhtml\s*[\/&]\s*css\b"],
    "Design Systems": [r"\bdesign\s+systems?\b"],
    "RxJS": [r"\brxjs\b"],
    "WebAssembly": [r"\bwebassembly\b", r"\bwasm\b"],

    # Backend & APIs
    "Node.js": [r"\bnode(?:\.js|js)?\b"],
    "Express": [r"\bexpress(?:\.js|js)?\b"],
    "Django": [r"\bdjango\b"],
    "FastAPI": [r"\bfastapi\b"],
    "Flask": [r"\bflask\b"],
    "Spring Boot": [r"\bspring[\s\-_]*boot\b", r"\bspring\s+framework\b"],
    ".NET Core": [r"\b\.net(?:\s*core)?\b", r"\basp\.net\b"],
    "Ruby on Rails": [r"\bruby\s*on\s*rails\b", r"\brails\b"],
    "Laravel": [r"\blaravel\b"],
    "GraphQL": [r"\bgraphql\b", r"\bapollo\b"],
    "REST API": [r"\brest(?:ful)?(?:\s*api[s]?)?\b"],
    "gRPC": [r"\bgrpc\b"],
    "WebSockets": [r"\bwebsockets?\b", r"\bsocket\.io\b"],
    "Microservices": [r"\bmicro[\s\-_]*services?\b"],
    "Distributed Systems": [r"\bdistributed\s+systems?\b"],
    "Celery": [r"\bcelery\b"],
    "Kafka": [r"\b(?:apache\s+)?kafka\b"],
    "RabbitMQ": [r"\brabbitmq\b"],

    # Databases & Storage
    "PostgreSQL": [r"\bpostgres(?:ql)?\b"],
    "MySQL": [r"\bmysql\b"],
    "MongoDB": [r"\bmongo(?:db)?\b"],
    "Redis": [r"\bredis\b"],
    "SQLite": [r"\bsqlite(?:3)?\b"],
    "SQL Server": [r"\b(?:ms[\s\-_]*)?sql[\s\-_]*server\b", r"\bmssql\b"],
    "Cassandra": [r"\bcassandra\b"],
    "DynamoDB": [r"\bdynamodb\b"],
    "Firebase": [r"\bfirebase\b", r"\bfirestore\b"],
    "Supabase": [r"\bsupabase\b"],
    "Prisma": [r"\bprisma\b"],
    "Snowflake": [r"\bsnowflake\b"],
    "Elasticsearch": [r"\belasticsearch\b", r"\belk\s+stack\b"],
    "Oracle": [
        r"\boracle\s+(?:database|db|sql|pl\/sql)\b",
        r"(?:^|[\s,;:\(\)\[\]/|])oracle(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:mysql|postgresql|mongodb|database|db|sql))"
    ],
    "Database Administration": [r"\bdatabase\s+administration\b"],

    # Cloud & DevOps
    "AWS": [r"\baws\b", r"\bamazon\s+web\s+services\b"],
    "AWS Lambda": [r"\baws\s+lambda\b", r"\blambda\s+functions?\b"],
    "Azure": [r"\b(?:microsoft\s+)?azure\b"],
    "GCP": [r"\bgcp\b", r"\bgoogle\s+cloud(?:\s+platform)?\b"],
    "Docker": [r"\bdocker\b", r"\bcontainerization\b"],
    "Kubernetes": [r"\bkubernetes\b", r"\bk8s\b"],
    "Terraform": [r"\bterraform\b"],
    "Ansible": [r"\bansible\b"],
    "CI/CD": [r"\bci[\s\/\-_]*cd\b", r"\bcontinuous\s+integration\b", r"\bcontinuous\s+deployment\b"],
    "GitHub Actions": [r"\bgithub\s+actions\b"],
    "Jenkins": [r"\bjenkins\b"],
    "Linux": [r"\blinux\b"],
    "Unix": [r"\bunix\b"],
    "Nginx": [r"\bnginx\b"],
    "Apache": [
        r"\bapache\s+(?:http|server|web\s*server)\b",
        r"(?:^|[\s,;:\(\)\[\]/|])apache(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:nginx|linux|tomcat))"
    ],
    "Helm": [r"\bhelm\s*(?:charts?)?\b"],
    "Prometheus": [r"\bprometheus\b"],
    "Grafana": [r"\bgrafana\b"],

    # AI, Machine Learning & Data
    "Machine Learning": [
        r"\bmachine\s+learning\b",
        r"(?:^|[\s,;:\(\)\[\]/|])ml(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:ai|dl|nlp|data|models))"
    ],
    "Deep Learning": [
        r"\bdeep\s+learning\b",
        r"(?:^|[\s,;:\(\)\[\]/|])dl(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:ml|ai|nlp))"
    ],
    "Artificial Intelligence": [
        r"\bartificial\s+intelligence\b",
        r"(?:^|[\s,;:\(\)\[\]/|])ai(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:ml|dl|nlp|models|systems))"
    ],
    "NLP": [r"\bnatural\s+language\s+processing\b", r"\bnlp\b"],
    "LLMs": [r"\blarge\s+language\s+models?\b", r"\bllm[s]?\b"],
    "Generative AI": [r"\bgenerative\s+ai\b", r"\bgen[\s\-_]*ai\b"],
    "RAG": [r"\brag\b", r"\bretrieval[\s\-_]*augmented\s+generation\b"],
    "LangChain": [r"\blangchain\b"],
    "HuggingFace": [r"\bhugging[\s\-_]*face\b"],
    "Vector Databases": [r"\bvector\s+(?:db[s]?|database[s]?)\b", r"\bpinecone\b", r"\bchromadb\b", r"\bweaviate\b", r"\bmilvus\b"],
    "PyTorch": [r"\bpytorch\b"],
    "TensorFlow": [r"\btensorflow\b", r"\btf\b(?=\s*[\/,]\s*(?:keras|pytorch))"],
    "Keras": [r"\bkeras\b"],
    "Scikit-Learn": [r"\bscikit[\s\-_]*learn\b", r"\bsklearn\b"],
    "OpenCV": [r"\bopencv\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Tableau": [r"\btableau\b"],
    "PowerBI": [r"\bpower[\s\-_]*bi\b"],
    "Excel": [r"\b(?:ms[\s\-_]*)?excel\b"],
    "Spark": [r"\b(?:apache\s+)?spark\b", r"\bpyspark\b"],
    "Airflow": [r"\b(?:apache\s+)?airflow\b"],
    "Data Analysis": [r"\bdata\s+analysis\b", r"\bdata\s+analytics\b"],
    "Statistics": [r"\bstatistics\b", r"\bstatistical\s+analysis\b"],
    "dbt": [r"\bdbt\b(?:\s+(?:data|models|tool|transform))?", r"(?:^|[\s,;:\(\)\[\]/|])dbt(?:$|[\s,;:\(\)\[\]/|])(?=\s*(?:,|/|\|)\s*(?:snowflake|bigquery|airflow|sql))"],

    # Testing & QA
    "Jest": [r"\bjest\b"],
    "Cypress": [r"\bcypress\b"],
    "Playwright": [r"\bplaywright\b"],
    "Selenium": [r"\bselenium\b"],
    "Pytest": [r"\bpytest\b"],
    "JUnit": [r"\bjunit\b"],
    "Postman": [r"\bpostman\b"],
    "JMeter": [r"\bjmeter\b"],
    "Gatling": [r"\bgatling\b"],
    "SonarQube": [r"\bsonarqube\b"],
    "QA Automation": [r"\bqa\s+automation\b", r"\btest\s+automation\b"],
    "Performance Testing": [r"\bperformance\s+testing\b"],

    # Mobile Development
    "React Native": [r"\breact[\s\-_]*native\b"],
    "Flutter": [r"\bflutter\b"],
    "Android": [r"\bandroid\b"],
    "iOS": [r"\bios\b"],
    "SwiftUI": [r"\bswiftui\b"],
    "Jetpack Compose": [r"\bjetpack\s+compose\b"],
    "Xcode": [r"\bxcode\b"],

    # Tools & Methodologies
    "Git": [r"\bgit\b(?!\s*(?:hub|lab))"],
    "GitHub": [r"\bgithub\b"],
    "GitLab": [r"\bgitlab\b"],
    "Bitbucket": [r"\bbitbucket\b"],
    "Jira": [r"\bjira\b"],
    "Confluence": [r"\bconfluence\b"],
    "Figma": [r"\bfigma\b"],
    "Agile": [r"\bagile\b(?:\s+(?:methodology|methodologies))?"],
    "Scrum": [r"\bscrum\b"],
    "Kanban": [r"\bkanban\b"],
    "Product Management": [r"\bproduct\s+management\b"],
    "Project Management": [r"\bproject\s+management\b"],
    "UI/UX": [r"\bui[\s\/\-_]*ux\b", r"\buser\s+interface\b", r"\buser\s+experience\b"],
    "User Research": [r"\buser\s+research\b"],

    # Cybersecurity & IT
    "Cybersecurity": [r"\bcyber[\s\-_]*security\b", r"\binformation\s+security\b"],
    "Penetration Testing": [r"\bpenetration\s+testing\b", r"\bpen[\s\-_]*testing\b"],
    "Network Security": [r"\bnetwork\s+security\b"],
    "Networking": [r"\bnetworking\b", r"\btcp\s*[\/]\s*ip\b"],
    "Wireshark": [r"\bwireshark\b"],
    "Burp Suite": [r"\bburp[\s\-_]*suite\b"],
    "Cryptography": [r"\bcryptography\b"],
    "Fraud Detection": [r"\bfraud\s+detection\b", r"\bfraud\s+analysis\b"],
    "Active Directory": [r"\bactive\s+directory\b"],
    "IT Support": [r"\bit\s+support\b", r"\btechnical\s+support\b"],
    "Incident Response": [r"\bincident\s+response\b"],

    # Soft Skills (matched strictly on explicit mentions only)
    "Problem Solving": [r"\bproblem[\s\-_]+solving\b"],
    "Communication": [r"\bcommunication(?:\s+skills)?\b"],
    "Teamwork": [r"\bteamwork\b", r"\bteam\s+work\b"],
    "Leadership": [r"\bleadership(?:\s+skills)?\b"],
    "Critical Thinking": [r"\bcritical\s+thinking\b"],
    "Time Management": [r"\btime\s+management\b"],
    "Adaptability": [r"\badaptability\b"],
    "Collaboration": [r"\bcollaboration\b"],
    "Mentorship": [r"\bmentorship\b"],
    "Analytical Thinking": [r"\banalytical\s+(?:thinking|skills?)\b"],
    "Negotiation": [r"\bnegotiation(?:\s+skills)?\b"],
    "Conflict Resolution": [r"\bconflict\s+resolution\b"],
    "Interpersonal Skills": [r"\binterpersonal\s+skills?\b"]
}

# Reverse mapping from canonical skill to its category
SKILL_TO_CATEGORY = {}
for cat, skills in SKILL_TAXONOMY.items():
    for s in skills:
        SKILL_TO_CATEGORY[s] = cat

# Explicit canonical alias and shorthand mapping
SKILL_ALIASES = {
    # TypeScript
    "ts": "TypeScript",
    "tsx": "TypeScript",
    "type script": "TypeScript",
    "typescript.js": "TypeScript",
    
    # Tailwind CSS
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "tailwind.css": "Tailwind CSS",
    "tailwind-css": "Tailwind CSS",
    "tailwind css": "Tailwind CSS",
    
    # JavaScript
    "js": "JavaScript",
    "javascript.js": "JavaScript",
    
    # Frameworks & Libraries
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "vuejs": "Vue.js",
    "vue.js": "Vue.js",
    "angularjs": "Angular",
    "expressjs": "Express",
    "express.js": "Express",
    
    # Databases
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    
    # DevOps & Languages
    "k8s": "Kubernetes",
    "golang": "Go",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#"
}

def normalize_text_for_extraction(text: str) -> str:
    """Pre-processes resume text for high-fidelity extraction without losing technical symbols."""
    if not text:
        return ""
    # Normalize unicode spaces, zero-width spaces, and quotes
    text = text.replace('\xa0', ' ').replace('\u200b', ' ').replace('\ufeff', ' ')
    text = text.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")
    
    # Protect special tech compounds with slashes/pluses/hashes
    text = re.sub(r'\bc\s*/\s*c\+\+', ' C_AND_CPP ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bci\s*/\s*cd\b', ' CI_CD ', text, flags=re.IGNORECASE)
    text = re.sub(r'\btcp\s*/\s*ip\b', ' TCP_IP ', text, flags=re.IGNORECASE)
    text = re.sub(r'\bui\s*/\s*ux\b', ' UI_UX ', text, flags=re.IGNORECASE)
    
    # Convert bullet points, pipes, asterisks, and tildes into comma delimiters
    text = re.sub(r'[\u2022\u25cf\u25aa\u25ab\u25b8\u25ba\u2023\u2043\u2219▪▫•·✦★■◆|~]', ' , ', text)
    
    # Separate slashes between words (e.g. React/Node.js -> React / Node.js)
    text = re.sub(r'([a-zA-Z0-9\+\#])\/([a-zA-Z0-9\+\#])', r'\1 / \2', text)
    
    # Restore protected compounds
    text = text.replace('C_AND_CPP', 'C , C++').replace('CI_CD', 'CI/CD').replace('TCP_IP', 'TCP/IP').replace('UI_UX', 'UI/UX')
    
    return text

def extract_skills_from_text(text: str) -> dict:
    """
    Extracts canonical skills from resume text using precision regex matching
    and section-aware parsing.
    
    STRICT RULES:
    - Extracts skills ONLY when explicitly mentioned in the resume text.
    - No inference from job titles, companies, degree names, or industry standards.
    - If no skills are found, returns an empty list.
    - Returns deduplicated canonical skill names.
    """
    if not text or len(text.strip()) < 3:
        return {
            "extracted_skills": [],
            "all_skills": [],
            "skills_by_category": {},
            "by_category": {},
            "total_count": 0
        }

    norm_text = normalize_text_for_extraction(text)
    extracted_set = set()
    skills_by_cat = {}

    # 1. Pattern Matching across Normalized Text (Whole Resume: Summary, Experience, Projects, Skills)
    for canonical_name, patterns in SKILL_PATTERNS.items():
        matched = False
        for pat in patterns:
            if re.search(pat, norm_text, flags=re.IGNORECASE):
                matched = True
                break
        if matched:
            extracted_set.add(canonical_name)

    # 2. Section-Aware Extraction across All Skills/Competencies/Technologies sections
    section_headers = (
        r'(?:technical\s+skills|programming\s+languages|languages|frameworks(?:\s*&\s*libraries)?|'
        r'libraries|databases|tools(?:\s*&\s*platforms)?|technologies|core\s+competencies|'
        r'soft\s+skills|skills\s*(?:&|and)?\s*(?:competencies|technologies)?)'
    )
    section_pattern = rf'{section_headers}\s*[:\n\r](.*?)(?=\n\s*(?:education|work\s+experience|experience|projects|publications|certifications|awards|summary|{section_headers})|\Z)'
    
    for m in re.finditer(section_pattern, norm_text, flags=re.IGNORECASE | re.DOTALL):
        section_text = m.group(1)
        tokens = [t.strip().strip('.,;:') for t in re.split(r'[,:\n\r\(\)\[\]/|]+', section_text) if t.strip()]
        for tok in tokens:
            tok_clean = tok.strip()
            # 1. Alias lookup first
            alias_match = SKILL_ALIASES.get(tok_clean.lower())
            if alias_match:
                extracted_set.add(alias_match)
                continue
            # 2. Direct match against canonical names
            for cat, skill_list in SKILL_TAXONOMY.items():
                for s in skill_list:
                    if tok_clean.lower() == s.lower():
                        extracted_set.add(s)

    # 3. Categorize extracted skills
    for skill in extracted_set:
        cat = SKILL_TO_CATEGORY.get(skill, "Other Technical Skills")
        if cat not in skills_by_cat:
            skills_by_cat[cat] = []
        skills_by_cat[cat].append(skill)

    # Sort categories and skill items
    for cat in skills_by_cat:
        skills_by_cat[cat] = sorted(skills_by_cat[cat])

    extracted_list = sorted(list(extracted_set))

    return {
        "extracted_skills": extracted_list,
        "all_skills": extracted_list,
        "skills_by_category": skills_by_cat,
        "by_category": skills_by_cat,
        "total_count": len(extracted_list)
    }
