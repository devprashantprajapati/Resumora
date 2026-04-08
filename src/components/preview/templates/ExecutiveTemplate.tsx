import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export function ExecutiveTemplate({ data: propData }: { data?: ResumeData }) {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  const headingFont = settings.headingFont || settings.font;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-6', spaceY: 'space-y-4', mt: 'mt-6' };
      case 'relaxed': return { gap: 'gap-12', spaceY: 'space-y-10', mt: 'mt-12' };
      default: return { gap: 'gap-8', spaceY: 'space-y-8', mt: 'mt-8' };
    }
  };

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-zinc-900 flex flex-col" style={{ fontFamily: settings.font }}>
      <header className="text-white p-10 flex flex-col md:flex-row items-center md:items-start gap-8" style={{ backgroundColor: color }}>
        {settings.showPhoto && personalInfo.photoUrl && (
          <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 object-cover rounded-sm shadow-lg border-2 border-white/20 shrink-0" />
        )}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight uppercase mb-2" style={{ fontFamily: headingFont }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl font-medium text-white/80 tracking-wide uppercase mb-6" style={{ fontFamily: headingFont }}>{personalInfo.title}</h2>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-white/90">
            {personalInfo.email && (
              <span className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-70" /> {personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 opacity-70" /> {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
              </span>
            )}
            {(personalInfo.links || []).map(link => (
              <span key={link.id} className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 opacity-70" /> <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:text-white transition-colors">{link.label}</a>
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12">
        <div className={`md:col-span-8 p-10 ${spacing.spaceY}`}>
          {personalInfo.summary && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 pb-2" style={{ fontFamily: headingFont, borderColor: color, color }}>
                Executive Summary
              </h3>
              <p className={`text-[15px] leading-relaxed text-zinc-700 ${bodyAlignClass}`}>{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ fontFamily: headingFont, borderColor: color, color }}>
                Professional Experience
              </h3>
              <div className={spacing.spaceY}>
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-zinc-900 text-[17px]">{exp.position}</h4>
                      <span className="text-sm font-semibold" style={{ color }}>
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[15px] text-zinc-600 font-medium mb-3 uppercase tracking-wide">{exp.company}</div>
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showProjects !== false && projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 pb-2" style={{ fontFamily: headingFont, borderColor: color, color }}>
                Key Projects
              </h3>
              <div className={spacing.spaceY}>
                {projects.map(proj => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-zinc-900 text-[16px]">{proj.name}</h4>
                      <span className="text-sm font-semibold" style={{ color }}>
                        {proj.startDate} – {proj.endDate}
                      </span>
                    </div>
                    {proj.url && <div className="text-sm text-zinc-500 mb-2">{proj.url}</div>}
                    <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                      {proj.description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className={`md:col-span-4 bg-zinc-50 p-10 ${spacing.spaceY} border-l border-zinc-200`}>
          {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ fontFamily: headingFont, color }}>
                Core Competencies
              </h3>
              <div className="flex flex-col gap-2">
                {skills.map(skill => (
                  <div key={skill.id} className="text-[14px] text-zinc-800 font-medium">
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 mt-8" style={{ fontFamily: headingFont, color }}>
                Education
              </h3>
              <div className={spacing.spaceY}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-zinc-900 text-[14px]">{edu.degree}</h4>
                    <div className="text-[13px] text-zinc-700 mt-1">{edu.field}</div>
                    <div className="text-[13px] text-zinc-500 mt-1">{edu.school}</div>
                    <div className="text-[12px] text-zinc-400 mt-1">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showCertifications !== false && certifications.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 mt-8" style={{ fontFamily: headingFont, color }}>
                Certifications
              </h3>
              <div className={spacing.spaceY}>
                {certifications.map(cert => (
                  <div key={cert.id}>
                    <h4 className="font-bold text-zinc-900 text-[14px]">{cert.name}</h4>
                    <div className="text-[13px] text-zinc-600 mt-1">{cert.issuer}</div>
                    <div className="text-[12px] text-zinc-400 mt-1">{cert.date}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showLanguages !== false && languages?.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 mt-8" style={{ fontFamily: headingFont, color }}>
                Languages
              </h3>
              <div className="space-y-2">
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-[14px] font-medium text-zinc-800">{lang.name}</span>
                    <span className="text-[12px] text-zinc-500">{lang.proficiency}</span>
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