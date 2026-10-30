import React from 'react';

export default function ClassicTemplate({ resumeData }) {
  const {
    fullName = 'Alex Rivera',
    email = 'alex.rivera@example.com',
    phone = '(555) 019-2834',
    location = 'San Francisco, CA',
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = resumeData || {};

  return (
    <div id="resume-printable-area" className="w-full bg-white text-slate-900 font-sans p-8 shadow-2xl rounded-xl min-h-[842px] max-w-[800px] mx-auto text-left leading-relaxed">
      
      <div className="border-b border-slate-400 pb-3 mb-5">
        <h1 className="text-2xl font-bold text-slate-900">{fullName}</h1>
        <p className="text-xs text-slate-700">{location} | {phone} | {email}</p>
      </div>

      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1.5">
            Summary
          </h2>
          <p className="text-xs text-slate-800">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1.5">
            Technical Skills
          </h2>
          <p className="text-xs text-slate-800">{skills.join(', ')}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span>{exp.role} — {exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 mb-1.5">
            Education
          </h2>
          <div className="space-y-1 text-xs">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{edu.degree}, {edu.institution}</span>
                <span>{edu.year}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
