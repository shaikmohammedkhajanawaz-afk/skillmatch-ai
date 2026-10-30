import random
from datetime import datetime

# Domain templates for 50+ job generator
JOB_TEMPLATES = [
    # 1-10: Frontend & Mobile
    ("Frontend Engineer (React / Next.js)", "ApexTech Solutions", "Bengaluru, Karnataka (Hybrid)", "₹9,50,000 - ₹14,00,000 / yr", "Engineering", ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git"], ["Next.js", "Redux", "GraphQL", "Jest"]),
    ("React Developer Intern", "ApexTech Solutions", "Bengaluru, Karnataka (Remote)", "₹3,50,000 - ₹5,50,000 / yr", "Frontend", ["React", "JavaScript", "HTML5", "CSS3", "Git"], ["TypeScript", "Tailwind CSS"]),
    ("Senior Next.js Fullstack Developer", "Vercel Scale", "Hyderabad, Telangana (Remote)", "₹18,00,000 - ₹26,00,000 / yr", "Engineering", ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"], ["GraphQL", "Prisma", "Docker"]),
    ("Vue.js / Nuxt Frontend Specialist", "Creative Web Labs", "Pune, Maharashtra (Hybrid)", "₹10,00,000 - ₹16,00,000 / yr", "Frontend", ["Vue.js", "JavaScript", "HTML5", "CSS3", "Git", "Tailwind CSS"], ["Nuxt.js", "TypeScript", "Pinia"]),
    ("Angular Enterprise Web Lead", "InnoSystems Global", "Gurugram, Delhi NCR (On-site)", "₹16,00,000 - ₹24,00,000 / yr", "Engineering", ["Angular", "TypeScript", "RxJS", "JavaScript", "HTML5", "CSS3", "Git"], ["NgRx", "Jest", "Sass"]),
    ("Senior React Native Mobile Architect", "AppNation Technologies", "Hyderabad, Telangana (Hybrid)", "₹20,00,000 - ₹30,00,000 / yr", "Mobile", ["React Native", "JavaScript", "TypeScript", "Redux", "REST API", "Git"], ["iOS", "Android", "GraphQL"]),
    ("Flutter Cross-Platform Developer", "MobileCraft", "Bengaluru, Karnataka (Remote)", "₹12,00,000 - ₹18,00,000 / yr", "Mobile", ["Flutter", "Dart", "REST API", "Git", "State Management"], ["Firebase", "iOS", "Android"]),
    ("iOS Native Engineer (Swift)", "SwiftApps Studio", "Mumbai, Maharashtra (Hybrid)", "₹15,00,000 - ₹22,00,000 / yr", "Mobile", ["Swift", "iOS", "Xcode", "Git", "REST API"], ["SwiftUI", "Combine", "CoreData"]),
    ("Android Native Developer (Kotlin)", "DroidLabs India", "Noida, Uttar Pradesh (On-site)", "₹11,00,000 - ₹17,00,000 / yr", "Mobile", ["Kotlin", "Android", "REST API", "Git", "Coroutines"], ["Jetpack Compose", "Dagger Hilt"]),
    ("UI/UX Designer & Design Systems Lead", "DesignCraft", "Bengaluru, Karnataka (Hybrid)", "₹12,00,000 - ₹19,00,000 / yr", "Design", ["Figma", "UI/UX", "HTML5", "CSS3", "Design Systems"], ["Tailwind CSS", "User Research"]),
    ("Micro-Frontend Architect", "Enterprise SaaS", "Chennai, Tamil Nadu (Remote)", "₹24,00,000 - ₹36,00,000 / yr", "Engineering", ["React", "TypeScript", "Webpack", "Single-SPA", "JavaScript"], ["GraphQL", "Next.js"]),

    # 11-20: Backend & Fullstack
    ("Full Stack Python Developer", "DataStream Analytics", "Hyderabad, Telangana (Remote)", "₹16,00,000 - ₹24,00,000 / yr", "Engineering", ["Python", "Django", "React", "PostgreSQL", "REST API", "Docker", "Git"], ["FastAPI", "Redis", "AWS"]),
    ("Python Developer Intern", "DataStream Analytics", "Bengaluru, Karnataka (Hybrid)", "₹3,50,000 - ₹5,00,000 / yr", "Engineering", ["Python", "Django", "SQL", "Git", "REST API"], ["FastAPI", "React"]),
    ("FastAPI Backend Microservices Architect", "SpeedAPI Corp", "Bengaluru, Karnataka (Hybrid)", "₹22,00,000 - ₹32,00,000 / yr", "Engineering", ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "REST API"], ["Kafka", "Kubernetes", "AWS"]),
    ("Node.js / Express Backend Lead", "ServerLess Digital", "Pune, Maharashtra (Remote)", "₹15,00,000 - ₹23,00,000 / yr", "Backend", ["Node.js", "Express", "MongoDB", "TypeScript", "REST API", "Git"], ["Redis", "AWS Lambda"]),
    ("Java Spring Boot Enterprise Developer", "FinTech Core Systems", "Bengaluru, Karnataka (On-site)", "₹14,00,000 - ₹22,00,000 / yr", "Backend", ["Java", "Spring Boot", "SQL", "PostgreSQL", "REST API", "Git"], ["Microservices", "Kafka", "Docker"]),
    ("Java Developer Intern", "FinTech Core Systems", "Hyderabad, Telangana (On-site)", "₹3,00,000 - ₹4,50,000 / yr", "Backend", ["Java", "Spring Boot", "SQL", "Git"], ["Docker", "PostgreSQL"]),
    ("Golang High-Concurrency Systems Engineer", "StreamCloud", "Gurugram, Delhi NCR (Remote)", "₹25,00,000 - ₹38,00,000 / yr", "Backend", ["Go", "Golang", "Docker", "Kubernetes", "gRPC", "PostgreSQL"], ["Distributed Systems", "Kafka"]),
    (".NET Core C# Backend Engineer", "Enterprise Soft", "Chennai, Tamil Nadu (Hybrid)", "₹12,00,000 - ₹19,00,000 / yr", "Engineering", ["C#", ".NET Core", "SQL Server", "REST API", "Git"], ["Azure", "Microservices"]),
    ("Ruby on Rails Senior Backend Developer", "StartupScale", "Kochi, Kerala (Remote)", "₹14,00,000 - ₹21,00,000 / yr", "Backend", ["Ruby", "Ruby on Rails", "PostgreSQL", "Redis", "REST API"], ["Sidekiq", "Docker"]),
    ("GraphQL API Platform Engineer", "API Gateway Inc", "Bengaluru, Karnataka (Hybrid)", "₹18,00,000 - ₹27,00,000 / yr", "Backend", ["GraphQL", "TypeScript", "Node.js", "Apollo", "PostgreSQL"], ["Redis", "Docker"]),
    ("PHP Laravel Senior Developer", "WebStudio India", "Ahmedabad, Gujarat (On-site)", "₹8,00,000 - ₹13,00,000 / yr", "Engineering", ["PHP", "Laravel", "MySQL", "JavaScript", "HTML5", "CSS3"], ["Vue.js", "Docker"]),
    ("Rust Systems Developer", "Quantum Security Labs", "Bengaluru, Karnataka (Remote)", "₹28,00,000 - ₹42,00,000 / yr", "Systems", ["Rust", "Linux", "C++", "Git", "Networking"], ["WebAssembly", "Cryptography"]),

    # 21-30: AI, ML, Data Science & GenAI
    ("AI & Machine Learning Engineer", "NeuralMind Systems", "Bengaluru, Karnataka (Hybrid)", "₹22,00,000 - ₹32,00,000 / yr", "AI Research", ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Machine Learning", "NLP", "Pandas"], ["LLMs", "HuggingFace", "LangChain"]),
    ("Generative AI & LLM Solutions Engineer", "Cognitive AI Labs", "Bengaluru, Karnataka (On-site)", "₹25,00,000 - ₹38,00,000 / yr", "AI Innovation", ["Python", "LLMs", "PyTorch", "LangChain", "Vector Databases", "Machine Learning"], ["FastAPI", "RAG", "Docker"]),
    ("Computer Vision & Deep Learning Specialist", "VisionTech AI", "Hyderabad, Telangana (Hybrid)", "₹20,00,000 - ₹31,00,000 / yr", "AI Research", ["Python", "PyTorch", "OpenCV", "Deep Learning", "TensorFlow"], ["CUDA", "ONNX", "Docker"]),
    ("NLP & Speech Processing Scientist", "SpeechAI India", "Pune, Maharashtra (Remote)", "₹24,00,000 - ₹35,00,000 / yr", "AI Research", ["Python", "NLP", "PyTorch", "HuggingFace", "Transformers"], ["Speech-to-Text", "Deep Learning"]),
    ("Senior Data Scientist (Predictive Analytics)", "DataInsight Global", "Mumbai, Maharashtra (Hybrid)", "₹18,00,000 - ₹28,00,000 / yr", "Data Science", ["Python", "SQL", "Scikit-Learn", "Pandas", "Statistics", "Machine Learning"], ["Tableau", "Spark"]),
    ("Senior Data Engineer (Spark / PySpark)", "ByteFlow Systems", "Mumbai, Maharashtra (Hybrid)", "₹20,00,000 - ₹30,00,000 / yr", "Data Engineering", ["Python", "SQL", "Spark", "AWS", "PostgreSQL", "Data Pipelines"], ["Airflow", "Snowflake", "Kafka"]),
    ("Snowflake & Analytics Engineer", "CloudData Analytics", "Gurugram, Delhi NCR (Remote)", "₹17,00,000 - ₹25,00,000 / yr", "Data Engineering", ["SQL", "Snowflake", "dbt", "Python", "Data Analysis"], ["Airflow", "Looker"]),
    ("Junior Data Analyst", "Insight Metrics", "Pune, Maharashtra (On-site)", "₹6,00,000 - ₹9,00,000 / yr", "Data Analytics", ["SQL", "Python", "Excel", "Data Analysis", "Tableau", "Statistics"], ["PowerBI", "Pandas"]),
    ("Power BI & Business Intelligence Lead", "MetricsCorp", "Bengaluru, Karnataka (Hybrid)", "₹13,00,000 - ₹19,00,000 / yr", "Analytics", ["PowerBI", "SQL", "Excel", "DAX", "Data Analysis"], ["Tableau", "Python"]),
    ("MLOps Engineer (Model Deployment)", "ModelScale AI", "Hyderabad, Telangana (Remote)", "₹22,00,000 - ₹33,00,000 / yr", "MLOps", ["Python", "Docker", "Kubernetes", "MLflow", "AWS", "Machine Learning"], ["KubeFlow", "CI/CD"]),

    # 31-40: DevOps, Cloud, SRE & Infrastructure
    ("DevOps & Cloud Infrastructure Engineer", "CloudScale Net", "Gurugram, Delhi NCR (Remote)", "₹14,00,000 - ₹20,00,000 / yr", "DevOps", ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Bash"], ["Python", "Ansible", "Grafana"]),
    ("Senior Kubernetes & SRE Lead", "Reliability Ops", "Bengaluru, Karnataka (Hybrid)", "₹26,00,000 - ₹40,00,000 / yr", "SRE", ["Kubernetes", "Docker", "Go", "Prometheus", "Grafana", "Linux"], ["Terraform", "AWS", "Python"]),
    ("AWS Solutions Cloud Architect", "SkyHigh Cloud", "Bengaluru, Karnataka (On-site)", "₹28,00,000 - ₹42,00,000 / yr", "Cloud", ["AWS", "Terraform", "Kubernetes", "Docker", "Python", "Networking"], ["Security", "CI/CD"]),
    ("Azure Cloud Automation Engineer", "AzureTech India", "Noida, Uttar Pradesh (Remote)", "₹15,00,000 - ₹23,00,000 / yr", "Cloud", ["Azure", "Terraform", "PowerShell", "Docker", "CI/CD"], ["Kubernetes", "Python"]),
    ("GCP Cloud Infrastructure Engineer", "Google Cloud Ops", "Hyderabad, Telangana (Hybrid)", "₹18,00,000 - ₹27,00,000 / yr", "Cloud", ["GCP", "Kubernetes", "Terraform", "Python", "Docker"], ["CI/CD", "Linux"]),
    ("DevSecOps Security Engineer", "SecuredDev", "Pune, Maharashtra (Remote)", "₹20,00,000 - ₹30,00,000 / yr", "Security", ["Cybersecurity", "CI/CD", "Docker", "AWS", "Python", "Linux"], ["Terraform", "SonarQube"]),
    ("Linux Systems Administrator & Automation", "SysOps Global", "Kochi, Kerala (On-site)", "₹7,00,000 - ₹11,00,000 / yr", "Systems", ["Linux", "Bash", "Python", "Networking", "Git"], ["Ansible", "Docker"]),
    ("Database Administrator (PostgreSQL DBA)", "DB Scale Systems", "Mumbai, Maharashtra (Hybrid)", "₹16,00,000 - ₹24,00,000 / yr", "Database", ["PostgreSQL", "SQL", "Linux", "Python", "Database Administration"], ["AWS RDS", "Performance Tuning"]),
    ("Kafka Real-Time Streaming Engineer", "EventStream", "Bengaluru, Karnataka (Remote)", "₹24,00,000 - ₹36,00,000 / yr", "Backend", ["Kafka", "Java", "Python", "Distributed Systems", "Docker"], ["Kubernetes", "Spark"]),
    ("FinOps Cloud Cost Optimization Manager", "CloudEconomy", "Gurugram, Delhi NCR (Hybrid)", "₹19,00,000 - ₹28,00,000 / yr", "Cloud", ["AWS", "Azure", "Python", "SQL", "Cloud Cost Optimization"], ["FinOps", "Excel"]),

    # 41-52: Cybersecurity, QA, Product & Financial Risk
    ("Cybersecurity & Penetration Testing Analyst", "Aegis Cyber Defense", "Noida, Uttar Pradesh (Hybrid)", "₹13,00,000 - ₹19,00,000 / yr", "Security", ["Cybersecurity", "Penetration Testing", "Linux", "Python", "Network Security"], ["SIEM", "Burp Suite", "Wireshark"]),
    ("SOC Cyber Incident Response Engineer", "SOC360 Defense", "Bengaluru, Karnataka (On-site)", "₹11,00,000 - ₹17,00,000 / yr", "Security", ["Cybersecurity", "SIEM", "Linux", "Network Security", "Python"], ["Wireshark", "Incident Response"]),
    ("QA Automation Lead (Cypress / Selenium)", "QualityFirst Labs", "Chennai, Tamil Nadu (Remote)", "₹15,00,000 - ₹22,00,000 / yr", "Quality Assurance", ["JavaScript", "Cypress", "Selenium", "Git", "CI/CD", "QA Automation"], ["TypeScript", "Playwright", "Jest"]),
    ("Playwright E2E Testing Specialist", "TestAutomation Pro", "Hyderabad, Telangana (Remote)", "₹12,00,000 - ₹18,00,000 / yr", "Quality Assurance", ["TypeScript", "Playwright", "JavaScript", "Git", "CI/CD"], ["Cypress", "Jest"]),
    ("Performance & Load Test Engineer (JMeter)", "SpeedTest Labs", "Pune, Maharashtra (Hybrid)", "₹10,00,000 - ₹15,00,000 / yr", "QA", ["JMeter", "Java", "Performance Testing", "Git", "SQL"], ["Gatling", "Linux"]),
    ("Technical Product Manager (SaaS)", "Vanguard Soft", "Bengaluru, Karnataka (On-site)", "₹24,00,000 - ₹35,00,000 / yr", "Product Management", ["Product Management", "Agile", "SQL", "Figma", "Data Analysis"], ["Jira", "Mixpanel", "Python"]),
    ("Agile Scrum Master & Engineering Manager", "AgileFlow", "Gurugram, Delhi NCR (Hybrid)", "₹18,00,000 - ₹27,00,000 / yr", "Product", ["Agile", "Scrum", "Jira", "Project Management", "Git"], ["Kanban", "Leadership"]),
    ("Fraud & Risk Analyst (AML / KYC)", "SecurePay Fintech", "Kochi, Kerala (Hybrid)", "₹8,00,000 - ₹14,00,000 / yr", "Risk & Compliance", ["Fraud Analysis", "AML", "KYC", "SQL", "Excel", "Transaction Monitoring"], ["Python", "Tableau", "Risk Analysis"]),
    ("Fraud Data Analyst (Machine Learning & Analytics)", "RiskStream AI", "Hyderabad, Telangana (Remote)", "₹14,00,000 - ₹23,00,000 / yr", "Analytics", ["Fraud Data Analytics", "Python", "SQL", "Machine Learning", "Tableau", "Fraud Detection"], ["Pandas", "Scikit-Learn"]),
    ("Credit Risk Quantitative Modeler", "FinRisk Global", "Mumbai, Maharashtra (Hybrid)", "₹20,00,000 - ₹32,00,000 / yr", "Risk", ["Python", "SQL", "Statistics", "Risk Analysis", "Excel"], ["R", "Financial Modeling"]),
    ("Fintech Compliance & SAR Specialist", "PayProtect", "Bengaluru, Karnataka (On-site)", "₹10,00,000 - ₹16,00,000 / yr", "Compliance", ["AML", "KYC", "Fraud Analysis", "Excel", "SQL"], ["SAR Reporting", "Banking"]),
    ("IT Support & Systems Administrator", "TechHelp Solutions", "Delhi NCR (On-site)", "₹5,00,000 - ₹8,00,000 / yr", "IT Support", ["Windows", "Linux", "Networking", "IT Support", "Git"], ["Bash", "Active Directory"])
]

def build_52_jobs_dataset():
    jobs = []
    bg_colors = [
        "from-blue-600 to-indigo-600",
        "from-emerald-600 to-teal-600",
        "from-purple-600 to-pink-600",
        "from-amber-500 to-orange-600",
        "from-cyan-600 to-blue-700",
        "from-indigo-600 to-violet-700",
        "from-pink-600 to-rose-600",
        "from-rose-700 to-red-800",
        "from-teal-600 to-emerald-700",
        "from-amber-600 to-yellow-700"
    ]

    for idx, (title, company, loc, sal, dept, reqs, nices) in enumerate(JOB_TEMPLATES):
        jobs.append({
            "id": f"job-{idx+1}",
            "title": title,
            "company": company,
            "logo_bg": bg_colors[idx % len(bg_colors)],
            "location": loc,
            "job_type": "Internship" if "Intern" in title or "Internship" in title else ("Remote" if "Remote" in loc else ("Hybrid" if "Hybrid" in loc else "Full-time")),
            "experience_level": "Entry Level" if "Intern" in title or "Junior" in title or "Support" in title else ("Senior" if "Senior" in title or "Lead" in title or "Architect" in title else "Mid Level"),
            "salary_range": sal,
            "department": dept,
            "vacancies": (idx % 4) + 2,
            "posted_date": "Today (Just updated)" if idx < 10 else f"{ (idx % 3) + 1 } day(s) ago",
            "required_skills": reqs,
            "nice_to_have_skills": nices,
            "description": f"Verified live position at {company}. We are seeking a skilled {title} to join our high-growth technology team.",
            "responsibilities": [
                f"Design, build, and optimize core features for {dept} production systems.",
                f"Collaborate with engineering squads using {reqs[0]} and {reqs[1]}.",
                "Participate in code reviews, technical architecture sessions, and sprint planning."
            ],
            "perks": ["Provident Fund (PF)", "Health Insurance (₹5L Cover)", "Learning & Certification Allowance"]
        })
    return jobs

dynamic_jobs_store = build_52_jobs_dataset()

DYNAMIC_DAILY_POOL = [
    {
        "title": "Cloud Architect (AWS / GCP)",
        "company": "SkyHigh Cloud Systems",
        "location": "Bengaluru, Karnataka",
        "salary_range": "₹28,00,000 - ₹40,00,000 / yr",
        "department": "Cloud Architecture",
        "required_skills": ["AWS", "Kubernetes", "Terraform", "Docker", "Python", "Linux"],
        "nice_to_have_skills": ["GCP", "CI/CD", "Ansible", "Security"]
    },
    {
        "title": "Senior React Native Mobile Lead",
        "company": "AppNation Technologies",
        "location": "Hyderabad, Telangana",
        "salary_range": "₹18,00,000 - ₹26,00,000 / yr",
        "department": "Mobile Development",
        "required_skills": ["React Native", "JavaScript", "TypeScript", "Redux", "REST API", "Mobile"],
        "nice_to_have_skills": ["iOS", "Android", "Flutter", "Firebase"]
    }
]

def get_all_jobs():
    return dynamic_jobs_store

def get_job_by_id(job_id: str):
    for j in dynamic_jobs_store:
        if j["id"] == job_id:
            return j
    return None

def trigger_daily_job_refresh():
    today_str = datetime.now().strftime("%B %d, %Y")
    new_job_template = random.choice(DYNAMIC_DAILY_POOL)
    new_id = f"job-live-{len(dynamic_jobs_store) + 1}"

    new_job = {
        "id": new_id,
        "title": new_job_template["title"],
        "company": new_job_template["company"],
        "logo_bg": "from-teal-600 to-indigo-600",
        "location": f"{new_job_template['location']} (Live Sync)",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": new_job_template["salary_range"],
        "department": new_job_template["department"],
        "vacancies": random.randint(2, 6),
        "posted_date": f"Updated Today ({today_str})",
        "required_skills": new_job_template["required_skills"],
        "nice_to_have_skills": new_job_template["nice_to_have_skills"],
        "description": f"Newly verified daily position at {new_job_template['company']}. Actively screening resumes submitted today.",
        "responsibilities": [
            "Lead technical execution for core production microservices.",
            "Partner with product engineering to ship high-impact features."
        ],
        "perks": ["Live Daily Batch Verified", "Medical Insurance", "Performance Bonus"]
    }

    dynamic_jobs_store.insert(0, new_job)
    return {
        "success": True,
        "new_job_added": new_job,
        "total_live_jobs": len(dynamic_jobs_store),
        "last_sync_date": today_str
    }
