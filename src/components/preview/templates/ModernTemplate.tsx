import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export function ModernTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const color = settings.color;

  return (
    <div className="w-full h-full bg-white text-slate-900 leading-relaxed" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className="flex items-center gap-8 pb-8 border-b-2" style={{ borderColor: color }}>
        {personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-slate-100" />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight" style={{ color }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl font-medium text-slate-600 mt-1.5">{personalInfo.title}</h2>
          
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-slate-500">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
              </span>
            )}
            {personalInfo.links.map(link => (
              <span key={link.id} className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" /> <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline hover:text-slate-800 transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mt-8">
          <p className="text-[15px] leading-relaxed text-slate-700">{personalInfo.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-10 mt-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color }}>
                Experience
              </h3>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-slate-900 text-[15px]">{exp.position}</h4>
                      <span className="text-sm text-slate-500 font-medium whitespace-nowrap ml-4">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 font-medium mb-2.5">{exp.company}</div>
                    <div className="text-[14px] text-slate-700 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color }}>
                Projects
              </h3>
              <div className="space-y-6">
                {projects.map(proj => (
                  <div key={proj.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-slate-900 text-[15px]">
                        {proj.name} {proj.url && <span className="text-sm font-normal text-slate-500 ml-2">| {proj.url}</span>}
                      </h4>
                      <span className="text-sm text-slate-500 font-medium whitespace-nowrap ml-4">
                        {proj.startDate} – {proj.endDate}
                      </span>
                    </div>
                    <div className="text-[14px] text-slate-700 whitespace-pre-line leading-relaxed mt-2">
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color }}>
                Education
              </h3>
              <div className="space-y-5">
                {education.map(edu => (
                  <div key={edu.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                    <h4 className="font-semibold text-slate-900 text-[15px]">{edu.degree} in {edu.field}</h4>
                    <div className="text-sm text-slate-600 mb-1 mt-0.5">{edu.school}</div>
                    <div className="text-xs text-slate-500 font-medium mb-2">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                    {edu.description && (
                      <div className="text-[13px] text-slate-700 leading-relaxed">{edu.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-5 flex items-center gap-2" style={{ color }}>
                Certifications
              </h3>
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                    <h4 className="font-semibold text-slate-900 text-[14px]">{cert.name}</h4>
                    <div className="text-[13px] text-slate-600 mt-0.5">{cert.issuer} | {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
