import React from 'react';

export default function ModernTechTemplate({ resumeData }) {
  const {
    fullName = 'Alex Rivera',
    email = 'alex.rivera@example.com',
    phone = '(555) 019-2834',
    location = 'San Francisco, CA',
    github = 'github.com/arivera',
    linkedin = 'linkedin.com/in/alexrivera',
    website = 'alexrivera.dev',
    summary = 'Innovative Senior Frontend Developer with 4+ years building high-performance web applications using React, TypeScript, and Tailwind CSS. Passionate about web accessibility, UI design systems, and modern frontend architecture.',
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = []
  } = resumeData || {};

  return (
    <div id="resume-printable-area" className="w-full bg-white text-slate-900 font-sans p-8 shadow-2xl rounded-xl min-h-[842px] max-w-[800px] mx-auto text-left leading-relaxed">
      
      {/* Header Accent */}
      <div className="border-b-2 border-indigo-600 pb-5 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{fullName}</h1>
          <p className="text-sm font-semibold text-indigo-600 mt-0.5">Software Engineer / Frontend Specialist</p>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <p>{email} • {phone}</p>
          <p>{location}</p>
          <p className="text-indigo-600 font-medium">{website} | {github}</p>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded text-[11px] font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></h3>
                  <span className="text-[11px] font-medium text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600"> — {edu.institution}</span>
                </div>
                <span className="text-slate-500 font-medium">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
            Key Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <span className="font-bold text-slate-900">{proj.title}: </span>
                <span className="text-slate-700">{proj.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
