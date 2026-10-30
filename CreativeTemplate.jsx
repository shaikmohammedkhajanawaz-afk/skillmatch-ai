import React from 'react';

export default function CreativeTemplate({ resumeData }) {
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
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 rounded-xl mb-6 shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight">{fullName}</h1>
        <p className="text-xs text-teal-100 mt-1 font-medium">{location} | {phone} | {email}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Left Column (Skills & Edu) */}
        <div className="col-span-1 space-y-6">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1">
                Skills & Tech
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[10px] font-semibold border border-emerald-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1">
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                    <p className="text-teal-600 text-[10px]">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Summary & Experience) */}
        <div className="col-span-2 space-y-6">
          {summary && (
            <div>
              <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 border-b border-teal-200 pb-1">
                About Me
              </h2>
              <p className="text-xs text-slate-700">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-3 border-b border-teal-200 pb-1">
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">{exp.duration}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-teal-700">{exp.company}</p>
                    <p className="text-xs text-slate-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
