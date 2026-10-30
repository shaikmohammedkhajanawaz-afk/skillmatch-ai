import React from 'react';

export default function ExecutiveTemplate({ resumeData }) {
  const {
    fullName = 'Alex Rivera',
    email = 'alex.rivera@example.com',
    phone = '(555) 019-2834',
    location = 'San Francisco, CA',
    linkedin = 'linkedin.com/in/alexrivera',
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = resumeData || {};

  return (
    <div id="resume-printable-area" className="w-full bg-white text-slate-900 font-serif p-8 shadow-2xl rounded-xl min-h-[842px] max-w-[800px] mx-auto text-left leading-relaxed">
      
      {/* Header Accent */}
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-wider uppercase font-sans">{fullName}</h1>
        <p className="text-xs text-slate-600 font-sans mt-1">{location} | {phone} | {email} | {linkedin}</p>
      </div>

      {summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-sans">
            Executive Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-3 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-4 font-sans">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.role} — <span className="italic">{exp.company}</span></h3>
                  <span className="text-[11px] text-slate-600">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-sans">
            Core Competencies & Skills
          </h2>
          <p className="text-xs text-slate-800 font-sans leading-normal">{skills.join(' • ')}</p>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-300 pb-1 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-1 font-sans text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                <span className="text-slate-600">{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
