import { useResumeStore } from '@/store/useResumeStore';

export function CorporateTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const color = settings.color;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { mb: 'mb-4', spaceY: 'space-y-3', pb: 'pb-3' };
      case 'relaxed': return { mb: 'mb-8', spaceY: 'space-y-6', pb: 'pb-6' };
      default: return { mb: 'mb-6', spaceY: 'space-y-4', pb: 'pb-4' };
    }
  };

  const getBorderRadius = () => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return 'rounded-xl';
    }
  };

  const getAlignment = () => {
    switch (settings.headerAlignment) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      default: return 'items-center text-center';
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
    <div className="w-full h-full bg-white text-zinc-900 leading-relaxed" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className={`flex flex-col ${alignment} ${spacing.pb} border-b-4 ${spacing.mb}`} style={{ borderColor: color }}>
        {settings.showPhoto && personalInfo.photoUrl && (
          <img 
            src={personalInfo.photoUrl} 
            alt="Profile" 
            className={`w-28 h-28 object-cover shadow-md mb-4 border-2 border-white ring-2 ring-zinc-200 ${getBorderRadius()}`} 
          />
        )}
        <h1 className="text-3xl font-bold uppercase tracking-wider text-zinc-900 mb-1.5">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className={`flex flex-wrap ${flexAlignment} items-center gap-x-3 gap-y-1 text-xs text-zinc-700 mt-1.5`}>
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
        <div className={`flex flex-wrap ${flexAlignment} items-center gap-x-3 gap-y-1 text-xs text-zinc-700 mt-1`}>
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
        <section className={spacing.mb}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2.5 border-b-2 border-zinc-200 pb-1" style={{ color }}>
            Professional Summary
          </h3>
          <p className={`text-xs leading-relaxed text-zinc-800 ${bodyAlignClass}`}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className={spacing.mb}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1" style={{ color }}>
            Professional Experience
          </h3>
          <div className={spacing.spaceY}>
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-zinc-900 text-sm">{exp.company}</h4>
                  <span className="text-xs font-semibold text-zinc-700">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold italic text-zinc-700 mb-1.5">{exp.position}</div>
                <div className={`text-xs text-zinc-800 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-zinc-200 ${bodyAlignClass}`}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className={spacing.mb}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1" style={{ color }}>
            Education
          </h3>
          <div className={spacing.spaceY}>
            {education.map(edu => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">{edu.school}</h4>
                  <div className="text-xs text-zinc-800 mt-0.5">{edu.degree} in {edu.field}</div>
                  {edu.description && <div className="text-[11px] text-zinc-600 mt-1">{edu.description}</div>}
                </div>
                <span className="text-xs font-semibold text-zinc-700">
                  {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className={spacing.mb}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1" style={{ color }}>
            Key Projects
          </h3>
          <div className={spacing.spaceY}>
            {projects.map(proj => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-zinc-900 text-sm">
                    {proj.name} {proj.url && <span className="font-normal italic text-zinc-600 ml-1">({proj.url})</span>}
                  </h4>
                  <span className="text-xs font-semibold text-zinc-700">
                    {proj.startDate} – {proj.endDate}
                  </span>
                </div>
                <div className={`text-xs text-zinc-800 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-zinc-200 mt-1.5 ${bodyAlignClass}`}>
                  {proj.description}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1" style={{ color }}>
              Core Competencies
            </h3>
            <ul className="list-disc list-inside text-xs text-zinc-800 grid grid-cols-2 gap-y-1 gap-x-3">
              {skills.map(skill => (
                <li key={skill.id} className="pl-1">{skill.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b-2 border-zinc-200 pb-1" style={{ color }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {certifications.map(cert => (
                <div key={cert.id} className="text-xs">
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
