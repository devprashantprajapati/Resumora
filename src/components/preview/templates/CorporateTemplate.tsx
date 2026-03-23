import { useResumeStore } from '@/store/useResumeStore';

export function CorporateTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const color = settings.color;

  return (
    <div className="w-full h-full bg-white text-zinc-900 leading-relaxed" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className="flex flex-col items-center text-center pb-5 border-b-4 mb-8" style={{ borderColor: color }}>
        <h1 className="text-4xl font-bold uppercase tracking-wider text-zinc-900 mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[14px] text-zinc-700 mt-2">
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.address && (personalInfo.city || personalInfo.country) && <span className="text-zinc-400">•</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>{personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}</span>
          )}
          {((personalInfo.address || personalInfo.city || personalInfo.country) && personalInfo.phone) && <span className="text-zinc-400">•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.phone && personalInfo.email) && <span className="text-zinc-400">•</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-[14px] text-zinc-700 mt-1.5">
          {personalInfo.links.map((link, index) => (
            <span key={link.id} className="flex items-center gap-3">
              <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline font-medium" style={{ color }}>{link.url}</a>
              {index < personalInfo.links.length - 1 && <span className="text-zinc-400">•</span>}
            </span>
          ))}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3 className="text-[15px] font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
            Professional Summary
          </h3>
          <p className="text-[14px] leading-relaxed text-zinc-800 text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[15px] font-bold uppercase tracking-widest mb-4 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
            Professional Experience
          </h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-zinc-900 text-[15px]">{exp.company}</h4>
                  <span className="text-[14px] font-semibold text-zinc-700">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[14px] font-semibold italic text-zinc-700 mb-2">{exp.position}</div>
                <div className="text-[14px] text-zinc-800 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-zinc-200">
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[15px] font-bold uppercase tracking-widest mb-4 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
            Education
          </h3>
          <div className="space-y-4">
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-zinc-900 text-[15px]">{edu.school}</h4>
                  <div className="text-[14px] text-zinc-800 mt-0.5">{edu.degree} in {edu.field}</div>
                  {edu.description && <div className="text-[13px] text-zinc-600 mt-1.5">{edu.description}</div>}
                </div>
                <span className="text-[14px] font-semibold text-zinc-700">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h3 className="text-[15px] font-bold uppercase tracking-widest mb-4 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
            Key Projects
          </h3>
          <div className="space-y-4">
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-zinc-900 text-[15px]">
                    {proj.name} {proj.url && <span className="font-normal italic text-zinc-600 ml-1">({proj.url})</span>}
                  </h4>
                  <span className="text-[14px] font-semibold text-zinc-700">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                <div className="text-[14px] text-zinc-800 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-zinc-200 mt-2">
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className="text-[15px] font-bold uppercase tracking-widest mb-4 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
              Core Competencies
            </h3>
            <ul className="list-disc list-inside text-[14px] text-zinc-800 grid grid-cols-2 gap-y-1.5 gap-x-4">
              {skills.map(skill => (
                <li key={skill.id} className="pl-1">{skill.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h3 className="text-[15px] font-bold uppercase tracking-widest mb-4 border-b-2 border-zinc-200 pb-1.5" style={{ color }}>
              Certifications
            </h3>
            <div className="space-y-3">
              {certifications.map(cert => (
                <div key={cert.id} className="text-[14px]">
                  <span className="font-bold text-zinc-900 block">{cert.name}</span>
                  <span className="text-zinc-700 mt-0.5 block">{cert.issuer} ({cert.date})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
