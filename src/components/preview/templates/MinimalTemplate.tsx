import { useResumeStore } from '@/store/useResumeStore';

export function MinimalTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  return (
    <div className="w-full h-full bg-white text-slate-900" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className="text-center pb-6 border-b border-slate-300 mb-6">
        <h1 className="text-3xl font-light tracking-widest uppercase mb-2">
          <span className="font-bold">{personalInfo.firstName}</span> {personalInfo.lastName}
        </h1>
        <h2 className="text-sm tracking-widest uppercase text-slate-500 mb-4">{personalInfo.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>• {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}</span>
          )}
          {personalInfo.links.map(link => (
            <span key={link.id}>• <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline">{link.label}</a></span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <p className="text-sm leading-relaxed text-slate-700 text-center max-w-3xl mx-auto">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Experience
          </h3>
          <div className="space-y-6">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900">{exp.position}</h4>
                  <span className="text-xs text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm text-slate-600 italic mb-2">{exp.company}</div>
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
            Projects
          </h3>
          <div className="space-y-6">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900">
                    {proj.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                {proj.url && <div className="text-xs text-slate-500 mb-2">{proj.url}</div>}
                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Education & Certs */}
        <div>
          {education.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                Education
              </h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-slate-900 text-sm">{edu.degree} in {edu.field}</h4>
                    <div className="text-sm text-slate-600">{edu.school}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-slate-900 text-sm">{cert.name}</h4>
                    <div className="text-xs text-slate-600">{cert.issuer} – {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Skills */}
        <div>
          {skills.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-2 mb-4">
                Skills
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {skills.map(skill => (
                  <span key={skill.id} className="text-sm text-slate-700">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
