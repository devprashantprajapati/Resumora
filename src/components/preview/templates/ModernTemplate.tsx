import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export function ModernTemplate({ data: propData }: { data?: ResumeData }) {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  const headingFont = settings.headingFont || settings.font;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-6', spaceY: 'space-y-4', mt: 'mt-6' };
      case 'relaxed': return { gap: 'gap-14', spaceY: 'space-y-12', mt: 'mt-14' };
      default: return { gap: 'gap-10', spaceY: 'space-y-8', mt: 'mt-10' };
    }
  };

  const getBorderRadius = (element: 'photo' | 'badge') => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return element === 'photo' ? 'rounded-2xl' : 'rounded-lg';
    }
  };

  const getAlignment = () => {
    switch (settings.headerAlignment) {
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-left items-start';
    }
  };

  const getFlexAlignment = () => {
    switch (settings.headerAlignment) {
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

  const spacing = getSpacing();
  const alignment = getAlignment();
  const flexAlignment = getFlexAlignment();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-zinc-900 leading-relaxed" style={{ fontFamily: settings.font }}>
      {/* Header */}
      <header className={`flex ${settings.headerAlignment === 'center' ? 'flex-col text-center' : settings.headerAlignment === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-center gap-8 pb-10 border-b-2`} style={{ borderColor: color }}>
        {settings.showPhoto && personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className={`w-32 h-32 object-cover shadow-md border-2 border-white ring-2 ring-zinc-100 ${getBorderRadius('photo')}`} />
        )}
        <div className={`flex-1 flex flex-col ${alignment}`}>
          <h1 className="text-4xl font-extrabold uppercase tracking-tight" style={{ color, fontFamily: headingFont }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl font-medium text-zinc-600 mt-2" style={{ fontFamily: headingFont }}>{personalInfo.title}</h2>
          
          <div className={`flex flex-wrap ${flexAlignment} gap-x-6 gap-y-2 mt-6 text-sm text-zinc-500`}>
            {personalInfo.email && (
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
              </span>
            )}
            {(personalInfo.links || []).map(link => (
              <span key={link.id} className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline hover:text-zinc-800 transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mt-8">
          <p className={`text-[15px] leading-relaxed text-zinc-700 ${bodyAlignClass}`}>{personalInfo.summary}</p>
        </section>
      )}

      <div className={`grid grid-cols-3 ${spacing.gap} ${spacing.mt}`}>
        {/* Left Column */}
        <div className={`col-span-2 ${spacing.spaceY}`}>
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Experience
              </h3>
              <div className={spacing.spaceY}>
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-zinc-900 text-[17px]">{exp.position}</h4>
                      <span className="text-sm text-zinc-500 font-medium whitespace-nowrap ml-4">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-zinc-600 font-medium mb-4">{exp.company}</div>
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {settings.showProjects !== false && projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Projects
              </h3>
              <div className={spacing.spaceY}>
                {projects.map(proj => (
                  <div key={proj.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-semibold text-zinc-900 text-[17px]">
                        {proj.name} {proj.url && <span className="text-sm font-normal text-zinc-500 ml-2">| {proj.url}</span>}
                      </h4>
                      <span className="text-sm text-zinc-500 font-medium whitespace-nowrap ml-4">
                        {proj.startDate} – {proj.endDate}
                      </span>
                    </div>
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed mt-2 ${bodyAlignClass}`}>
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className={spacing.spaceY}>
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className={`px-3 py-1.5 text-sm font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/60 ${getBorderRadius('badge')}`}
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
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Education
              </h3>
              <div className={spacing.spaceY}>
                {education.map(edu => (
                  <div key={edu.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                    <h4 className="font-semibold text-zinc-900 text-[16px]">{edu.degree} in {edu.field}</h4>
                    <div className="text-sm text-zinc-600 mb-1 mt-1">{edu.school}</div>
                    <div className="text-xs text-zinc-500 font-medium mb-2">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                    {edu.description && (
                      <div className={`text-sm text-zinc-700 leading-relaxed ${bodyAlignClass}`}>{edu.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {settings.showCertifications !== false && certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Certifications
              </h3>
              <div className={spacing.spaceY}>
                {certifications.map(cert => (
                  <div key={cert.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                    <h4 className="font-semibold text-zinc-900 text-[15px]">{cert.name}</h4>
                    <div className="text-sm text-zinc-600 mt-1">{cert.issuer} | {cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {settings.showLanguages !== false && languages?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Languages
              </h3>
              <div className={spacing.spaceY}>
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="font-medium text-zinc-900 text-[15px]">{lang.name}</span>
                    <span className="text-sm text-zinc-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {settings.showInterests !== false && interests?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <span 
                    key={interest.id} 
                    className={`px-3 py-1.5 text-sm font-medium bg-zinc-50 text-zinc-700 border border-zinc-200/60 ${getBorderRadius('badge')}`}
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {settings.showReferences !== false && references?.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color, fontFamily: headingFont }}>
                References
              </h3>
              <div className={spacing.spaceY}>
                {references.map(ref => (
                  <div key={ref.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                    <h4 className="font-semibold text-zinc-900 text-[15px]">{ref.name}</h4>
                    {ref.position && ref.company && (
                      <div className="text-sm text-zinc-600 mt-1">{ref.position}, {ref.company}</div>
                    )}
                    {(ref.email || ref.phone) && (
                      <div className="text-xs text-zinc-500 mt-1">
                        {ref.email && <div>{ref.email}</div>}
                        {ref.phone && <div>{ref.phone}</div>}
                      </div>
                    )}
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
