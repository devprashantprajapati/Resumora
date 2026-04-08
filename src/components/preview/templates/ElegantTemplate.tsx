import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export function ElegantTemplate({ data: propData }: { data?: ResumeData }) {
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

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-[#faf9f6] text-zinc-900 leading-relaxed" style={{ fontFamily: settings.font }}>
      <div className="border-b-[3px] pb-10 mb-10" style={{ borderColor: color }}>
        <header className="text-center">
          {settings.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="Profile" className="w-28 h-28 object-cover rounded-full mx-auto mb-6 border-4 border-white shadow-sm" />
          )}
          <h1 className="text-5xl font-normal tracking-wide uppercase mb-3" style={{ fontFamily: headingFont, color }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl tracking-widest uppercase text-zinc-500 mb-6" style={{ fontFamily: headingFont }}>{personalInfo.title}</h2>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>{personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}</span>
            )}
            {(personalInfo.links || []).map(link => (
              <a key={link.id} href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline" style={{ color }}>{link.label}</a>
            ))}
          </div>
        </header>

        {personalInfo.summary && (
          <div className="mt-10 max-w-3xl mx-auto text-center">
            <p className={`text-[15px] leading-loose text-zinc-700 italic ${bodyAlignClass}`}>{personalInfo.summary}</p>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-12 ${spacing.gap}`}>
        <div className={`md:col-span-8 ${spacing.spaceY}`}>
          {experience.length > 0 && (
            <section>
              <h3 className="text-2xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Experience
              </h3>
              <div className={spacing.spaceY}>
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-zinc-900 text-[17px]">{exp.position}</h4>
                      <span className="text-sm text-zinc-500 italic">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[15px] text-zinc-600 uppercase tracking-wider mb-4" style={{ color }}>{exp.company}</div>
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-loose ${bodyAlignClass}`}>
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showProjects !== false && projects.length > 0 && (
            <section>
              <h3 className="text-2xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Projects
              </h3>
              <div className={spacing.spaceY}>
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-zinc-900 text-[17px]">
                        {proj.name}
                      </h4>
                      <span className="text-sm text-zinc-500 italic">
                        {proj.startDate} – {proj.endDate}
                      </span>
                    </div>
                    {proj.url && <div className="text-sm mb-2" style={{ color }}>{proj.url}</div>}
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-loose ${bodyAlignClass}`}>
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className={`md:col-span-4 ${spacing.spaceY}`}>
          {education.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Education
              </h3>
              <div className={spacing.spaceY}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-zinc-900 text-[15px]">{edu.degree} in {edu.field}</h4>
                    <div className="text-sm text-zinc-600 mt-1">{edu.school}</div>
                    <div className="text-sm text-zinc-500 italic mt-1">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Skills
              </h3>
              <div className="flex flex-col gap-3">
                {skills.map(skill => (
                  <div key={skill.id} className="flex justify-between items-center border-b border-zinc-200 pb-2">
                    <span className="text-[15px] text-zinc-800">{skill.name}</span>
                    <span className="text-xs tracking-widest uppercase text-zinc-400">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showCertifications !== false && certifications.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Certifications
              </h3>
              <div className={spacing.spaceY}>
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-zinc-900 text-[15px]">{cert.name}</h4>
                    <div className="text-sm text-zinc-600 mt-1">{cert.issuer}</div>
                    <div className="text-sm text-zinc-500 italic mt-1">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showLanguages !== false && languages?.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Languages
              </h3>
              <div className={spacing.spaceY}>
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-[15px] text-zinc-800">{lang.name}</span>
                    <span className="text-sm text-zinc-500 italic">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showInterests !== false && interests?.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                Interests
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[15px] text-zinc-700">
                {interests.map((interest, i) => (
                  <span key={interest.id}>
                    {interest.name}{i < interests.length - 1 ? <span className="text-zinc-300 ml-4">•</span> : ''}
                  </span>
                ))}
              </div>
            </section>
          )}

          {settings.showReferences !== false && references?.length > 0 && (
            <section>
              <h3 className="text-xl font-normal tracking-widest uppercase mb-6 border-b pb-2" style={{ fontFamily: headingFont, color, borderColor: `${color}40` }}>
                References
              </h3>
              <div className={spacing.spaceY}>
                {references.map(ref => (
                  <div key={ref.id}>
                    <h4 className="font-bold text-zinc-900 text-[15px]">{ref.name}</h4>
                    <div className="text-sm text-zinc-600 mt-1">{ref.position}, {ref.company}</div>
                    <div className="text-sm text-zinc-500 mt-1">{ref.email}</div>
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