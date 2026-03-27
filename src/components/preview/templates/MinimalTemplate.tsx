import { useResumeStore } from '@/store/useResumeStore';

export function MinimalTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { mb: 'mb-4', spaceY: 'space-y-3' };
      case 'relaxed': return { mb: 'mb-8', spaceY: 'space-y-6' };
      default: return { mb: 'mb-6', spaceY: 'space-y-4' };
    }
  };

  const getBorderRadius = () => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-2xl';
    }
  };

  const getAlignment = () => {
    switch (settings.headerAlignment) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      default: return 'text-center items-center';
    }
  };

  const getFlexAlignment = () => {
    switch (settings.headerAlignment) {
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-center';
    }
  };

  const spacing = getSpacing();
  const alignment = getAlignment();
  const flexAlignment = getFlexAlignment();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-zinc-900" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className={`${alignment} pb-5 border-b border-zinc-300 mb-5 flex flex-col`}>
        {settings.showPhoto && personalInfo.photoUrl && (
          <img 
            src={personalInfo.photoUrl} 
            alt="Profile" 
            className={`w-24 h-24 object-cover shadow-sm mb-4 ${getBorderRadius()}`} 
          />
        )}
        <h1 className="text-2xl font-light tracking-widest uppercase mb-1.5">
          <span className="font-bold">{personalInfo.firstName}</span> {personalInfo.lastName}
        </h1>
        <h2 className="text-xs tracking-widest uppercase text-zinc-500 mb-3">{personalInfo.title}</h2>
        
        <div className={`flex flex-wrap ${flexAlignment} gap-x-4 gap-y-1 text-[11px] text-zinc-600`}>
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
        <section className={spacing.mb}>
          <p className={`text-xs leading-relaxed text-zinc-700 max-w-3xl mx-auto ${settings.headerAlignment === 'center' && settings.bodyAlignment !== 'justify' ? 'text-center' : bodyAlignClass}`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={spacing.mb}>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1.5 mb-3">
            Experience
          </h3>
          <div className={spacing.spaceY}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-zinc-900 text-sm">{exp.position}</h4>
                  <span className="text-[11px] text-zinc-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-zinc-600 italic mb-1.5">{exp.company}</div>
                <div className={`text-xs text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={spacing.mb}>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1.5 mb-3">
            Projects
          </h3>
          <div className={spacing.spaceY}>
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-zinc-900 text-sm">
                    {proj.name}
                  </h4>
                  <span className="text-[11px] text-zinc-500">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                {proj.url && <div className="text-[11px] text-zinc-500 mb-1.5">{proj.url}</div>}
                <div className={`text-xs text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Education & Certs */}
        <div>
          {education.length > 0 && (
            <section className={spacing.mb}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1.5 mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-zinc-900 text-xs">{edu.degree} in {edu.field}</h4>
                    <div className="text-xs text-zinc-600">{edu.school}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1.5 mb-3">
                Certifications
              </h3>
              <div className="space-y-2">
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-zinc-900 text-xs">{cert.name}</h4>
                    <div className="text-[11px] text-zinc-600">{cert.issuer} – {cert.date}</div>
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
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-1.5 mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {skills.map(skill => (
                  <span key={skill.id} className="text-xs text-zinc-700">
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
