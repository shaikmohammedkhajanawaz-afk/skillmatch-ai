import html

def generate_portfolio_html(user_data: dict, template_style: str = "modern_tech") -> str:
    """
    Generates a single-page, standalone, production-ready HTML/CSS portfolio website with rich CSS animations & transitions.
    Supports styles: 'modern_tech', 'creative', 'terminal', 'executive', 'futuristic_3d'
    """
    name = html.escape(user_data.get("name", "Alex Rivera"))
    title = html.escape(user_data.get("title", "Full Stack Software Engineer"))
    bio = html.escape(user_data.get("bio", "Passionate developer building high-performance web applications, AI tools, and accessible user interfaces."))
    email = html.escape(user_data.get("email", "alex.rivera@example.com"))
    phone = html.escape(user_data.get("phone", "+91 98765 43210"))
    location = html.escape(user_data.get("location", "Bengaluru, Karnataka"))
    github = html.escape(user_data.get("github", "https://github.com"))
    linkedin = html.escape(user_data.get("linkedin", "https://linkedin.com"))
    avatar = user_data.get("avatar", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80")

    skills = user_data.get("skills", ["React", "Python", "TypeScript", "SQL", "Tailwind CSS", "Node.js", "Docker", "Git"])
    projects = user_data.get("projects", [
        {
            "title": "Skill Match AI - Smart Job Finder",
            "description": "AI-powered job matching and resume parser application built with React, Python Flask, and NLP skill extraction.",
            "tech": ["React", "Python", "Flask", "Tailwind CSS"],
            "link": "#"
        },
        {
            "title": "Real-time Telemetry Dashboard",
            "description": "High-frequency streaming data visualization platform with microservices architecture.",
            "tech": ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
            "link": "#"
        }
    ])
    experience = user_data.get("experience", [
        {
            "role": "Senior Frontend Engineer",
            "company": "TechSphere Systems",
            "period": "2023 - Present",
            "description": "Led architectural migration of enterprise dashboard to React 18, improving LCP speed by 40%."
        }
    ])

    skills_chips_html = "".join([f'<span class="skill-chip">{html.escape(s)}</span>' for s in skills])

    projects_html = ""
    for p in projects:
        p_tech = "".join([f'<span class="tech-tag">{html.escape(t)}</span>' for t in p.get("tech", [])])
        projects_html += f"""
        <div class="card project-card">
            <h3>{html.escape(p.get('title', ''))}</h3>
            <p>{html.escape(p.get('description', ''))}</p>
            <div class="tech-stack">{p_tech}</div>
            <a href="{html.escape(p.get('link', '#'))}" target="_blank" class="btn-link">View Project →</a>
        </div>
        """

    exp_html = ""
    for e in experience:
        exp_html += f"""
        <div class="timeline-item">
            <div class="timeline-header">
                <h4>{html.escape(e.get('role', ''))} <span class="company">@ {html.escape(e.get('company', ''))}</span></h4>
                <span class="period">{html.escape(e.get('period', ''))}</span>
            </div>
            <p>{html.escape(e.get('description', ''))}</p>
        </div>
        """

    # Theme Configuration & Colors
    theme_bg = "#0b0f19"
    theme_card = "#111827"
    theme_accent = "#6366f1"
    theme_text = "#f3f4f6"
    theme_glow = "rgba(99, 102, 241, 0.4)"
    gradient_text = "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)"
    font_family = "'Plus Jakarta Sans', sans-serif"

    if template_style == "creative":
        theme_accent = "#10b981"
        theme_glow = "rgba(16, 185, 129, 0.4)"
        gradient_text = "linear-gradient(135deg, #34d399 0%, #059669 50%, #06b6d4 100%)"
    elif template_style == "terminal":
        theme_bg = "#0d1117"
        theme_card = "#161b22"
        theme_accent = "#38bdf8"
        theme_glow = "rgba(56, 189, 248, 0.4)"
        gradient_text = "linear-gradient(135deg, #38bdf8 0%, #4ade80 100%)"
        font_family = "'Fira Code', monospace"
    elif template_style == "executive":
        theme_bg = "#0f172a"
        theme_card = "#1e293b"
        theme_accent = "#818cf8"
        theme_glow = "rgba(129, 140, 248, 0.3)"
        gradient_text = "linear-gradient(135deg, #93c5fd 0%, #c084fc 100%)"
    elif template_style == "futuristic_3d":
        theme_bg = "#090d16"
        theme_card = "#131b2e"
        theme_accent = "#f43f5e"
        theme_glow = "rgba(244, 63, 94, 0.5)"
        gradient_text = "linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #a855f7 100%)"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: {font_family};
            background-color: {theme_bg};
            color: {theme_text};
            line-height: 1.6;
            overflow-x: hidden;
            animation: fadeInPage 0.8s ease-out forwards;
        }}

        @keyframes fadeInPage {{
            from {{ opacity: 0; transform: translateY(10px); }}
            to {{ opacity: 1; transform: translateY(0); }}
        }}

        @keyframes floatAvatar {{
            0%, 100% {{ transform: translateY(0px) rotate(0deg); }}
            50% {{ transform: translateY(-8px) rotate(2deg); }}
        }}

        .container {{ max-width: 1050px; margin: 0 auto; padding: 40px 20px; }}
        
        header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
            padding: 50px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            position: relative;
        }}

        .hero-text h1 {{
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -1px;
            margin-bottom: 8px;
            line-height: 1.1;
        }}

        .hero-text h1 span {{
            background: {gradient_text};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}

        .hero-text h2 {{ font-size: 1.25rem; color: #9ca3af; font-weight: 600; margin-bottom: 15px; }}
        .hero-text p {{ font-size: 0.95rem; color: #d1d5db; max-width: 600px; margin-bottom: 24px; }}

        .avatar-wrapper {{
            position: relative;
            animation: floatAvatar 6s ease-in-out infinite;
        }}

        .avatar {{
            width: 140px;
            height: 140px;
            border-radius: 28px;
            object-fit: cover;
            border: 3px solid {theme_accent};
            box-shadow: 0 0 25px {theme_glow};
            transition: all 0.4s ease;
        }}

        .avatar-wrapper:hover .avatar {{
            transform: scale(1.06) rotate(-3deg);
            box-shadow: 0 0 40px {theme_glow};
        }}

        .social-links {{ display: flex; gap: 12px; flex-wrap: wrap; }}
        .social-links a {{
            padding: 10px 20px;
            background: {theme_card};
            color: #fff;
            text-decoration: none;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 700;
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }}

        .social-links a:hover {{
            background: {theme_accent};
            border-color: {theme_accent};
            transform: translateY(-4px);
            box-shadow: 0 8px 20px {theme_glow};
        }}

        section {{ margin: 55px 0; }}
        section h2 {{
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 24px;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
        }}

        section h2::before {{
            content: '';
            display: inline-block;
            width: 6px;
            height: 24px;
            background: {theme_accent};
            border-radius: 3px;
        }}

        .skills-grid {{ display: flex; flex-wrap: wrap; gap: 10px; }}
        .skill-chip {{
            padding: 8px 18px;
            background: {theme_card};
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 14px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #e0e7ff;
            transition: all 0.3s ease;
            cursor: default;
        }}

        .skill-chip:hover {{
            border-color: {theme_accent};
            background: rgba(255,255,255,0.05);
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 5px 15px {theme_glow};
        }}

        .projects-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 24px; }}
        .card {{
            background: {theme_card};
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 28px;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }}

        .project-card:hover {{
            border-color: {theme_accent};
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.4), 0 0 25px {theme_glow};
        }}

        .card h3 {{ font-size: 1.2rem; color: #fff; margin-bottom: 10px; font-weight: 700; }}
        .card p {{ font-size: 0.88rem; color: #9ca3af; margin-bottom: 18px; line-height: 1.6; }}
        .tech-stack {{ display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }}
        .tech-tag {{
            font-size: 0.75rem;
            padding: 4px 10px;
            background: rgba(99, 102, 241, 0.15);
            color: {theme_accent};
            border-radius: 8px;
            font-weight: 700;
            border: 1px solid rgba(255,255,255,0.05);
        }}

        .btn-link {{
            text-decoration: none;
            font-size: 0.88rem;
            font-weight: 800;
            color: {theme_accent};
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: gap 0.2s ease;
        }}

        .btn-link:hover {{ gap: 8px; text-decoration: underline; }}

        .timeline-item {{
            background: {theme_card};
            border-radius: 18px;
            padding: 24px;
            margin-bottom: 18px;
            border: 1px solid rgba(255,255,255,0.08);
            transition: all 0.3s ease;
        }}

        .timeline-item:hover {{
            border-color: {theme_accent};
            transform: translateX(6px);
        }}

        .timeline-header {{ display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }}
        .timeline-header h4 {{ font-size: 1.05rem; color: #fff; font-weight: 700; }}
        .timeline-header .company {{ color: {theme_accent}; font-weight: 700; }}
        .timeline-header .period {{ font-size: 0.82rem; color: #9ca3af; font-weight: 600; }}

        footer {{
            text-align: center;
            padding: 40px 0;
            border-top: 1px solid rgba(255,255,255,0.08);
            font-size: 0.85rem;
            color: #6b7280;
        }}

        @media (max-width: 768px) {{
            header {{ flex-direction: column-reverse; text-align: center; text-align: -webkit-center; }}
            .social-links {{ justify-content: center; }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="hero-text">
                <h1>Hi, I'm <span>{name}</span></h1>
                <h2>{title} • {location}</h2>
                <p>{bio}</p>
                <div class="social-links">
                    <a href="{github}" target="_blank">GitHub</a>
                    <a href="{linkedin}" target="_blank">LinkedIn</a>
                    <a href="mailto:{email}">Email Me</a>
                </div>
            </div>
            <div class="avatar-wrapper">
                <img src="{avatar}" alt="{name}" class="avatar" />
            </div>
        </header>

        <section>
            <h2>Technical Skills & Expertise</h2>
            <div class="skills-grid">
                {skills_chips_html}
            </div>
        </section>

        <section>
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                {projects_html}
            </div>
        </section>

        <section>
            <h2>Work & Experience</h2>
            <div class="timeline">
                {exp_html}
            </div>
        </section>

        <footer>
            <p>© 2026 {name}. Generated with Skill Match AI Portfolio Generator.</p>
        </footer>
    </div>
</body>
</html>"""
